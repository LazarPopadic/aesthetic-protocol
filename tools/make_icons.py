"""Generate elegant PWA icons (ivory ground, ink ring + symmetry axis, clay node)."""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img", "icons")
os.makedirs(OUT, exist_ok=True)

BG = (247, 244, 239)
INK = (28, 26, 23)
CLAY = (168, 116, 90)


def draw(size, maskable=False):
    s = size * 4  # supersample
    im = Image.new("RGB", (s, s), BG)
    d = ImageDraw.Draw(im)
    cx = cy = s / 2
    pad = s * (0.20 if maskable else 0.16)
    r = (s / 2) - pad
    lw = max(2, int(s * 0.018))
    # outer ring
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=INK, width=lw)
    # vertical symmetry axis
    d.line([cx, cy - r * 0.62, cx, cy + r * 0.62], fill=INK, width=max(1, int(lw * 0.7)))
    # horizontal tick
    d.line([cx - r * 0.32, cy, cx + r * 0.32, cy], fill=INK, width=max(1, int(lw * 0.6)))
    # clay node
    nr = s * 0.045
    d.ellipse([cx - nr, cy - nr, cx + nr, cy + nr], fill=CLAY)
    return im.resize((size, size), Image.LANCZOS)


for sz in (32, 180, 192, 512):
    draw(sz).save(os.path.join(OUT, f"icon-{sz}.png"))
draw(512, maskable=True).save(os.path.join(OUT, "icon-maskable-512.png"))
draw(32).save(os.path.join(OUT, "favicon.png"))
print("icons written to", OUT)
