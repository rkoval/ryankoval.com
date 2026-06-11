import {readdirSync, readFileSync, writeFileSync, mkdirSync, statSync} from 'node:fs';
import {extname, join, relative} from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SKILLS_DIR = join(ROOT, 'src/assets/skills');
const OUT_DIR = join(ROOT, 'src/generated');
const OUT_TS = join(OUT_DIR, 'skills-sprite.ts');
const OUT_SVG = join(OUT_DIR, 'skills-sprite.svg');

const SVG_OPEN = /^<([\w-]+:)?svg\b[^>]*>/i;
const SVG_CLOSE = /<\/([\w-]+:)?svg>\s*$/i;

/** Sprites that don't survive symbol extraction — marquee uses bundled &lt;img&gt; instead. */
const MARQUEE_IMG_FALLBACK_KEYS = new Set<string>([]);

function toSymbolId(fileStem: string): string {
  const slug = fileStem
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `skill-${slug}`;
}

function firstSvgOpenTag(svg: string): string | undefined {
  return svg.match(/<(?:[\w-]+:)?svg([^>]*)>/i)?.[1];
}

function viewBoxFromSvg(svg: string): string {
  const open = firstSvgOpenTag(svg);
  const fromOpen = open?.match(/\bviewBox=["']([^"']+)["']/i)?.[1];
  if (fromOpen) return fromOpen;
  const viewBox = svg.match(/viewBox=["']([^"']+)["']/i)?.[1];
  if (viewBox) return viewBox;
  const w = svg.match(/\bwidth=["']([^"']+)["']/i)?.[1];
  const h = svg.match(/\bheight=["']([^"']+)["']/i)?.[1];
  if (w && h) {
    const pw = parseFloat(w);
    const ph = parseFloat(h);
    if (!Number.isNaN(pw) && !Number.isNaN(ph)) return `0 0 ${pw} ${ph}`;
  }
  return '0 0 24 24';
}

function innerSvgMarkup(svg: string): string {
  let markup = svg
    .replace(/<\?xml[^?]*\?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  while (SVG_OPEN.test(markup)) {
    markup = markup.replace(SVG_OPEN, '').replace(SVG_CLOSE, '').trim();
  }

  return markup;
}

function stripEditorMetadata(markup: string): string {
  return markup
    .replace(/<(?:[\w-]+:)?namedview\b[\s\S]*?(?:\/>|<\/(?:[\w-]+:)?namedview>)/gi, '')
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
    .replace(/<(?:[\w-]+:)?guide\b[^>]*\/?>/gi, '');
}

/** Remove groups explicitly hidden in inline style (Inkscape export junk). */
function stripDisplayNoneGroups(markup: string): string {
  let prev = '';
  let out = markup;
  const hiddenGroup =
    /<g\b[^>]*style="[^"]*display:\s*none[^"]*"[^>]*>[\s\S]*?<\/g>/gi;
  while (out !== prev) {
    prev = out;
    out = out.replace(hiddenGroup, '');
  }
  return out;
}

/**
 * Remix (and similar) ship paired paths: gradient + currentColor overlay for CSS themes.
 * In a sprite, the currentColor copy stacks on top and washes out colors — drop it.
 */
function dropDuplicateCurrentColorPaths(markup: string): string {
  const paths: {full: string; d: string; fill: string}[] = [];
  for (const m of markup.matchAll(/<path\b([^>]*)\/?>/gi)) {
    const attrs = m[1];
    const d = attrs.match(/\bd="([^"]+)"/)?.[1];
    if (!d) continue;
    const fill = attrs.match(/\bfill="([^"]+)"/)?.[1] ?? '';
    paths.push({full: m[0], d, fill});
  }

  const drop = new Set<string>();
  const byD = new Map<string, {full: string; d: string; fill: string}[]>();
  for (const p of paths) {
    const list = byD.get(p.d) ?? [];
    list.push(p);
    byD.set(p.d, list);
  }
  for (const group of byD.values()) {
    const hasGradient = group.some((p) => p.fill.startsWith('url(#'));
    if (!hasGradient) continue;
    for (const p of group) {
      if (p.fill === 'currentColor') drop.add(p.full);
    }
  }

  let out = markup;
  for (const fragment of drop) {
    out = out.replace(fragment, '');
  }
  return out;
}

/** Inkscape and similar exports use prefixed tags (ns0:path) that break in HTML inline SVG. */
function stripElementNamespaces(markup: string): string {
  return markup
    .replace(/<(\/?)(?:[\w-]+):([\w-]+)/g, '<$1$2')
    .replace(/\sxmlns:[^=]+="[^"]*"/g, '')
    .replace(/\s(?:xlink:|[\w-]+:)(href)=/g, ' $1=');
}

/** Prefix ids and url(#…) / href="#…" refs so merged defs do not clash across symbols. */
function prefixSvgIds(markup: string, prefix: string): string {
  return markup
    .replace(/\bid="([^"]+)"/g, `id="${prefix}-$1"`)
    .replace(/(?:xlink:)?href="#([^"]+)"/g, `href="#${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`);
}

/** Scope .st0 / .cls-1 style rules per symbol — global class names collide in one sprite sheet. */
function scopeSvgClasses(markup: string, scope: string): string {
  const classes = new Set<string>();
  for (const m of markup.matchAll(/\.([a-zA-Z_][\w-]*)\s*[,{]/g)) {
    classes.add(m[1]);
  }
  for (const m of markup.matchAll(/\bclass="([^"]+)"/g)) {
    for (const c of m[1].trim().split(/\s+/)) {
      if (c) classes.add(c);
    }
  }

  let out = markup;
  for (const cls of [...classes].sort((a, b) => b.length - a.length)) {
    const scoped = `${scope}-${cls}`;
    const esc = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(`\\.${esc}\\b`, 'g'), `.${scoped}`);
    out = out.replace(new RegExp(`(class="[^"]*)\\b${esc}\\b`, 'g'), `$1${scoped}`);
  }
  return out;
}

function wrapRootPresentation(markup: string, svg: string): string {
  const open = firstSvgOpenTag(svg) ?? '';
  const fill = open.match(/\bfill="([^"]+)"/i)?.[1];
  const stroke = open.match(/\bstroke="([^"]+)"/i)?.[1];
  if ((!fill || fill === 'none') && !stroke) return markup;
  const attrs = [
    fill && fill !== 'none' ? `fill="${fill}"` : '',
    stroke ? `stroke="${stroke}"` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return `<g ${attrs}>${markup}</g>`;
}

/** Shift content so viewBox starts at 0,0 — fixes icons with non-zero viewBox origins. */
function normalizeViewBox(
  viewBox: string,
  markup: string
): {viewBox: string; markup: string} {
  const parts = viewBox.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return {viewBox, markup};
  }
  const [minX, minY, width, height] = parts;
  if (minX === 0 && minY === 0) return {viewBox, markup};
  return {
    viewBox: `0 0 ${width} ${height}`,
    markup: `<g transform="translate(${-minX}, ${-minY})">${markup}</g>`,
  };
}

function prepareSymbolMarkup(raw: string, symbolId: string): {viewBox: string; markup: string} {
  const viewBox = viewBoxFromSvg(raw);
  let markup = innerSvgMarkup(raw);
  markup = stripEditorMetadata(markup);
  markup = stripDisplayNoneGroups(markup);
  markup = stripElementNamespaces(markup);
  markup = prefixSvgIds(markup, symbolId);
  markup = scopeSvgClasses(markup, symbolId);
  markup = dropDuplicateCurrentColorPaths(markup);
  markup = wrapRootPresentation(markup, raw);
  return normalizeViewBox(viewBox, markup);
}

function walkSkillFiles(dir: string, base = dir): {relPath: string; absPath: string}[] {
  const out: {relPath: string; absPath: string}[] = [];
  for (const name of readdirSync(dir).sort()) {
    const absPath = join(dir, name);
    if (statSync(absPath).isDirectory()) {
      out.push(...walkSkillFiles(absPath, base));
      continue;
    }
    out.push({relPath: relative(base, absPath).replace(/\\/g, '/'), absPath});
  }
  return out;
}

function importVarName(key: string): string {
  return key.replace(/[^a-zA-Z0-9_]/g, '_');
}

export function generateSkillsSprite() {
  const symbols: string[] = [];
  const symbolIds: Record<string, string> = {};
  const viewBoxes: Record<string, string> = {};
  const rasterImports: {key: string; importPath: string}[] = [];
  const marqueeImgImports: {key: string; importPath: string}[] = [];

  for (const {relPath, absPath} of walkSkillFiles(SKILLS_DIR)) {
    const ext = extname(relPath).toLowerCase();
    const key = relPath.slice(0, -ext.length);
    const importPath = `@/assets/skills/${relPath}?url`;

    if (ext === '.svg') {
      if (MARQUEE_IMG_FALLBACK_KEYS.has(key)) {
        marqueeImgImports.push({key, importPath});
        continue;
      }
      const raw = readFileSync(absPath, 'utf8');
      const id = toSymbolId(key);
      const {viewBox, markup} = prepareSymbolMarkup(raw, id);
      symbols.push(`  <symbol id="${id}" viewBox="${viewBox}">${markup}</symbol>`);
      symbolIds[key] = id;
      viewBoxes[key] = viewBox;
    } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      rasterImports.push({key, importPath});
    }
  }

  const spriteSvg = ['<svg xmlns="http://www.w3.org/2000/svg">', ...symbols, '</svg>'].join('\n');

  const rasterEntries = rasterImports
    .map((r) => `  '${r.key}': ${importVarName(r.key)}Url,`)
    .join('\n');

  const rasterImportLines = rasterImports
    .map((r) => `import ${importVarName(r.key)}Url from '${r.importPath}';`)
    .join('\n');

  const marqueeImgImportLines = marqueeImgImports
    .map((r) => `import ${importVarName(r.key)}MarqueeUrl from '${r.importPath}';`)
    .join('\n');

  const marqueeImgEntries = marqueeImgImports
    .map((r) => `  '${r.key}': ${importVarName(r.key)}MarqueeUrl,`)
    .join('\n');

  const symbolIdEntries = Object.entries(symbolIds)
    .map(([key, id]) => `  '${key}': '${id}',`)
    .join('\n');

  const viewBoxEntries = Object.entries(viewBoxes)
    .map(([key, viewBox]) => `  '${key}': '${viewBox}',`)
    .join('\n');

  const ts = `/** Generated by scripts/generate-skills-sprite.ts — do not edit. */
${rasterImportLines}
${marqueeImgImportLines}

export const skillSymbolIds: Record<string, string> = {
${symbolIdEntries}
};

export const skillSymbolViewBoxes: Record<string, string> = {
${viewBoxEntries}
};

export const skillRasterUrls: Record<string, string> = {
${rasterEntries}
};

/** Marquee-only: bundled asset URL when symbol extraction is unreliable. */
export const skillMarqueeImgUrls: Record<string, string> = {
${marqueeImgEntries}
};
`;

  mkdirSync(OUT_DIR, {recursive: true});
  writeFileSync(OUT_SVG, spriteSvg);
  writeFileSync(OUT_TS, ts);
  console.log(
    `skills sprite: ${symbols.length} symbols, ${rasterImports.length} raster fallback(s) → src/generated/skills-sprite.svg + skills-sprite.ts`
  );
}

generateSkillsSprite();
