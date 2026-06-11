# Rework Skills into a Scrolling Marquee

Replace the existing card-based Skills section on the interactive home page (`/`) with a full-width section showing all the skill logos from ryankoval.com, arranged in multiple stacked rows that slowly drift horizontally (marquee), all in the same direction, with bare icons (no card backgrounds).

## What gets pulled from ryankoval.com

The source site renders ~55 skill icons from `https://ryankoval.com/images/skills/...` (e.g. `js.svg`, `typescript.svg`, `python.svg`, `aws.svg`, `docker.svg`, `react.svg`, `kubernetes.svg`, plus a few under `aws/` and a couple `.png` files like `docker-compose.png`, `htmx.png`). All of these will be downloaded into the project as local assets so nothing depends on the external site at runtime.

## Steps

1. **Download skill icons** into `src/assets/skills/` (and `src/assets/skills/aws/` for the nested AWS ones) by fetching each file referenced in the source markup. Keep original filenames.
2. **Add a skills icon list** to `src/lib/resume-data.ts` — a flat array of `{ name, file }` entries matching the downloaded icons, replacing/superseding the old categorized `skills` data used for the cards. (The old `skills` export can stay if referenced elsewhere, or be removed if only used here.)
3. **Build a `SkillsMarquee` component** (`src/components/SkillsMarquee.tsx`):
   - Full-bleed width (breaks out of the centered `max-w-3xl` container).
   - Splits the icon list across 3 rows.
   - Each row is a horizontal track containing the icons duplicated twice back-to-back, animated with a CSS `transform: translateX` loop (linear, slow, infinite) so it scrolls seamlessly. All rows move the same direction; slightly different durations per row keep it from looking rigid.
   - Bare logos: each icon ~40–56px, generous horizontal spacing, no card/border. Subtle grayscale-to-color or opacity hover is optional polish.
   - Left/right edge fade masks so icons fade in/out at the container edges.
   - Respects `prefers-reduced-motion` (pauses animation).
4. **Wire it into `src/routes/index.tsx`** — remove the current Skills `<section>` (the grid of category cards) and render `<SkillsMarquee />` in its place, keeping the "Skills" heading.
5. **Add marquee keyframes/utilities** in `src/styles.css` (a `marquee` keyframe + edge-mask helper) so the animation works without extra deps.
6. **Verify** the build and preview the home page to confirm rows scroll smoothly and icons render.

## Technical notes

- Pure CSS animation (no new dependencies); framer-motion stays only where it already is.
- Icons rendered as `<img>` with `loading="lazy"` and `alt` from the skill name.
- Full-bleed achieved with a wrapper using negative margins / `w-screen` relative centering so the marquee spans the viewport while the rest of the page stays in the narrow column.
- SSR-safe: animation is CSS-only, no `window`/effects needed.
