(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = window.gsap && window.ScrollTrigger;
  // interface strings follow <html lang>: the page is built in Uzbek (root) and Russian (/ru/)
  const T = {
    ru: { menuOpen: 'Открыть меню', menuClose: 'Закрыть меню', more: 'Все услуги ', less: 'Свернуть ', invalid: 'Укажите имя и телефон в формате +998 XX XXX XX XX.',
      offline: 'Отправка подключается на этапе сборки сайта. Пока позвоните: +998\u00a055\u00a0520\u00a002\u00a002.', sending: 'Отправка… ',
      sent: 'Заявка отправлена. Менеджер свяжется с вами.', failed: 'Не удалось отправить. Позвоните: +998\u00a055\u00a0520\u00a002\u00a002.' },
    uz: { menuOpen: 'Menyuni ochish', menuClose: 'Menyuni yopish', more: 'Barcha xizmatlar ', less: 'Yig‘ish ', invalid: 'Ism va telefonni +998 XX XXX XX XX formatida kiriting.',
      offline: 'Ariza yuborish sayt ishga tushganda ulanadi. Hozircha qo‘ng‘iroq qiling: +998\u00a055\u00a0520\u00a002\u00a002.', sending: 'Yuborilmoqda… ',
      sent: 'Ariza yuborildi. Menejer siz bilan bog‘lanadi.', failed: 'Yuborib bo‘lmadi. Qo‘ng‘iroq qiling: +998\u00a055\u00a0520\u00a002\u00a002.' },
  }[root.lang] || {};
  if (!hasGsap || reduce) root.classList.add('no-motion');

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (hasGsap && !reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToEl = (el) => {
    if (lenis) lenis.scrollTo(el, { offset: -nav.offsetHeight });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ---------- theme: the head script already set it; the button flips and remembers it ---------- */
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const setTheme = (t, save) => {
    root.dataset.theme = t;
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
    if (save) { try { localStorage.setItem('bsm-theme', t); } catch { /* private mode: the choice lasts this page */ } }
  };
  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  if (themeBtn) themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('bsm-theme'); } catch { /* no storage: follow the system */ }
    if (!saved) setTheme(e.matches ? 'dark' : 'light');
  });
  if (themeMeta) themeMeta.content = '#07070A';

  /* ---------- nav ---------- */
  const nav = document.querySelector('[data-nav]');
  const burger = nav.querySelector('.nav__burger');
  const drawer = document.getElementById('drawer');
  const setDrawer = (open) => {
    drawer.hidden = !open;
    root.classList.toggle('is-locked', open);
    if (lenis) open ? lenis.stop() : lenis.start();
    nav.classList.toggle('is-solid', open || window.scrollY > 40);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
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

  // popup triggers keep their #contact href only as the no-dialog fallback
  const anchorSel = window.HTMLDialogElement ? 'a[href^="#"]:not([data-modal])' : 'a[href^="#"]';
  document.querySelectorAll(anchorSel).forEach((a) => {
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

  /* ---------- all services ---------- */
  const moreBtn = document.querySelector('[data-more]');
  const more = document.getElementById('cards-more');
  if (moreBtn) moreBtn.addEventListener('click', () => {
    const open = more.hidden;
    more.hidden = !open;
    moreBtn.setAttribute('aria-expanded', String(open));
    moreBtn.firstChild.textContent = open ? T.less : T.more;
    if (open && hasGsap && !reduce) {
      gsap.fromTo(more.querySelectorAll('.card'), { clipPath: 'inset(100% 0 0 0 round 20px)' }, { clipPath: 'inset(0% 0 0 0 round 20px)', duration: 1, ease: 'expo.out', stagger: 0.08 });
    }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });

  /* ---------- warehouses carousel ---------- */
  const track = document.querySelector('[data-carousel]');
  if (track) {
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
  }

  /* ---------- forms (section + popup) ---------- */
  // +998 XX XXX XX XX as the user types
  const fmtPhone = (v) => {
    let d = v.replace(/\D/g, '');
    if (!d.startsWith('998')) d = '998' + d.replace(/^998?/, '');
    d = d.slice(0, 12);
    const p = [d.slice(0, 3), d.slice(3, 5), d.slice(5, 8), d.slice(8, 10), d.slice(10, 12)].filter(Boolean);
    return '+' + p.join(' ');
  };
  document.querySelectorAll('[data-form]').forEach((form) => {
    const status = form.querySelector('[data-status]');
    const phone = form.querySelector('input[type="tel"]');
    phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+998 '; });
    phone.addEventListener('blur', () => { if (phone.value.replace(/\D/g, '') === '998') phone.value = ''; });
    phone.addEventListener('input', () => { phone.value = fmtPhone(phone.value); phone.removeAttribute('aria-invalid'); });
    form.querySelectorAll('[required]').forEach((f) => f.addEventListener('input', () => f.removeAttribute('aria-invalid')));
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
      if (!ok) { status.textContent = T.invalid; form.querySelector('[aria-invalid="true"]').focus(); return; }
      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        status.textContent = T.offline;
        return;
      }
      const btn = form.querySelector('[type="submit"]');
      const label = btn.firstChild.textContent;
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      btn.firstChild.textContent = T.sending;
      try {
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form) });
        if (!res.ok) throw new Error(res.status);
        status.classList.add('is-ok');
        status.textContent = T.sent;
        form.reset();
      } catch {
        status.classList.add('is-error');
        status.textContent = T.failed;
      } finally { btn.disabled = false; btn.removeAttribute('aria-busy'); btn.firstChild.textContent = label; }
    });
  });

  /* ---------- lead popup ---------- */
  const dialog = document.querySelector('[data-modal-dialog]');
  if (dialog && dialog.showModal) {
    let opener = null;
    const panel = dialog.querySelector('.modal__panel');
    // the keyboard shrinks only the visual viewport: keep the sheet above it, the active field in view
    const vv = window.visualViewport;
    const fitDialog = () => {
      if (!vv || !dialog.open) return;
      dialog.style.top = `${vv.offsetTop}px`;
      dialog.style.height = `${vv.height}px`;
      dialog.classList.toggle('is-kb', vv.height < window.innerHeight * 0.8);
      const field = document.activeElement;
      if (field && field.matches('.modal input:not([type="radio"]), .modal textarea')) field.scrollIntoView({ block: 'nearest' });
    };
    if (vv) { vv.addEventListener('resize', fitDialog); vv.addEventListener('scroll', fitDialog); }
    const close = () => {
      if (!dialog.open || dialog.classList.contains('is-closing')) return;
      if (reduce) { dialog.close(); return; }
      dialog.classList.add('is-closing');
      setTimeout(() => { dialog.classList.remove('is-closing'); dialog.close(); }, 220); // matches the CSS exit
    };
    dialog.addEventListener('close', () => { panel.style.transform = ''; dialog.style.top = ''; dialog.style.height = ''; dialog.classList.remove('is-kb'); root.classList.remove('is-locked'); if (lenis) lenis.start(); if (opener) opener.focus(); });
    dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
    dialog.querySelectorAll('[data-modal-close]').forEach((b) => b.addEventListener('click', close));
    document.querySelectorAll('[data-modal]').forEach((el) => el.addEventListener('click', (e) => {
      e.preventDefault();
      opener = el;
      const svc = el.dataset.service;
      dialog.querySelectorAll('input[name="service"]').forEach((r) => { r.checked = r.value === svc; });
      if (!drawer.hidden) setDrawer(false);
      root.classList.add('is-locked');
      if (lenis) lenis.stop();
      dialog.showModal();
      fitDialog();
      // scroll only the chip row: scrollIntoView would also move the sheet mid-animation
      const picked = dialog.querySelector('input[name="service"]:checked');
      const chips = dialog.querySelector('.chips-opt__row');
      chips.scrollLeft = picked ? picked.parentElement.offsetLeft - (chips.clientWidth - picked.parentElement.offsetWidth) / 2 : 0;
      // on touch the sheet opens calm: a focused field would throw the keyboard over it
      if (matchMedia('(hover: hover)').matches) dialog.querySelector(svc ? '#m-from' : '.chip-opt input').focus();
    }));

    // the sheet follows a drag on its grabber and leaves past 96px
    const grab = dialog.querySelector('[data-modal-grab]');
    let dragY = null;
    grab.addEventListener('pointerdown', (e) => { dragY = e.clientY; grab.setPointerCapture(e.pointerId); panel.classList.add('is-dragging'); });
    grab.addEventListener('pointermove', (e) => { if (dragY !== null) panel.style.transform = `translateY(${Math.max(0, e.clientY - dragY)}px)`; });
    const drop = (e) => {
      if (dragY === null) return;
      const far = e.clientY - dragY > 96;
      dragY = null;
      panel.classList.remove('is-dragging');
      if (far) close(); else panel.style.transform = '';
    };
    grab.addEventListener('pointerup', drop);
    grab.addEventListener('pointercancel', drop);
  }

  /* ---------- dock: steps aside while the hero action or the form is on screen ---------- */
  const dock = document.querySelector('[data-dock]');
  const dockSeen = new Set();
  dock.classList.add('is-away');
  const dockIo = new IntersectionObserver((es) => {
    es.forEach((e) => (e.isIntersecting ? dockSeen.add(e.target) : dockSeen.delete(e.target)));
    dock.classList.toggle('is-away', dockSeen.size > 0);
  });
  document.querySelectorAll('.hero__actions, .page-head__actions, .cta .form').forEach((el) => dockIo.observe(el));

  if (reduce) { const v = document.querySelector('.hero video'); if (v) { v.removeAttribute('autoplay'); v.pause(); } }
  if (!hasGsap || reduce) return;

  /* ================= motion ================= */
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false }); // one script serves the home page and the inner pages
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
    .from(heroImg, { scale: 1.08, xPercent: 4, opacity: 0, duration: 2.4 }, 0)
    .from('.line__in', { yPercent: 115, rotate: 4, duration: 1.4, stagger: 0.13 }, 0.15)
    .to('[data-rise]', { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.7)
    .add(() => counters.forEach((c) => {
      const end = +c.dataset.count, dec = +c.dataset.dec || 0, o = { v: 0 };
      gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', onUpdate: () => { c.textContent = fmt(o.v, dec); } });
    }), 1.1);

  /* stats: icons pop in with the counters */
  gsap.from('.stat__icon', { scale: 0.4, rotate: -25, opacity: 0, duration: 0.9, ease: 'back.out(2.2)', stagger: 0.12, delay: 1.05, clearProps: 'transform,opacity' });

  // translate only: scaling a playing video every scroll frame makes it shimmer
  if (heroImg) gsap.to(heroImg, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  if (heroImg) gsap.to('.hero__inner', { yPercent: -20, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true } });

  /* road: the truck drives the curve and lights it behind itself */
  const truck = document.querySelector('[data-road-truck]');
  const lit = document.querySelector('[data-road]');
  if (truck && lit && window.MotionPathPlugin) {
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

  gsap.from('[data-geo-list] li', { y: 20, opacity: 0, duration: 0.8, ease, stagger: 0.06, scrollTrigger: { trigger: '[data-geo-list]', start: 'top 85%' } });

  /* geography: the Chinese lanes draw first, then the rest; cargo pulses keep riding China to Tashkent */
  const geoMap = document.querySelector('[data-geo-map]');
  if (geoMap && window.MotionPathPlugin) {
    const svg = geoMap.querySelector('svg');
    const lanes = geoMap.querySelectorAll('.geo-r');
    gsap.set(lanes, { strokeDasharray: 1, strokeDashoffset: 1 });
    const pulses = gsap.timeline({ paused: true, repeat: -1 });
    geoMap.querySelectorAll('.geo-r--cn').forEach((lane, i) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', '5'); dot.setAttribute('class', 'geo-pulse');
      svg.insertBefore(dot, svg.querySelector('.geo-p'));
      pulses.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none', motionPath: { path: lane, align: lane, alignOrigin: [0.5, 0.5], start: 0, end: 0.1 } }, i * 0.35)
        .to(dot, { duration: 2.2, ease: 'none', motionPath: { path: lane, align: lane, alignOrigin: [0.5, 0.5], start: 0.1, end: 1 } }, i * 0.35 + 0.3)
        .to(dot, { opacity: 0, duration: 0.2 }, i * 0.35 + 2.3);
    });
    gsap.timeline({ scrollTrigger: { trigger: geoMap, start: 'top 75%', once: true }, defaults: { ease: 'power2.inOut' } })
      .to(geoMap.querySelectorAll('.geo-r--cn:not(.geo-r--last)'), { strokeDashoffset: 0, duration: 1.1, stagger: 0.12 })
      .to(geoMap.querySelectorAll('.geo-r--last'), { strokeDashoffset: 0, duration: 0.9, stagger: 0.12 }, '-=0.3')
      .to(geoMap.querySelectorAll('.geo-r:not(.geo-r--cn)'), { strokeDashoffset: 0, duration: 1, stagger: 0.08 }, '-=0.5')
      // opacity only: a GSAP move would rewrite the labels' CSS translate offsets
      .from(geoMap.querySelectorAll('.geo-l'), { opacity: 0, duration: 0.5, stagger: 0.04, ease: 'none' }, 0.3)
      .add(() => pulses.play());
    ScrollTrigger.create({ trigger: geoMap, start: 'top bottom', end: 'bottom top', onToggle: (st) => (st.isActive && pulses.progress() > 0 ? pulses.resume() : pulses.pause()) });
  }

  /* advantages */
  gsap.from('[data-feats] .feat', { y: 50, opacity: 0, duration: 1, ease, stagger: 0.1, scrollTrigger: { trigger: '[data-feats]', start: 'top 85%' } });
  if (document.querySelector('.why__photo')) gsap.from('.why__photo', { clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)', duration: 1.6, ease, scrollTrigger: { trigger: '.why', start: 'top 75%' } });

  /* steps: each one lands, the connector draws to the next */
  const stl = document.querySelector('[data-steps]') && gsap.timeline({ scrollTrigger: { trigger: '[data-steps]', start: 'top 80%' } });
  document.querySelectorAll('[data-steps] > li').forEach((li) => {
    if (!li.offsetParent) return; // connectors are hidden on phones
    if (li.classList.contains('step__arrow')) stl.from(li.querySelector('span'), { scaleX: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25').from(li.querySelector('svg'), { x: -10, opacity: 0, duration: 0.25 }, '<0.2');
    else stl.from(li, { y: 30, opacity: 0, duration: 0.5, ease }, '-=0.2');
  });

  gsap.from('.clients-row__list li', { y: 20, opacity: 0, duration: 0.8, ease, stagger: 0.06, scrollTrigger: { trigger: '.clients-row', start: 'top 90%' } });
  gsap.from('.faq__item', { y: 24, opacity: 0, duration: 0.8, ease, stagger: 0.06, scrollTrigger: { trigger: '.faq__list', start: 'top 85%' } });

  /* warehouses slide in from the right */
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

  /* endless hero loops pause while the hero is off screen */
  const loopIo = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)));
  document.querySelectorAll('.hero, .geo').forEach((s) => loopIo.observe(s));
  const heroVideo = document.querySelector('.hero video');
  if (heroVideo) new IntersectionObserver(([e]) => { if (e.isIntersecting) heroVideo.play().catch(() => {}); else heroVideo.pause(); }).observe(heroVideo);

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
