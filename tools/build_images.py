"""
Build web images for the Aesthetic Protocol site.

Extracts the clean source bitmaps embedded in the QOVES PDFs (the BEFORE/AFTER
labels are drawn as vector overlays on top, so the embedded bitmaps are clean),
discards the recurring brand watermark / label strips, pulls the per-feature
masculinity crops, and renders a fallback image of the symmetry chart.

Output: optimised WebP (primary) + JPEG (fallback) in assets/img/{report,analysis}.

Run:  python tools/build_images.py
"""
import io
import os
import fitz                      # PyMuPDF
from PIL import Image

DOWNLOADS = r"C:\Users\Lenovo\Downloads"
REPORT_PDF = os.path.join(DOWNLOADS, "protocol_report.pdf")
MASC_PDF = os.path.join(DOWNLOADS, "Masculinity Analysis _ QOVES Portal.pdf")
SYM_PDF = os.path.join(DOWNLOADS, "QOVES Portal - Your Beauty Analysis Dashboard 3.pdf")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")
OUT_REPORT = os.path.join(IMG, "report")
OUT_ANALYSIS = os.path.join(IMG, "analysis")
os.makedirs(OUT_REPORT, exist_ok=True)
os.makedirs(OUT_ANALYSIS, exist_ok=True)

MAX_W = 1100
JPG_Q = 82
WEBP_Q = 80
MATTE = (247, 244, 239)   # site off-white: cutout faces blend into the page, not black

# feature -> { role: xref }  (xrefs verified from page render/bbox probe)
REPORT_MAP = {
    "protocol": {"before": 37, "after": 38},
    "hair":     {"before": 41, "after": 40},
    "eyes":     {"before": 45, "after": 46},
    "nose":     {"profile": 48, "before": 49, "after": 50},
    "cheeks":   {"detail": 53, "before": 55, "after": 52},
    "jaw":      {"detail": 58, "before": 59, "after": 57},
    "lips":     {"detail": 62, "before": 63, "after": 61},
    "chin":     {"detail": 67, "before": 66, "after": 65},
    "skin":     {"before": 69, "after": 70},
    "neck":     {"before": 74, "after": 75},
    "ear":      {"front": 78, "side": 77},
}


def pixmap_to_pil(doc, xref):
    base = fitz.Pixmap(doc, xref)
    if (base.n - base.alpha) >= 4:               # CMYK -> RGB
        base = fitz.Pixmap(fitz.csRGB, base)
    # Transparency for these cutouts is a separate PDF soft-mask, not an alpha
    # channel. Apply it so the subject sits on off-white instead of black.
    smask_xref = doc.extract_image(xref).get("smask", 0)
    if smask_xref:
        try:
            mask = fitz.Pixmap(doc, smask_xref)
            base = fitz.Pixmap(base, mask)       # attach mask as alpha -> RGBA
        except Exception:
            pass
    if base.alpha:
        img = Image.frombytes("RGBA", (base.width, base.height), base.samples)
        bg = Image.new("RGB", img.size, MATTE)
        bg.paste(img, mask=img.getchannel("A"))  # composite cutout onto off-white
        return bg
    mode = "L" if base.n == 1 else "RGB"
    return Image.frombytes(mode, (base.width, base.height), base.samples).convert("RGB")


def save_web(img, basepath):
    if img.width > MAX_W:
        h = round(img.height * MAX_W / img.width)
        img = img.resize((MAX_W, h), Image.LANCZOS)
    img.save(basepath + ".jpg", "JPEG", quality=JPG_Q, optimize=True, progressive=True)
    img.save(basepath + ".webp", "WEBP", quality=WEBP_Q, method=6)
    print(f"  -> {os.path.basename(basepath)}  ({img.width}x{img.height})")


def build_report():
    print("REPORT images:")
    doc = fitz.open(REPORT_PDF)
    for feature, roles in REPORT_MAP.items():
        for role, xref in roles.items():
            try:
                img = pixmap_to_pil(doc, xref)
                save_web(img, os.path.join(OUT_REPORT, f"{feature}-{role}"))
            except Exception as e:
                print(f"  !! {feature}-{role} (xref {xref}): {e}")
    doc.close()


def build_masculinity():
    print("MASCULINITY crops:")
    # one feature crop per page; map page index -> feature name
    page_feature = {
        2: "eyebrows", 3: "cheeks", 4: "eyes", 5: "nose", 6: "lips",
        7: "jaw", 8: "chin", 9: "hair", 10: "neck", 11: "ears",
    }
    doc = fitz.open(MASC_PDF)
    for pno, feat in page_feature.items():
        imgs = doc[pno - 1].get_images(full=True)
        # choose the largest image on the page (the feature crop)
        best, best_area = None, 0
        for im in imgs:
            xref = im[0]
            p = fitz.Pixmap(doc, xref)
            if p.width * p.height > best_area:
                best, best_area = xref, p.width * p.height
        if best:
            try:
                save_web(pixmap_to_pil(doc, best), os.path.join(OUT_ANALYSIS, f"masc-{feat}"))
            except Exception as e:
                print(f"  !! masc-{feat}: {e}")
    doc.close()


def build_symmetry_chart():
    print("SYMMETRY chart fallback:")
    doc = fitz.open(SYM_PDF)
    # page 5 holds the landmark deviation chart
    pg = doc[4]
    pix = pg.get_pixmap(matrix=fitz.Matrix(2.2, 2.2))
    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    img.save(os.path.join(OUT_ANALYSIS, "symmetry-chart.jpg"),
             "JPEG", quality=88, optimize=True)
    img.save(os.path.join(OUT_ANALYSIS, "symmetry-chart.webp"), "WEBP", quality=85, method=6)
    print(f"  -> symmetry-chart ({img.width}x{img.height})")
    doc.close()


if __name__ == "__main__":
    build_report()
    build_masculinity()
    build_symmetry_chart()
    print("DONE")
