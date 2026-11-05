"""Inline an SVG sprite into index.html between <!--SPRITE--> markers.
Icons are copied verbatim from lucide-static / simple-icons files in assets/icons."""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
icons = {'i-menu':'menu','i-x':'x','i-phone':'phone','i-mail':'mail','i-map-pin':'map-pin','i-truck':'truck',
         'i-train':'train-front','i-plane':'plane','i-file':'file-check-2','i-warehouse':'warehouse','i-search':'search',
         'i-package':'package-check','i-globe':'globe','i-shield':'shield-check','i-star':'star','i-clock':'clock','i-handshake':'handshake','i-chart':'chart-column','i-doc':'file-text','i-calc':'calculator','i-check':'circle-check','i-arrow':'arrow-up-right','i-eye':'eye','i-ship':'ship','i-arrow-r':'arrow-right','i-chev':'chevron-down','i-mouse':'mouse','i-play':'play','i-prev':'chevron-left','i-next':'chevron-right','i-plus':'plus','i-down':'arrow-down-right','i-telegram':'telegram','i-instagram':'instagram'}
out = []
for sid, name in icons.items():
    src = (root/'assets/icons'/f'{name}.svg').read_text()
    src = re.sub(r'<!--.*?-->', '', src, flags=re.S)
    inner = re.search(r'<svg[^>]*>(.*)</svg>', src, re.S).group(1)
    inner = re.sub(r'<title>.*?</title>', '', inner)
    if name in ('telegram','instagram'):
        out.append(f'<symbol id="{sid}" viewBox="0 0 24 24" fill="currentColor">{inner.strip()}</symbol>')
    else:
        out.append(f'<symbol id="{sid}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{" ".join(inner.split())}</symbol>')
logo = (root/'assets/img/bsm-logo.svg').read_text()
logo_inner = re.search(r'<svg[^>]*>(.*)</svg>', re.sub(r'<!--.*?-->', '', logo, flags=re.S), re.S).group(1)
out.append(f'<symbol id="logo" viewBox="LOGO_VB" fill="currentColor">{" ".join(logo_inner.split())}</symbol>')
vb = (root/'tools/logo-viewbox.txt').read_text().strip() if (root/'tools/logo-viewbox.txt').exists() else '0 -420 1920 1920'
sprite = '<!--SPRITE--><svg width="0" height="0" style="position:absolute" aria-hidden="true">' + ''.join(out).replace('LOGO_VB', vb) + '</svg><!--/SPRITE-->'
html = (root/'index.html').read_text()
html = re.sub(r'<!--SPRITE-->(.*?<!--/SPRITE-->)?', lambda m: sprite, html, count=1, flags=re.S)
(root/'index.html').write_text(html)
print('sprite ok, logo viewBox', vb)
