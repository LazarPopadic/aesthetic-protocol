"""
Convert the 8 source upload photos into optimised, EXIF-stripped web images.

The files are named *.DNG but are actually plain JPEGs (+ one HEIC), so we open
them directly with Pillow, honour EXIF orientation, strip metadata (privacy),
downscale, and emit WebP (primary) + JPEG (fallback) into assets/img/photos.

Run:  python tools/build_photos.py
"""
import os
from PIL import Image, ImageOps
import pillow_heif
pillow_heif.register_heif_opener()

DOWNLOADS = r"C:\Users\Lenovo\Downloads"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img", "photos")
os.makedirs(OUT, exist_ok=True)

MAX_W = 1400
JPG_Q = 84
WEBP_Q = 82

# source filename -> semantic web name
MAP = {
    "IMG_5459 (1).HEIC": "hero-front",
    "IMG_5477 (1).DNG":  "oblique-left",
    "IMG_5493 (1).DNG":  "oblique-right",
    "IMG_5482 (1).DNG":  "profile-right",
    "IMG_5500 (1).DNG":  "profile-left",
    "IMG_5505 (1).DNG":  "hair-top",
    "IMG_5506 (1).DNG":  "hair-back",
    "IMG_5487 (1).DNG":  "rear",
}


def convert(src, name):
    im = Image.open(os.path.join(DOWNLOADS, src))
    im = ImageOps.exif_transpose(im).convert("RGB")   # bake orientation, drop EXIF
    if im.width > MAX_W:
        h = round(im.height * MAX_W / im.width)
        im = im.resize((MAX_W, h), Image.LANCZOS)
    base = os.path.join(OUT, name)
    im.save(base + ".jpg", "JPEG", quality=JPG_Q, optimize=True, progressive=True)
    im.save(base + ".webp", "WEBP", quality=WEBP_Q, method=6)
    print(f"  -> {name}  ({im.width}x{im.height})")


if __name__ == "__main__":
    print("PHOTOS:")
    for src, name in MAP.items():
        try:
            convert(src, name)
        except Exception as e:
            print(f"  !! {src}: {e!r}")
    print("DONE")
