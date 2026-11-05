"""Rebuild the «Доставка по всему миру» background as a clean dot map.

The land mask comes from the old raster (assets/img/map.webp is the source, 1600x900),
so the projection stays the same and the SVG arcs in index.html still land where they did.
The old picture's baked labels, pin and dashed arrows are dropped; the dots carry no text.

Run with Pillow + numpy:  python3 tools/map.py
"""
import pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

root = pathlib.Path(__file__).resolve().parent.parent
SRC = root / 'assets/img/map-dark.webp'
OUT = root / 'assets/img/map-dots.webp'

W, H = 1600, 900          # source / layout size (matches the arcs' viewBox 1000x562)
SCALE = 2                 # output 3200x1800 for retina
SS = 3                    # supersampling for round dots
STEP = 9                  # dot pitch in source px
HUB = (873.6, 392)        # Uzbekistan hub: svg (546,245) * 1.6

PAPER = (7, 7, 10)
LAND = np.array([58, 34, 104])      # dim purple
CHINA = np.array([142, 67, 241])    # brand purple #8E43F1
NEAR = np.array([196, 150, 255])    # light purple near the hub

src = np.asarray(Image.open(SRC).convert('RGB')).astype(int)
blue = src[..., 2]
# land: blue channel lit; close small holes left by the baked text
land = Image.fromarray(((blue > 40) * 255).astype('uint8'))
land = land.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
land = np.asarray(land) > 127
china = np.asarray(Image.fromarray(((blue > 170) * 255).astype('uint8')).filter(ImageFilter.MaxFilter(5))) > 127
china[:, :930] = False    # the lit «TURKEY» plate is not China
yy, xx = np.mgrid[0:H, 0:W]
land |= ((xx - 873) / 55) ** 2 + ((yy - 375) / 62) ** 2 <= 1   # fill the hole the old pin left

S = SCALE * SS
img = Image.new('RGB', (W * S, H * S), PAPER)
d = ImageDraw.Draw(img)
for y in range(STEP // 2, H, STEP):
    for x in range(STEP // 2, W, STEP):
        if not land[y, x]:
            continue
        dist = ((x - HUB[0]) ** 2 + (y - HUB[1]) ** 2) ** 0.5
        near = max(0.0, 1 - dist / 260) ** 1.6
        base = CHINA if china[y, x] else LAND
        c = base + (NEAR - base) * near
        r = 2.0 + 0.9 * near + (0.4 if china[y, x] else 0)
        cx, cy = x * S, y * S
        d.ellipse((cx - r * S, cy - r * S, cx + r * S, cy + r * S), fill=tuple(int(v) for v in c))

img = img.resize((W * SCALE, H * SCALE), Image.LANCZOS)

# soft purple glow under Central Asia, behind the dots
glow = Image.new('L', img.size, 0)
gd = ImageDraw.Draw(glow)
gx, gy, gr = HUB[0] * SCALE, HUB[1] * SCALE, 420 * SCALE
gd.ellipse((gx - gr, gy - gr * 0.7, gx + gr, gy + gr * 0.7), fill=70)
glow = glow.filter(ImageFilter.GaussianBlur(160 * SCALE / 2))
tint = Image.new('RGB', img.size, (142, 67, 241))
img = Image.composite(tint, img, glow.point(lambda v: int(v * 0.55)))

img.save(OUT, 'WEBP', quality=82, method=6)
print(OUT.name, img.size, OUT.stat().st_size // 1024, 'KB')
