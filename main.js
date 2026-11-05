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
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) { setDrawer(false); burger.focus(); } });

  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-solid', y > 40 || !drawer.hidden);
    nav.classList.toggle('is-hidden', y > 500 && y > lastY && drawer.hidden);
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
      scrollToEl(el);
      history.replaceState(null, '', id);
    });
  });

  const links = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((l) => { const s = document.querySelector(l.getAttribute('href')); if (s) io.observe(s); });

  /* ---------- services prefill the form ---------- */
  const select = document.getElementById('f-service');
  document.querySelectorAll('[data-service]').forEach((el) => {
    el.addEventListener('click', () => { select.value = el.dataset.service; });
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
  const fmt = (v, dec) => dec
    ? v.toFixed(dec).replace('.', ',')
    : Math.round(v).toLocaleString('ru-RU').replace(/ /g, ' ');

  /* hero intro */
  const heroImg = document.querySelector('[data-hero-img]');
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach((c) => { c.textContent = fmt(0, +c.dataset.dec || 0); });
  gsap.timeline({ defaults: { ease } })
    .from(heroImg, { scale: 1.18, opacity: 0, duration: 2.2 }, 0)
    .to('.hero__title .line > span', { y: 0, duration: 1.3, stagger: 0.12 }, 0.2)
    .to('[data-rise]', { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 0.7)
    .add(() => counters.forEach((c) => {
      const end = +c.dataset.count, dec = +c.dataset.dec || 0, o = { v: 0 };
      gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => { c.textContent = fmt(o.v, dec); } });
    }), 1);

  // truck drifts and the hero dims as you leave it
  gsap.to(heroImg, { yPercent: 12, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__inner', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* reveals */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease, stagger: 0.08 }),
  });

  /* service cards rise in a wave */
  gsap.from('.cards li', {
    y: 80, opacity: 0, rotate: 2, duration: 1.1, ease, stagger: { each: 0.07, grid: 'auto', from: 'start' },
    scrollTrigger: { trigger: '[data-cards]', start: 'top 85%' },
  });

  /* map: routes draw into Tashkent as you scroll */
  gsap.timeline({ scrollTrigger: { trigger: '.geo', start: 'top 70%', end: 'center 45%', scrub: 0.8 } })
    .from('.geo__dot', { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', stagger: 0.1, duration: 0.2 }, 0)
    .to('.geo__arc', { strokeDashoffset: 0, stagger: 0.15, duration: 1 }, 0.1)
    .from('.geo__hub', { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', duration: 0.3 }, 0.9);
  gsap.fromTo('.geo__map', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.geo', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* steps: the line fills and the truck drives to the last step */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 961px)', () => {
    const track = document.querySelector('.steps__line');
    const truck = document.querySelector('[data-steps-truck]');
    gsap.timeline({ scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 60%', scrub: 0.8 } })
      .set(truck, { opacity: 1 })
      .to('[data-steps-fill]', { scaleX: 1, ease: 'none' }, 0)
      .to(truck, { x: () => track.clientWidth - truck.clientWidth, ease: 'none' }, 0);
    gsap.from('.step', { y: 40, opacity: 0, duration: 0.9, ease, stagger: 0.12, scrollTrigger: { trigger: '.steps', start: 'top 75%' } });
  });

  /* clients light up one by one */
  gsap.to('.clients__list li', { color: 'var(--color-ink)', stagger: 0.12, duration: 0.4, scrollTrigger: { trigger: '.clients', start: 'top 80%' } });

  /* parallax inside framed photos */
  document.querySelectorAll('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
