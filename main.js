(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = window.gsap && window.ScrollTrigger;
  if (!hasGsap || reduce) root.classList.add('no-motion');

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (hasGsap && !reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const NAV_H = 76;
  const scrollToEl = (el) => {
    if (lenis) lenis.scrollTo(el, { offset: -NAV_H });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ---------- nav ---------- */
  const nav = document.querySelector('[data-nav]');
  const burger = nav.querySelector('.nav__burger');
  const drawer = document.getElementById('drawer');
  const setDrawer = (open) => {
    drawer.hidden = !open;
    nav.classList.toggle('is-solid', open || window.scrollY > 40);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    burger.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
  };
  burger.addEventListener('click', () => setDrawer(drawer.hidden));

  // dropdowns: services and language
  const dds = [...document.querySelectorAll('[data-dd]')];
  const closeDd = (except) => dds.forEach((d) => {
    if (d === except) return;
    d.querySelector('.dd__btn').setAttribute('aria-expanded', 'false');
    d.querySelector('.dd__menu').hidden = true;
  });
  dds.forEach((d) => {
    const btn = d.querySelector('.dd__btn');
    const menu = d.querySelector('.dd__menu');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu.hidden;
      closeDd(d);
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', () => closeDd());
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeDd();
    if (!drawer.hidden) { setDrawer(false); burger.focus(); }
  });

  // only touch the DOM when the nav state actually changes
  let lastY = 0, solid = null, hidden = null;
  const onScroll = () => {
    const y = window.scrollY;
    const s = y > 40 || !drawer.hidden;
    let h = hidden;
    if (!drawer.hidden || y <= 500) h = false;
    else if (y > lastY + 2) h = true;
    else if (y < lastY - 2) h = false;
    if (s !== solid) { nav.classList.toggle('is-solid', s); solid = s; }
    if (h !== hidden) { nav.classList.toggle('is-hidden', h); hidden = h; if (h) closeDd(); }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = id.length > 1 && document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      setDrawer(false);
      closeDd();
      scrollToEl(el);
      history.replaceState(null, '', id);
    });
  });

  const links = [...document.querySelectorAll('.nav__links > a[href^="#"]')];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  [...new Set(links.map((l) => l.getAttribute('href')))].forEach((h) => { const s = document.querySelector(h); if (s) io.observe(s); });

  /* ---------- a chosen service travels into the form ---------- */
  const serviceInput = document.getElementById('f-service');
  const msg = document.getElementById('f-msg');
  document.querySelectorAll('[data-service]').forEach((el) => {
    el.addEventListener('click', () => {
      serviceInput.value = el.dataset.service;
      if (!msg.value) msg.value = el.dataset.service + ': ';
    });
  });

  /* ---------- all services ---------- */
  const moreBtn = document.querySelector('[data-more]');
  const more = document.getElementById('cards-more');
  moreBtn.addEventListener('click', () => {
    const open = more.hidden;
    more.hidden = !open;
    moreBtn.setAttribute('aria-expanded', String(open));
    moreBtn.firstChild.textContent = open ? 'Свернуть ' : 'Все услуги ';
    if (open && hasGsap && !reduce) {
      gsap.fromTo(more.querySelectorAll('.card'), { clipPath: 'inset(100% 0 0 0 round 20px)' }, { clipPath: 'inset(0% 0 0 0 round 20px)', duration: 1, ease: 'expo.out', stagger: 0.08 });
    }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });

  /* ---------- projects carousel ---------- */
  const track = document.querySelector('[data-carousel]');
  const prev = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  const step = () => track.querySelector('li').getBoundingClientRect().width + 16;
  const syncNav = () => {
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
  track.addEventListener('scroll', syncNav, { passive: true });
  syncNav();

  /* ---------- reviews slider: arrows, dots, swipe ---------- */
  const rvTrack = document.querySelector('[data-reviews]');
  if (rvTrack) {
    const slides = [...rvTrack.children];
    const dotsBox = document.querySelector('[data-rv-dots]');
    const rvPrev = document.querySelector('[data-rv-prev]');
    const rvNext = document.querySelector('[data-rv-next]');
    const go = (i) => rvTrack.scrollTo({ left: i * rvTrack.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Отзыв ${i + 1}`);
      b.addEventListener('click', () => go(i));
      dotsBox.appendChild(b);
      return b;
    });
    const current = () => Math.round(rvTrack.scrollLeft / rvTrack.clientWidth);
    const sync = () => {
      const i = current();
      dots.forEach((d, k) => d.setAttribute('aria-selected', String(k === i)));
      rvPrev.disabled = i === 0;
      rvNext.disabled = i === slides.length - 1;
    };
    rvPrev.addEventListener('click', () => go(Math.max(0, current() - 1)));
    rvNext.addEventListener('click', () => go(Math.min(slides.length - 1, current() + 1)));
    rvTrack.addEventListener('scroll', sync, { passive: true });
    sync();
  }

  /* ---------- form ---------- */
  const form = document.querySelector('[data-form]');
  const status = form.querySelector('[data-status]');
  const phone = form.querySelector('#f-phone');
  // +998 XX XXX XX XX as the user types
  const fmtPhone = (v) => {
    let d = v.replace(/\D/g, '');
    if (!d.startsWith('998')) d = '998' + d.replace(/^998?/, '');
    d = d.slice(0, 12);
    const p = [d.slice(0, 3), d.slice(3, 5), d.slice(5, 8), d.slice(8, 10), d.slice(10, 12)].filter(Boolean);
    return '+' + p.join(' ');
  };
  phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+998 '; });
  phone.addEventListener('blur', () => { if (phone.value.replace(/\D/g, '') === '998') phone.value = ''; });
  phone.addEventListener('input', () => { phone.value = fmtPhone(phone.value); phone.removeAttribute('aria-invalid'); });
  form.querySelector('#f-name').addEventListener('input', (e) => e.target.removeAttribute('aria-invalid'));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((f) => {
      const bad = f === phone ? f.value.replace(/\D/g, '').length < 12 : !f.value.trim();
      f.setAttribute('aria-invalid', String(bad));
      if (bad) ok = false;
    });
    status.classList.remove('is-ok');
    status.classList.toggle('is-error', !ok);
    if (!ok) { status.textContent = 'Укажите имя и телефон в формате +998 XX XXX XX XX.'; form.querySelector('[aria-invalid="true"]').focus(); return; }
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      status.textContent = 'Отправка подключается на этапе сборки сайта. Пока позвоните: +998\u00a055\u00a0520\u00a002\u00a002.';
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    const label = btn.firstChild.textContent;
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    btn.firstChild.textContent = 'Отправка… ';
    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form) });
      if (!res.ok) throw new Error(res.status);
      status.classList.add('is-ok');
      status.textContent = 'Заявка отправлена. Менеджер свяжется с вами.';
      form.reset();
    } catch {
      status.classList.add('is-error');
      status.textContent = 'Не удалось отправить. Позвоните: +998\u00a055\u00a0520\u00a002\u00a002.';
    } finally { btn.disabled = false; btn.removeAttribute('aria-busy'); btn.firstChild.textContent = label; }
  });

  if (reduce) { const v = document.querySelector('.hero video'); if (v) { v.removeAttribute('autoplay'); v.pause(); } }
  if (!hasGsap || reduce) return;

  /* ================= motion ================= */
  gsap.registerPlugin(ScrollTrigger);
  if (window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);
  const ease = 'expo.out';
  const fmt = (v, dec) => dec ? v.toFixed(dec) : Math.round(v).toLocaleString('ru-RU').replace(/ /g, ' ');

  /* hero: lines rise out of a mask, letters of the lime line follow */
  const heroImg = document.querySelector('[data-hero-img]');
  document.querySelectorAll('[data-split] .line').forEach((line) => {
    const inner = document.createElement('span');
    inner.className = 'line__in';
    inner.style.display = 'inline-block';
    while (line.firstChild) inner.appendChild(line.firstChild);
    line.appendChild(inner);
    line.style.overflow = 'clip';
    // background-clip: text must sit on the element that moves
    if (line.classList.contains('line--grad')) { line.classList.remove('line--grad'); inner.classList.add('line--grad'); }
  });
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach((c) => { c.textContent = fmt(0, +c.dataset.dec || 0); });
  gsap.timeline({ defaults: { ease } })
    .from(heroImg, { scale: 1.25, xPercent: 8, opacity: 0, duration: 2.4 }, 0)
    .from('.line__in', { yPercent: 115, rotate: 4, duration: 1.4, stagger: 0.13 }, 0.15)
    .to('[data-rise]', { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.7)
    .add(() => counters.forEach((c) => {
      const end = +c.dataset.count, dec = +c.dataset.dec || 0, o = { v: 0 };
      gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', onUpdate: () => { c.textContent = fmt(o.v, dec); } });
    }), 1.1);

  /* stats: icons pop in with the counters */
  gsap.from('.stat__icon', { scale: 0.4, rotate: -25, opacity: 0, duration: 0.9, ease: 'back.out(2.2)', stagger: 0.12, delay: 1.05, clearProps: 'transform,opacity' });

  gsap.to(heroImg, { yPercent: 14, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__inner', { yPercent: -20, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true } });

  /* road: the truck drives the curve and lights it behind itself */
  const truck = document.querySelector('[data-road-truck]');
  const lit = document.querySelector('[data-road]');
  if (window.MotionPathPlugin) {
    const roadTl = gsap.timeline({ scrollTrigger: { trigger: '.road', start: 'top 85%', end: 'bottom 15%', scrub: 0.8, invalidateOnRefresh: true } });
    roadTl.set(truck, { opacity: 1 })
      .to(truck, { ease: 'none', motionPath: { path: lit, align: lit, alignOrigin: [0.5, 0.5] } }, 0)
      .to(lit, { strokeDashoffset: 0, ease: 'none' }, 0);
  }

  /* section heads */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease, stagger: 0.08 }),
  });

  /* service cards: a shutter opens each photo */
  gsap.fromTo('[data-cards] .card', { clipPath: 'inset(100% 0% 0% 0% round 20px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.3, ease, stagger: 0.1,
    scrollTrigger: { trigger: '[data-cards]', start: 'top 85%' },
  });
  gsap.from('[data-cards] .card img', { scale: 1.3, duration: 1.6, ease, stagger: 0.1, scrollTrigger: { trigger: '[data-cards]', start: 'top 85%' } });

  /* transport types: the marker drives the winding route, each vehicle rolls in to its spot */
  const types = document.querySelector('[data-types]');
  if (types && window.MotionPathPlugin) {
    const rtPath = types.querySelector('[data-rt-path]');
    const rtMarker = types.querySelector('[data-rt-marker]');
    gsap.timeline({ scrollTrigger: { trigger: types, start: 'top 55%', end: 'bottom 55%', scrub: 1 } })
      .to(rtPath, { strokeDashoffset: 0, ease: 'none' }, 0)
      .to(rtMarker, { ease: 'none', motionPath: { path: rtPath, align: rtPath, alignOrigin: [0.5, 0.5] } }, 0);
    const shift = { left: { x: -260 }, right: { x: 260 }, up: { y: 120 } };
    types.querySelectorAll('.rt-veh').forEach((veh) => {
      gsap.from(veh, { ...shift[veh.dataset.from], opacity: 0, ease: 'power2.out', scrollTrigger: { trigger: veh, start: 'top 92%', end: 'top 58%', scrub: 0.8 } });
    });
    types.querySelectorAll('.rt-cloud').forEach((cloud) => {
      gsap.fromTo(cloud, { x: -70 * +cloud.dataset.drift }, { x: 70 * +cloud.dataset.drift, ease: 'none', scrollTrigger: { trigger: cloud, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.fromTo(types.querySelector('.rt-waves'), { x: -40 }, { x: 40, ease: 'none', scrollTrigger: { trigger: types, start: 'center bottom', end: 'bottom top', scrub: true } });
    gsap.from(types.querySelectorAll('.types__labels li'), { opacity: 0, y: 12, duration: 0.8, ease, stagger: 0.08, scrollTrigger: { trigger: types, start: 'top 75%' } });
  }

  /* map: routes draw into Tashkent */
  gsap.timeline({ scrollTrigger: { trigger: '.geo', start: 'top 70%', end: 'center 45%', scrub: 0.8 } })
    .from('.geo__dot', { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', stagger: 0.1, duration: 0.2 }, 0)
    .to('.geo__arc', { strokeDashoffset: 0, stagger: 0.12, duration: 1 }, 0.1)
    .from('.geo__hub', { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', duration: 0.3 }, 0.9)
    .from('.geo__label', { opacity: 0, y: 10, duration: 0.3 }, 1);
  gsap.fromTo('.geo__map', { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.geo', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('[data-geo-list] li', { x: 60, opacity: 0, duration: 1, ease, stagger: 0.1, scrollTrigger: { trigger: '[data-geo-list]', start: 'top 85%' } });

  /* advantages */
  gsap.from('[data-feats] .feat', { y: 50, opacity: 0, duration: 1, ease, stagger: 0.1, scrollTrigger: { trigger: '[data-feats]', start: 'top 85%' } });
  gsap.from('.why__photo', { clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)', duration: 1.6, ease, scrollTrigger: { trigger: '.why', start: 'top 75%' } });

  /* steps: each one lands, the connector draws to the next */
  const stl = gsap.timeline({ scrollTrigger: { trigger: '[data-steps]', start: 'top 80%' } });
  document.querySelectorAll('[data-steps] > li').forEach((li) => {
    if (li.classList.contains('step__arrow')) stl.from(li.querySelector('span'), { scaleX: 0, duration: 0.5, ease: 'power2.out' }).from(li.querySelector('svg'), { x: -10, opacity: 0, duration: 0.3 }, '<0.3');
    else stl.from(li, { y: 30, opacity: 0, duration: 0.6, ease });
  });

  /* reviews: the card slides over the portrait */
  gsap.from('.reviews__slider', { x: 80, opacity: 0, duration: 1.2, ease, scrollTrigger: { trigger: '.reviews', start: 'top 75%' } });
  gsap.from('.clients-row__list li', { y: 20, opacity: 0, duration: 0.8, ease, stagger: 0.06, scrollTrigger: { trigger: '.clients-row', start: 'top 90%' } });

  /* projects slide in from the right */
  gsap.from('[data-carousel] li', { x: 120, opacity: 0, duration: 1.2, ease, stagger: 0.08, scrollTrigger: { trigger: '[data-carousel]', start: 'top 85%' } });

  /* parallax in framed photos */
  document.querySelectorAll('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* magnetic lime buttons */
  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-magnet]').forEach((b) => {
      const xTo = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* endless loops (map pulse, scroll cue) pause while their section is off screen */
  const loopIo = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)));
  document.querySelectorAll('.hero, .geo').forEach((s) => loopIo.observe(s));
  const heroVideo = document.querySelector('.hero video');
  if (heroVideo) new IntersectionObserver(([e]) => { if (e.isIntersecting) heroVideo.play().catch(() => {}); else heroVideo.pause(); }).observe(heroVideo);

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
