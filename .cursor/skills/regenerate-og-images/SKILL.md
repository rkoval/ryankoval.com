---
name: regenerate-og-images
description: >-
  Capture homepage and resume Open Graph preview images for ryankoval.com using
  Playwright MCP, then resize and compress for SEO. Use when the user asks to
  regenerate, refresh, or update OG images, social preview screenshots, or
  og:image assets for the site.
disable-model-invocation: true
---

# Regenerate OG Images (ryankoval.com)

Capture static `og:image` screenshots for the **homepage** and **resume** page,
then resize and compress them for social crawlers. Blog post covers are unchanged.

## Prerequisites

1. Site running locally at **http://localhost:8080** (dev server or preview).
2. **Playwright MCP** (`user-playwright`) enabled in Cursor.
3. **ImageMagick** (`magick`) installed (for resize/compress step).

## Output files

| Page | URL | Final path |
|------|-----|------------|
| Home | `http://localhost:8080/` | `public/images/home-og-image.jpg` |
| Resume | `http://localhost:8080/resume` | `public/images/resume-og-image.jpg` |

SEO target per image:

- **1200×630 px** (1.91:1 — Facebook/Discord/Twitter recommended size)
- **JPEG**, quality 88, metadata stripped
- **≤300 KB** each (faster crawler fetch; script warns if larger)

## Steps

1. Confirm the dev server responds:

```bash
curl -sI http://localhost:8080/ | head -1
```

2. Use Playwright MCP `browser_run_code_unsafe` to capture raw PNGs:

```javascript
async (page) => {
  const base = '/Users/ryankoval/workspace/infrastructure/ryankoval.com/public/images';
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${base}/home-og-image.png`, type: 'png' });
  await page.goto('http://localhost:8080/resume', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${base}/resume-og-image.png`, type: 'png' });
  return { home: `${base}/home-og-image.png`, resume: `${base}/resume-og-image.png` };
}
```

3. Resize, compress, and convert to SEO-friendly JPEGs:

```bash
.cursor/skills/regenerate-og-images/scripts/optimize-og-images.sh
```

The script:
- Resizes to exactly **1200×630**
- Strips EXIF/metadata
- Writes progressive JPEG at quality 88
- Removes the intermediate PNGs
- Sets `chmod 644`
- Fails if dimensions are wrong; warns if file exceeds 300 KB

4. Commit the `.jpg` files. Rebuild/redeploy `ryankoval.com` for production.

## Wiring (already configured)

`src/lib/seo.ts` maps:

- `OG_IMAGES.home` → `/images/home-og-image.jpg`
- `OG_IMAGES.resume` → `/images/resume-og-image.jpg`
- `OG_IMAGE_DIMENSIONS` → 1200×630 `image/jpeg`

Home and resume routes emit `og:image:width/height/type` meta tags.

## Notes

- `reducedMotion: 'reduce'` pauses CSS animations (e.g. skills marquee) for a stable capture.
- Viewport capture shows above-the-fold content only — appropriate for link previews.
- Re-run after significant homepage or resume layout changes.
