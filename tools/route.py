"""Turn the client's "Group 226.svg" (transport types on a winding route) into an
animatable inline SVG for the «Виды перевозок» section and inject it into index.html
between <!--ROUTE--> markers.

- groups every vehicle / cloud / the multimodal scene so each can move on its own
- recolours to the dark theme through CSS variables (style="stroke:var(...)")
- drops the outlined caps labels; index.html carries them as real text instead
- adds a continuous route path (the original is 342 separate dashes) for the marker
"""
import re
import pathlib
import xml.etree.ElementTree as ET

root_dir = pathlib.Path(__file__).resolve().parent.parent
SRC = root_dir / 'assets/svg/route-raw.svg'
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)

tree = ET.parse(SRC)
svg = tree.getroot()
defs = svg.find(f'{{{NS}}}defs')
kids = [c for c in list(svg) if c.tag != f'{{{NS}}}defs']

COLOURS = {
    '#2C373D': 'var(--rt-ink)', '#3C464E': 'var(--rt-ink)', '#374148': 'var(--rt-ink)',
    '#909FA8': 'var(--rt-cloud)', '#008DD2': 'var(--rt-wave)', 'white': 'var(--rt-hole)',
}
STOPS = {'#008DD2': 'var(--rt-box-a)', '#1B75BC': 'var(--rt-box-a)', '#003C5F': 'var(--rt-box-b)', '#374148': 'var(--rt-box-b)'}


def round_d(d):
    return re.sub(r'-?\d+\.\d+', lambda m: ('%.1f' % float(m.group())).rstrip('0').rstrip('.'), d)


def restyle(el, inside_mask=False):
    style = []
    for attr in ('stroke', 'fill'):
        v = el.get(attr)
        if v and not v.startswith('url(') and v != 'none' and not inside_mask:
            if v in COLOURS:
                style.append(f'{attr}:{COLOURS[v]}')
                del el.attrib[attr]
    if style:
        el.set('style', ';'.join(style))
    if el.get('d'):
        el.set('d', round_d(el.get('d')))
    for c in el:
        restyle(c, inside_mask or el.tag == f'{{{NS}}}mask')


# gradients: brand lime boxes; the route gradient becomes a quiet grey
for g in defs:
    for stop in g:
        c = stop.get('stop-color')
        if c:
            del stop.attrib['stop-color']
            colour = 'var(--rt-dash)' if g.get('id', '').startswith('paint2') else STOPS.get(c, 'var(--rt-box-b)')
            stop.set('style', f'stop-color:{colour}')

for k in kids:
    restyle(k)

r = lambda a, b: list(range(a, b + 1))
GROUPS = [  # (class, data-from, indices)
    ('rt-route', None, [88]),
    ('rt-veh', 'left', [96, 97]),     # рефрижератор
    ('rt-veh', 'left', [92, 93]),     # контейнеровоз
    ('rt-veh', 'right', [100, 101]),  # сборные
    ('rt-veh', 'right', [90, 91]),    # тент
    ('rt-veh', 'left', [94, 95]),     # негабарит
    ('rt-veh', 'left', [99, 98]),     # ж/д платформа
    ('rt-veh', 'right', [102, 103]),  # самолёт
    ('rt-veh rt-ship', 'up', [0, 1, 2, 3, 4, 5, 6, 7, 8, 61, 65]),
    ('rt-veh', 'left', r(9, 40)),     # фура с контейнером
    ('rt-veh rt-plane2', 'right', r(41, 57)),
    ('rt-waves', None, [62, 63, 64, 66, 67, 68]),
    ('rt-ground', None, [58, 59, 60]),
]
CLOUDS = [r(69, 75), r(76, 80), r(104, 107), r(108, 111), r(112, 115), r(116, 119), r(120, 123),
          r(124, 128), r(129, 133), r(134, 138), r(139, 143), r(144, 148), r(149, 153), r(154, 158), r(159, 163)]
LABELS = {81, 82, 83, 84, 85, 86, 87, 89}

used = set(LABELS)
out = ET.Element(f'{{{NS}}}svg', {
    'class': 'types__svg', 'viewBox': '0 0 1701 1856', 'fill': 'none', 'aria-hidden': 'true', 'focusable': 'false',
})
out.append(defs)
for i, idx in enumerate(CLOUDS):
    g = ET.SubElement(out, f'{{{NS}}}g', {'class': 'rt-cloud', 'data-drift': str((-1) ** i)})
    for n in idx:
        g.append(kids[n]); used.add(n)
for cls, frm, idx in GROUPS:
    attrs = {'class': cls}
    if frm:
        attrs['data-from'] = frm
    g = ET.SubElement(out, f'{{{NS}}}g', attrs)
    for n in idx:
        g.append(kids[n]); used.add(n)

missing = [n for n in range(len(kids)) if n not in used]
assert not missing, f'ungrouped elements: {missing}'

# one continuous line along the dashed route, for the lit trail and the marker
ROUTE = ('M 241 329 H 1427 A 150 150 0 0 1 1427 629 H 291 A 146.5 146.5 0 0 0 291 922 '
         'H 1427 A 149 149 0 0 1 1427 1220 H 307 A 166 166 0 0 0 307 1552 H 420')
ET.SubElement(out, f'{{{NS}}}path', {'class': 'rt-lit', 'd': ROUTE, 'pathLength': '1', 'data-rt-path': ''})
marker = ET.SubElement(out, f'{{{NS}}}g', {'class': 'rt-marker', 'data-rt-marker': '', 'transform': 'translate(241 329)'})
ET.SubElement(marker, f'{{{NS}}}circle', {'r': '30'})
ET.SubElement(marker, f'{{{NS}}}use', {'href': '#i-package', 'x': '-16', 'y': '-16', 'width': '32', 'height': '32'})

markup = ET.tostring(out, encoding='unicode')
markup = markup.replace(f'xmlns="{NS}" ', '').replace(' xmlns="http://www.w3.org/2000/svg"', '')
markup = re.sub(r'\s+', ' ', markup)
(root_dir / 'assets/svg/route-dark.svg').write_text(markup.replace('<svg ', f'<svg xmlns="{NS}" ', 1))

html = (root_dir / 'index.html').read_text()
block = '<!--ROUTE-->' + markup + '<!--/ROUTE-->'
html, n = re.subn(r'<!--ROUTE-->.*?<!--/ROUTE-->', lambda m: block, html, flags=re.S)
assert n == 1, 'index.html has no <!--ROUTE--> marker'
(root_dir / 'index.html').write_text(html)
print('route ok', len(markup) // 1024, 'KB inline')
