"""Build the «География» map: a dot map of Europe and Asia (no Africa, no Americas) with routes into Tashkent.

China is the main lane, drawn the way the client runs it: the consolidation warehouses in Yiwu, Guangzhou
and Lianyungang feed the border warehouses in Khorgos and Ulugchat, which send the trucks to Tashkent.
The other directions (Turkey, Europe, Iran, South-East Asia) come in as thinner single arcs.

Outputs assets/img/geo-dots.webp (land dots) and injects the SVG routes + HTML labels into index.html
between <!--GEO--> markers. Land outlines: Natural Earth 1:110m via world-atlas@2.0.2 (tools/data).

Run with Pillow:  python3 tools/geo.py
"""
import json, math, pathlib, re
from PIL import Image, ImageDraw

root = pathlib.Path(__file__).resolve().parent.parent
LON0, LON1, LAT0, LAT1 = -11, 128, -6, 62
KX = math.cos(math.radians(38))
W = 1000
S = W / ((LON1 - LON0) * KX)            # units per degree of latitude
H = round((LAT1 - LAT0) * S)
STEP = 9                                 # dot pitch in viewBox units
SCALE = 3                                # raster px per unit

AFRICA = {'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Central African Rep.', 'Chad',
          'Congo', "Côte d'Ivoire", 'Dem. Rep. Congo', 'Djibouti', 'Egypt', 'Eq. Guinea', 'Eritrea', 'Ethiopia', 'Gabon',
          'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi',
          'Mali', 'Mauritania', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'S. Sudan', 'Senegal',
          'Sierra Leone', 'Somalia', 'Somaliland', 'South Africa', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda',
          'W. Sahara', 'Zambia', 'Zimbabwe', 'eSwatini'}
DROP = AFRICA | {'Greenland', 'Iceland', 'Papua New Guinea', 'Australia', 'Timor-Leste', 'Japan'}
TINT = {'China': 'china', 'Uzbekistan': 'home', 'Turkey': 'lane', 'Iran': 'lane', 'Malaysia': 'lane',
        'Kazakhstan': 'lane', 'Kyrgyzstan': 'lane'}
COLOURS = {'land': (214, 214, 222), 'lane': (184, 184, 196), 'china': (179, 135, 246), 'home': (24, 24, 30)}
COLOURS_DARK = {'land': (52, 52, 64), 'lane': (86, 86, 104), 'china': (142, 67, 241), 'home': (173, 247, 40)}


def proj(lon, lat):
    return ((lon - LON0) * KX * S, (LAT1 - lat) * S)


topo = json.loads((root / 'tools/data/countries-110m.json').read_text())
sc, tr = topo['transform']['scale'], topo['transform']['translate']
arcs = []
for arc in topo['arcs']:
    x = y = 0
    pts = []
    for dx, dy in arc:
        x += dx; y += dy
        pts.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
    arcs.append(pts)


def ring(idx):
    pts = []
    for i in idx:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts.extend(a[1:] if pts else a)
    return pts


masks = {k: Image.new('L', (W * SCALE, H * SCALE), 0) for k in COLOURS}
for g in topo['objects']['countries']['geometries']:
    name = g['properties']['name']
    if name in DROP or g['type'] not in ('Polygon', 'MultiPolygon'):
        continue
    polys = [g['arcs']] if g['type'] == 'Polygon' else g['arcs']
    d = ImageDraw.Draw(masks[TINT.get(name, 'land')])
    for poly in polys:
        for k, r in enumerate(poly):
            pts = [tuple(v * SCALE for v in proj(lon, lat)) for lon, lat in ring(r)]
            d.polygon(pts, fill=0 if k else 255)

r = 2.3 * SCALE
for name, palette in (('geo-dots', COLOURS), ('geo-dots-dark', COLOURS_DARK)):
    img = Image.new('RGBA', (W * SCALE, H * SCALE), (0, 0, 0, 0))
    dd = ImageDraw.Draw(img)
    for y in range(STEP // 2, H, STEP):
        for x in range(STEP // 2, W, STEP):
            px, py = x * SCALE, y * SCALE
            for kind in ('home', 'china', 'lane', 'land'):
                if masks[kind].getpixel((px, py)):
                    dd.ellipse((px - r, py - r, px + r, py + r), fill=palette[kind])
                    break
    img.save(root / f'assets/img/{name}.webp', 'WEBP', quality=86, method=6)

# ---------- routes and labels ----------
P = {  # name: (lon, lat, label key, label side)
    'tashkent': (69.24, 41.30), 'yiwu': (120.07, 29.31), 'guangzhou': (113.26, 23.13), 'lianyungang': (119.22, 34.60),
    'khorgos': (80.40, 44.20), 'ulugchat': (75.25, 39.72), 'istanbul': (28.98, 41.01), 'europe': (8.68, 50.11),
    'tehran': (51.39, 35.69), 'kl': (101.69, 3.14), 'almaty': (76.89, 43.24), 'bishkek': (74.60, 42.87),
}
XY = {k: proj(*v) for k, v in P.items()}


def arc(a, b, bend):
    (x1, y1), (x2, y2) = XY[a], XY[b]
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy)
    cx, cy = mx - dy / L * L * bend, my + dx / L * L * bend
    return f'M{x1:.1f} {y1:.1f} Q{cx:.1f} {cy:.1f} {x2:.1f} {y2:.1f}'


ROUTES = [  # (from, to, bend, class)
    ('yiwu', 'khorgos', -0.16, 'geo-r geo-r--cn'), ('lianyungang', 'khorgos', -0.14, 'geo-r geo-r--cn'),
    ('guangzhou', 'ulugchat', 0.14, 'geo-r geo-r--cn'), ('khorgos', 'tashkent', -0.22, 'geo-r geo-r--cn geo-r--last'),
    ('ulugchat', 'tashkent', 0.22, 'geo-r geo-r--cn geo-r--last'),
    ('europe', 'tashkent', -0.18, 'geo-r'), ('istanbul', 'tashkent', -0.14, 'geo-r'),
    ('tehran', 'tashkent', 0.16, 'geo-r'), ('kl', 'tashkent', 0.16, 'geo-r'),
]
LABELS = [  # (point, text, class); right of the dot by default
    ('tashkent', 'Ташкент', 'geo-l geo-l--home'), ('yiwu', 'Иу', 'geo-l geo-l--cn geo-l--left'),
    ('guangzhou', 'Гуанчжоу', 'geo-l geo-l--cn geo-l--left'), ('lianyungang', 'Ляньюньган', 'geo-l geo-l--cn geo-l--left'),
    ('khorgos', 'Хоргос', 'geo-l geo-l--cn'), ('ulugchat', 'Улугчат', 'geo-l geo-l--cn geo-l--down'),
    ('istanbul', 'Турция', 'geo-l geo-l--minor geo-l--far'), ('europe', 'Европа', 'geo-l geo-l--minor geo-l--far'),
    ('tehran', 'Иран', 'geo-l geo-l--minor'), ('kl', 'Малайзия', 'geo-l geo-l--minor'),
]
svg = [f'<svg class="geo-map__svg" viewBox="0 0 {W} {H}" aria-hidden="true" focusable="false">']
for a, b, bend, cls in ROUTES:
    svg.append(f'<path class="{cls}" d="{arc(a, b, bend)}" pathLength="1"/>')
for k in ('yiwu', 'guangzhou', 'lianyungang', 'khorgos', 'ulugchat'):
    x, y = XY[k]; svg.append(f'<circle class="geo-p geo-p--cn" cx="{x:.1f}" cy="{y:.1f}" r="6"/>')
for k in ('istanbul', 'europe', 'tehran', 'kl'):
    x, y = XY[k]; svg.append(f'<circle class="geo-p" cx="{x:.1f}" cy="{y:.1f}" r="4.5"/>')
x, y = XY['tashkent']
svg.append(f'<circle class="geo-hub__ring" cx="{x:.1f}" cy="{y:.1f}" r="16"/><circle class="geo-hub" cx="{x:.1f}" cy="{y:.1f}" r="9"/>')
svg.append('</svg>')
labels = ''.join(f'<li class="{cls}" style="--x:{XY[k][0] / W * 100:.2f}%;--y:{XY[k][1] / H * 100:.2f}%">{t}</li>' for k, t, cls in LABELS)
block = (f'<!--GEO--><div class="geo-map" style="aspect-ratio:{W}/{H}" data-geo-map>'
         f'<img class="geo-map__dots geo-map__dots--light" src="assets/img/geo-dots.webp" alt="" width="{W * SCALE}" height="{H * SCALE}" loading="lazy">'
         f'<img class="geo-map__dots geo-map__dots--dark" src="assets/img/geo-dots-dark.webp" alt="" width="{W * SCALE}" height="{H * SCALE}" loading="lazy">'
         + ''.join(svg) + f'<ul class="geo-map__labels" aria-hidden="true">{labels}</ul></div><!--/GEO-->')

html = (root / 'src/page.ru.html').read_text()
html, n = re.subn(r'<!--GEO-->.*?<!--/GEO-->', lambda m: block, html, flags=re.S)
assert n == 1, 'index.html has no <!--GEO--> marker'
(root / 'src/page.ru.html').write_text(html)
print('geo ok', W, 'x', H, (root / 'assets/img/geo-dots.webp').stat().st_size // 1024, 'KB')
