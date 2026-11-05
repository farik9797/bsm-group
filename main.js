(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = window.gsap && window.ScrollTrigger;
  if (!hasGsap || reduce) root.classList.add('no-motion');

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (hasGsap && !reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const NAV_H = 72;
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
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    burger.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
  };
  burger.addEventListener('click', () => setDrawer(drawer.hidden));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) { setDrawer(false); burger.focus(); } });

  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-hidden', y > 400 && y > lastY && drawer.hidden);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = id.length > 1 && document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      setDrawer(false);
      scrollToEl(el);
      history.replaceState(null, '', id);
    });
  });

  // active section in nav
  const links = [...document.querySelectorAll('.nav__links a')];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((l) => { const s = document.querySelector(l.getAttribute('href')); if (s) io.observe(s); });

  /* ---------- services: prefill the form ---------- */
  const select = document.getElementById('f-service');
  document.querySelectorAll('[data-service]').forEach((row) => {
    row.addEventListener('click', () => { select.value = row.dataset.service; });
  });

  /* ---------- form ---------- */
  const form = document.querySelector('[data-form]');
  const status = form.querySelector('[data-status]');
  const phone = form.querySelector('#f-phone');
  phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+998 '; });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((f) => {
      const bad = f === phone ? f.value.replace(/\D/g, '').length < 12 : !f.value.trim();
      f.setAttribute('aria-invalid', String(bad));
      if (bad) ok = false;
    });
    status.classList.toggle('is-error', !ok);
    if (!ok) { status.textContent = 'Укажите имя и телефон в формате +998 XX XXX XX XX.'; form.querySelector('[aria-invalid="true"]').focus(); return; }
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      status.textContent = 'Отправка подключается на этапе сборки сайта. Пока позвоните: +998 55 520 02 02.';
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form) });
      if (!res.ok) throw new Error(res.status);
      status.textContent = 'Заявка отправлена. Менеджер свяжется с вами.';
      form.reset();
    } catch {
      status.classList.add('is-error');
      status.textContent = 'Не удалось отправить. Позвоните: +998 55 520 02 02.';
    } finally { btn.disabled = false; }
  });

  if (!hasGsap || reduce) return;

  /* ================= motion ================= */
  gsap.registerPlugin(ScrollTrigger);
  const ease = 'expo.out';

  /* hero intro */
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach((c) => { c.textContent = c.dataset.from || '0'; });
  gsap.timeline({ defaults: { ease } })
    .to('.hero__title .line > span', { y: 0, duration: 1.3, stagger: 0.11 })
    .to('.pill', { clipPath: 'inset(0 0% 0 0 round 999px)', duration: 1.1 }, 0.55)
    .to('[data-rise]', { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 0.6)
    .add(() => counters.forEach((c) => {
      const end = +c.dataset.count, start = +(c.dataset.from || 0), o = { v: start };
      gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => { c.textContent = Math.round(o.v); } });
    }), 0.8);

  /* photo grows from a pill to the full screen */
  const frame = document.querySelector('[data-expand]');
  gsap.fromTo(frame, { clipPath: 'inset(22% 30% 22% 30% round 400px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
    scrollTrigger: { trigger: '.expand', start: 'top 85%', end: 'top top', scrub: 0.6 },
  });
  gsap.fromTo(frame.querySelector('img'), { scale: 1.35 }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.expand', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
  });
  gsap.from('.expand__plate', {
    y: 60, opacity: 0, duration: 1, ease,
    scrollTrigger: { trigger: '.expand', start: 'top 20%' },
  });

  /* section reveals */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease, stagger: 0.08 }),
  });

  /* service rows slide in */
  gsap.from('.svc li', {
    y: 40, opacity: 0, duration: 0.9, ease, stagger: 0.06,
    scrollTrigger: { trigger: '.svc', start: 'top 85%' },
  });

  /* image that follows the cursor over services */
  const cur = document.querySelector('.svc-cursor');
  const curImg = cur.querySelector('img');
  if (matchMedia('(hover: hover) and (min-width: 961px)').matches) {
    const xTo = gsap.quickTo(cur, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(cur, 'y', { duration: 0.5, ease: 'power3' });
    gsap.set(cur, { xPercent: -50, yPercent: -50 });
    const list = document.querySelector('[data-svc]');
    list.addEventListener('pointermove', (e) => { xTo(e.clientX + 180); yTo(e.clientY); });
    list.querySelectorAll('.svc__row').forEach((row) => {
      row.addEventListener('pointerenter', () => {
        curImg.src = row.dataset.img;
        cur.classList.add('is-on');
        gsap.to(cur, { scale: 1, rotate: -3, duration: 0.5, ease });
      });
    });
    list.addEventListener('pointerleave', () => {
      cur.classList.remove('is-on');
      gsap.to(cur, { scale: 0.6, rotate: 0, duration: 0.4, ease });
    });
    // warm the cache so swaps are instant
    list.querySelectorAll('.svc__row').forEach((r) => { const i = new Image(); i.src = r.dataset.img; });
  }

  /* route: pinned horizontal travel with the truck */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 961px)', () => {
    const steps = document.querySelector('[data-route-steps]');
    const truck = document.querySelector('[data-route-truck]');
    const track = document.querySelector('.route__track');
    const dist = () => Math.max(0, steps.scrollWidth - window.innerWidth + 64);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.route', start: 'top top', end: () => '+=' + (dist() + window.innerHeight * 0.4), pin: true, scrub: 0.8, invalidateOnRefresh: true },
    });
    tl.to(steps, { x: () => -dist() }, 0)
      .to('[data-route-fill]', { scaleX: 1 }, 0)
      .to(truck, { x: () => track.clientWidth - truck.clientWidth }, 0);
    gsap.from('.step', { y: 80, opacity: 0, duration: 1, ease, stagger: 0.08, scrollTrigger: { trigger: '.route', start: 'top 70%' } });
  });

  /* departure board: names flap into place */
  const glyphs = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ';
  const flaps = [...document.querySelectorAll('[data-flap]')];
  flaps.forEach((f) => { f.dataset.final = f.textContent; f.style.minWidth = f.offsetWidth + 'px'; });
  ScrollTrigger.create({
    trigger: '[data-board]', start: 'top 75%', once: true,
    onEnter: () => flaps.forEach((f, i) => {
      const final = f.dataset.final;
      const o = { p: 0 };
      gsap.to(o, {
        p: 1, duration: 0.9 + final.length * 0.04, delay: i * 0.09, ease: 'steps(18)',
        onUpdate: () => {
          const n = Math.floor(o.p * final.length);
          f.textContent = final.slice(0, n) + [...final.slice(n)].map((ch) => ch === ' ' ? ' ' : glyphs[(Math.random() * glyphs.length) | 0]).join('');
        },
        onComplete: () => { f.textContent = final; },
      });
    }),
  });
  gsap.from('.tbl tbody tr', { opacity: 0, x: -24, duration: 0.6, ease, stagger: 0.07, scrollTrigger: { trigger: '[data-board]', start: 'top 75%' } });

  /* gentle parallax inside framed photos */
  document.querySelectorAll('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
