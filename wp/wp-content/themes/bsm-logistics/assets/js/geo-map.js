/* Geography maps: canvas dots + SVG routes + HTML pins, no dependencies.
   Ported from the variants the client approved (vimovich.github.io/bsm-geo-map):
   v1 «Пульс сети» is the general map in #geo, v3 «Сроки доставки» is the China block.
   Colours come from --geo-* tokens, so both themes work; city names come from the page,
   so the build translates them. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DATA = new URL('../data/', document.currentScript.src);
  const maps = [];

  function BSMMap(host, D, o) {
    o = Object.assign({ r: 1.9, origin: 'tashkent', reveal: 1400, minWidth: 760, focus: null }, o);
    const W = D.W, H = D.H;
    host.classList.add('gm-viewport');
    const root = document.createElement('div'); root.className = 'gm'; root.style.aspectRatio = W + ' / ' + H;
    root.style.setProperty('--minw', o.minWidth + 'px');
    host.appendChild(root);
    const cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
    const defs = document.createElementNS(NS, 'defs'); svg.appendChild(defs);
    const layer = document.createElement('div'); layer.className = 'gm-layer';
    root.append(cv, svg, layer);
    const ctx = cv.getContext('2d');

    // dot colours are roles (base, cn, uz, tr) resolved from --geo-<role>
    const hex = (c) => { c = c.replace('#', ''); if (c.length === 3) c = c.split('').map((x) => x + x).join(''); return [0, 2, 4].map((i) => parseInt(c.substr(i, 2), 16)); };
    const tone = (role) => hex(getComputedStyle(host).getPropertyValue('--geo-' + role).trim() || '#cccccc');
    const codes = [...new Set(D.dots.map((d) => d[2]))];
    let roles = {};
    const col = {}; codes.forEach((c) => (col[c] = { cur: tone('base'), from: null, to: null }));
    const byCode = {}; codes.forEach((c) => (byCode[c] = []));
    const [ox, oy] = D.pts[o.origin];
    let maxd = 0;
    D.dots.forEach((d) => { const dist = Math.hypot(d[0] - ox, d[1] - oy); maxd = Math.max(maxd, dist); byCode[d[2]].push([d[0], d[1], dist]); });

    let scale = 1, dpr = 1, t0 = null, tCol = 0, colDur = 500, colAnim = false, revealDone = reduce || !o.reveal, started = false, raf = null, visible = false, ticking = false;
    const ease = (x) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = root.clientWidth, h = root.clientHeight; scale = w / W;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      draw(performance.now());
      if (o.focus && host.scrollWidth > host.clientWidth) host.scrollLeft = o.focus[0] * scale - host.clientWidth / 2;
    }
    function draw(now) {
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const rp = revealDone ? 2 : t0 === null ? 0 : (now - t0) / o.reveal;
      const cp = colAnim ? ease((now - tCol) / colDur) : 1;
      const busy = !revealDone || colAnim;
      for (const c of codes) {
        const s = col[c];
        if (s.to) s.cur = s.from.map((v, i) => v + (s.to[i] - v) * cp);
        ctx.fillStyle = `rgb(${s.cur.map(Math.round).join(',')})`;
        ctx.beginPath();
        for (const p of byCode[c]) {
          let r = o.r;
          if (!revealDone) { const k = ease((rp - (p[2] / maxd) * 0.75) / 0.25); if (k <= 0) continue; r *= k; }
          ctx.moveTo(p[0] + r, p[1]); ctx.arc(p[0], p[1], r, 0, 6.2832);
        }
        ctx.fill();
      }
      if (colAnim && cp >= 1) { colAnim = false; codes.forEach((c) => (col[c].to = col[c].from = null)); }
      if (!revealDone && rp >= 1) { revealDone = true; api.onReveal && api.onReveal(); }
      return busy;
    }
    function loop(now) { raf = draw(now) ? requestAnimationFrame(loop) : null; }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }

    const api = {
      reduce,
      // recolour dot groups by role, e.g. {CN:'cn', UZ:'uz'}; the rest go back to base
      colors(map, dur) {
        roles = map; colDur = reduce ? 1 : dur || 500; tCol = performance.now(); colAnim = true;
        codes.forEach((c) => { col[c].from = col[c].cur.slice(); col[c].to = tone(map[c] || 'base'); });
        kick();
      },
      retone() { api.colors(roles, 1); },
      xy: (k) => (Array.isArray(k) ? k : D.pts[k]),
      // quadratic curve through named points, bend = fraction of length
      path(stops, bend) {
        const P = stops.map(api.xy); let d = `M${P[0][0]},${P[0][1]}`;
        for (let i = 1; i < P.length; i++) {
          const [ax, ay] = P[i - 1], [bx, by] = P[i]; const b = Array.isArray(bend) ? bend[i - 1] : bend == null ? 0.18 : bend;
          const mx = (ax + bx) / 2, my = (ay + by) / 2, dx = bx - ax, dy = by - ay;
          d += ` Q${(mx - dy * b).toFixed(1)},${(my + dx * b).toFixed(1)} ${bx},${by}`;
        }
        return d;
      },
      // a route: a styled path revealed by a mask that draws along it
      route(stops, opt) {
        opt = Object.assign({ bend: 0.18, cls: '' }, opt);
        const d = api.path(stops, opt.bend), id = 'gm' + Math.random().toString(36).slice(2, 8);
        const mask = document.createElementNS(NS, 'mask'); mask.id = id; mask.setAttribute('maskUnits', 'userSpaceOnUse');
        mask.setAttribute('x', -50); mask.setAttribute('y', -50); mask.setAttribute('width', W + 100); mask.setAttribute('height', H + 100);
        const mp = document.createElementNS(NS, 'path'); mp.setAttribute('d', d); mp.setAttribute('pathLength', '1'); mp.setAttribute('class', 'gm-maskpath');
        mask.appendChild(mp); defs.appendChild(mask);
        const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'gm-route ' + opt.cls); g.setAttribute('mask', `url(#${id})`);
        const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('vector-effect', 'non-scaling-stroke');
        g.appendChild(p); svg.appendChild(g);
        const r = {
          g, p, len: p.getTotalLength(),
          show(delay, dur) { mp.style.transition = reduce ? 'none' : `stroke-dashoffset ${dur || 1100}ms cubic-bezier(.65,0,.35,1) ${delay || 0}ms`; mp.style.strokeDashoffset = 0; g.classList.add('on'); return r; },
          hide(dur) { mp.style.transition = reduce ? 'none' : `stroke-dashoffset ${dur || 450}ms cubic-bezier(.65,0,.35,1)`; mp.style.strokeDashoffset = 1; g.classList.remove('on'); return r; },
          at(t) { const q = p.getPointAtLength(r.len * t); return [q.x, q.y]; },
        };
        return r;
      },
      // HTML marker at a point: a dot and a label on side l / r / t / b
      pin(k, label, side, cls) {
        const [x, y] = api.xy(k); const el = document.createElement('div'); el.className = 'gm-pin ' + (cls || '');
        el.style.left = (x / W) * 100 + '%'; el.style.top = (y / H) * 100 + '%';
        if (cls === 'gm-hub') el.innerHTML = '<span class="gm-ring"></span><span class="gm-ring"></span>';
        const pt = document.createElement('span'); pt.className = 'gm-pt';
        const lb = document.createElement('span'); lb.className = 'gm-lb gm-lb--' + side; lb.textContent = label || '';
        el.append(pt, lb); layer.appendChild(el); return el;
      },
      // cargo dots that ride along the routes
      movers: [],
      mover(route, opt) {
        opt = Object.assign({ period: 4200, offset: 0, cls: '' }, opt);
        const el = document.createElementNS(NS, 'circle'); el.setAttribute('r', 1); el.setAttribute('class', 'gm-mover ' + opt.cls); svg.appendChild(el);
        api.movers.push({ el, route, opt });
      },
      start() {
        if (started) return; started = true; t0 = performance.now(); kick();
        if (revealDone) { draw(t0); api.onReveal && api.onReveal(); }
      },
      onReveal: null,
    };
    function tick(now) {
      for (const m of api.movers) {
        if (reduce || !m.route.g.classList.contains('on')) { m.el.style.opacity = 0; continue; }
        const t = (now / m.opt.period + m.opt.offset) % 1; const [x, y] = m.route.at(t);
        m.el.setAttribute('cx', x); m.el.setAttribute('cy', y); m.el.setAttribute('r', ((m.opt.r || 4.2) / scale) * (scale < 0.6 ? 0.75 : 1));
        m.el.style.opacity = Math.min(t * 12, (1 - t) * 12, 1);
      }
      ticking = visible && !reduce;
      if (ticking) requestAnimationFrame(tick);
    }
    new ResizeObserver(size).observe(root);
    size();
    // reveal once a quarter is on screen; movers only run while the map is visible
    new IntersectionObserver((es) => {
      const e = es[es.length - 1];
      visible = e.isIntersecting;
      if (visible && e.intersectionRatio >= 0.25) api.start();
      if (visible && !ticking && !reduce) { ticking = true; requestAnimationFrame(tick); }
    }, { threshold: [0, 0.25] }).observe(root);
    maps.push(api);
    return api;
  }

  const names = (sec) => {
    const n = {};
    sec.querySelectorAll('[data-geo-names] [data-k]').forEach((li) => (n[li.dataset.k] = li.textContent.trim()));
    return n;
  };

  /* v1: the general map, China first and the other directions as thin dotted lanes */
  function net(sec, D) {
    const N = names(sec);
    const m = BSMMap(sec.querySelector('[data-geo-map]'), D, { r: 2.45, focus: [840, 300], minWidth: 760 });
    const china = [
      m.route(['guangzhou', 'ulugqat', 'tashkent'], { bend: [0.1, -0.18], cls: 'gm-cn' }),
      m.route(['yiwu', 'khorgos', 'tashkent'], { bend: [0.07, 0.16], cls: 'gm-cn' }),
      m.route(['lianyungang', 'khorgos', 'tashkent'], { bend: [-0.06, 0.16], cls: 'gm-cn' }),
    ];
    const others = ['europe', 'turkey', 'iran', 'malaysia'].map((k, i) => m.route([k, 'tashkent'], { bend: [-0.13, -0.14, -0.12, -0.16][i], cls: 'gm-ot' }));
    china.forEach((r, i) => { m.mover(r, { period: 5200 + i * 500, offset: i * 0.21, cls: 'gm-mover--cn', r: 5 }); m.mover(r, { period: 5200 + i * 500, offset: i * 0.21 + 0.5, cls: 'gm-mover--cn', r: 5 }); });
    others.forEach((r, i) => m.mover(r, { period: 7600, offset: i * 0.27, cls: 'gm-mover--ot', r: 4 }));
    const pins = [
      ['guangzhou', 'l', 'gm-p-cn'], ['yiwu', 'r', 'gm-p-cn'], ['lianyungang', 'r', 'gm-p-cn'], ['khorgos', 't', 'gm-p-cn'], ['ulugqat', 'b', 'gm-p-cn'],
      ['europe', 'r', 'gm-p-ot'], ['turkey', 'b', 'gm-p-ot'], ['iran', 'b', 'gm-p-ot'], ['malaysia', 'r', 'gm-p-ot'],
    ].map(([k, side, cls]) => m.pin(k, N[k], side, cls));
    m.pin('tashkent', N.tashkent, 't', 'gm-hub').classList.add('in');
    m.onReveal = () => {
      m.colors({ CN: 'cn', UZ: 'uz', KZ: 'tr', KG: 'tr' }, 800);
      china.forEach((r, i) => r.show(200 + i * 180, 1300));
      others.forEach((r, i) => r.show(1100 + i * 140, 1200));
      pins.forEach((p, i) => setTimeout(() => p.classList.add('in'), m.reduce ? 0 : i < 5 ? 900 + i * 120 : 1700 + i * 90));
    };
  }

  /* v3: China only, one transport mode at a time; the modes cycle until a visitor picks one */
  function china(sec, D) {
    const N = names(sec);
    const m = BSMMap(sec.querySelector('[data-geo-map]'), D, { r: 2.6, minWidth: 0, reveal: 1200 });
    const rail = (r) => { const b = r.p.cloneNode(); b.setAttribute('class', 'gm-tie'); r.g.appendChild(b); return r; };
    const R = {
      auto: [m.route(['guangzhou', 'ulugqat', 'tashkent'], { bend: [0.12, -0.2], cls: 'gm-auto' }),
        m.route(['yiwu', 'khorgos', 'tashkent'], { bend: [0.09, 0.2], cls: 'gm-auto' }),
        m.route(['lianyungang', 'khorgos', 'tashkent'], { bend: [-0.05, 0.2], cls: 'gm-auto' })],
      rail: [rail(m.route(['lianyungang', 'khorgos', 'almaty', 'tashkent'], { bend: [-0.03, 0.02, 0.12], cls: 'gm-rail' })),
        rail(m.route(['yiwu', 'khorgos', 'almaty', 'tashkent'], { bend: [0.06, 0.02, 0.12], cls: 'gm-rail' }))],
      air: [m.route(['shanghai', 'tashkent'], { bend: -0.22, cls: 'gm-air' })],
    };
    const SPEED = { auto: 4600, rail: 6400, air: 2600 };
    Object.entries(R).forEach(([k, rs]) => rs.forEach((r, i) => {
      const rad = k === 'air' ? 4.5 : 5.2;
      m.mover(r, { period: SPEED[k], offset: i * 0.33, cls: 'gm-mover--cn', r: rad });
      m.mover(r, { period: SPEED[k], offset: i * 0.33 + 0.5, cls: 'gm-mover--cn', r: rad });
    }));
    const SIDE = { guangzhou: 'b', yiwu: 'l', lianyungang: 'l', shanghai: 'r', khorgos: 't', ulugqat: 'b' };
    const P = {}; Object.entries(SIDE).forEach(([k, side]) => (P[k] = m.pin(k, N[k], side, 'gm-p-cn')));
    const USE = { auto: ['guangzhou', 'yiwu', 'lianyungang', 'khorgos', 'ulugqat'], rail: ['yiwu', 'lianyungang', 'khorgos'], air: ['shanghai'] };
    m.pin('tashkent', N.tashkent, 't', 'gm-hub').classList.add('in');

    const btns = [...sec.querySelectorAll('[data-mode]')]; const ORDER = ['auto', 'rail', 'air'], HOLD = 5200;
    let cur = null, cycle = true, timer = null;
    function set(k) {
      if (cur) R[cur].forEach((r) => r.hide(350));
      cur = k;
      R[k].forEach((r, i) => r.show(380 + i * 150, k === 'air' ? 900 : 1300));
      Object.entries(P).forEach(([n, el]) => { el.classList.add('in'); el.classList.toggle('dim', !USE[k].includes(n)); });
      m.colors(k === 'rail' ? { CN: 'cn', KZ: 'tr', UZ: 'uz' } : { CN: 'cn', UZ: 'uz' }, 600);
      btns.forEach((b) => {
        const on = b.dataset.mode === k; b.setAttribute('aria-pressed', on);
        const bar = b.querySelector('.cn-mode__bar');
        bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)';
        if (on && cycle && !m.reduce) requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = `transform ${HOLD}ms linear`; bar.style.transform = 'scaleX(1)'; }));
      });
      clearTimeout(timer);
      if (cycle && !m.reduce) timer = setTimeout(() => set(ORDER[(ORDER.indexOf(k) + 1) % 3]), HOLD);
    }
    btns.forEach((b) => b.addEventListener('click', () => { cycle = false; set(b.dataset.mode); }));
    m.onReveal = () => set('auto');
  }

  // fetch each map's dots shortly before it scrolls into view
  [['net', 'geo-net.json', net], ['china', 'geo-china.json', china]].forEach(([kind, file, init]) => {
    const sec = document.querySelector(`[data-geo="${kind}"]`);
    if (!sec) return;
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      fetch(new URL(file, DATA)).then((r) => r.json()).then((D) => init(sec, D)).catch(() => {});
    }, { rootMargin: '800px 0px' });
    io.observe(sec);
  });

  // the theme toggle swaps the --geo-* tokens; repaint the dots in the new colours
  new MutationObserver(() => requestAnimationFrame(() => maps.forEach((m) => m.retone()))).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
