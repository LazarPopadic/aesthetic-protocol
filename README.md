# Aesthetic Protocol

A private, editorial-style website that organises a QOVES facial-analysis report into
three readable areas:

- **Overview** (`index.html`) — hero + measured scorecard at a glance.
- **Analysis** (`analysis.html`) — face shape, symmetry, proportions, averageness, dimorphism.
- **Report** (`report.html`) — the full protocol, feature by feature, with before/after sliders.
- **Plan** (`plan.html`) — a practical, non-invasive action plan (no fillers/injectables).

Built with plain HTML, CSS and JavaScript — **no build tools, no npm**. It also works as an
installable web app (PWA) that runs offline once visited.

---

## View it locally

From this folder, start any static server. With Python (already on this PC):

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/> in a browser. (Opening the `.html` files directly with
`file://` mostly works, but the service worker / PWA features only run over `http://` or
`https://`.)

---

## Put it on GitHub Pages

1. Create a new repository on GitHub, e.g. `aesthetic-protocol`.
2. Upload **the contents of this folder** to the repo root (so `index.html` is at the top
   level — not inside a sub-folder).
   - Web upload: on the repo page → **Add file → Upload files** → drag everything in.
   - Or with Git:
     ```bash
     git init
     git add .
     git commit -m "Aesthetic Protocol site"
     git branch -M main
     git remote add origin https://github.com/LazarPopadic/aesthetic-protocol.git
     git push -u origin main
     ```
3. On the repo: **Settings → Pages → Build and deployment**. Set **Source = Deploy from a
   branch**, **Branch = `main`**, **Folder = `/ (root)`**, then **Save**.
4. Wait ~1 minute. Your site will be live at:
   `https://lazarpopadic.github.io/aesthetic-protocol/`
5. On your iPhone, open that URL in **Safari → Share → Add to Home Screen** to install it as
   an app. It will open full-screen and work offline.

---

## Privacy

This is a **public** site (anyone with the link can open it), but it is set **not to be
indexed** by search engines:

- `robots.txt` disallows all crawlers.
- Every page includes `<meta name="robots" content="noindex, nofollow">`.

So your photos and analysis won't show up in Google, but the link itself is not secret.
If you later want it fully private, make the GitHub repo private (note: free GitHub Pages
won't serve a private repo, so you'd lose the phone-app URL unless you upgrade).

---

## Rebuilding the images (optional)

The images in `assets/img/` were generated from the original PDFs and photos by the scripts
in `tools/`. You don't need to run these again unless the sources change. They require
Python with `pymupdf`, `pillow`, `pillow-heif`:

```bash
python tools/build_images.py   # extracts before/after + diagrams + symmetry chart from PDFs
python tools/build_photos.py   # converts the 8 source photos to optimised web images
python tools/make_icons.py     # regenerates the PWA app icons
```

---

## File map

```
index.html · analysis.html · report.html · plan.html · 404.html
manifest.webmanifest · sw.js · robots.txt
assets/css/styles.css
assets/js/main.js · assets/js/sw-register.js
assets/fonts/        self-hosted Fraunces + Inter
assets/img/report/   before/after + diagrams from the report
assets/img/analysis/ symmetry chart
assets/img/photos/   your portrait/profile shots
assets/img/icons/    PWA + favicon
tools/               image-build scripts (not part of the website)
```
