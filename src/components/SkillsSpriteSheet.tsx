import spriteSvg from '@/generated/skills-sprite.svg?raw';

const symbolMarkup = spriteSvg
  .replace(/^<svg[^>]*>/i, '')
  .replace(/<\/svg>\s*$/i, '')
  .trim();

/** Inlined once per page — marquee tiles reference symbols via &lt;use href="#skill-…"&gt;. */
export function SkillsSpriteSheet() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: symbolMarkup}}
    />
  );
}
