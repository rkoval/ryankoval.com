const skillImgs = import.meta.glob('@/assets/skills/**/*.{svg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const logoImgs = import.meta.glob('@/assets/logos/*.{svg,png,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function buildLookup(imgs: Record<string, string>, base: string) {
  const out: Record<string, string> = {};
  for (const [key, url] of Object.entries(imgs)) {
    const idx = key.indexOf(base);
    if (idx >= 0) out[key.slice(idx + base.length)] = url;
  }
  return out;
}

const skillLookup = buildLookup(skillImgs, '/assets/skills/');
const logoLookup = buildLookup(logoImgs, '/assets/logos/');

export function resolveSkillImg(src?: string) {
  if (!src) return undefined;
  return skillLookup[src.replace('/images/skills/', '')];
}

export function resolveLogo(src?: string) {
  if (!src) return undefined;
  return logoLookup[src.replace('/images/logo/', '')];
}
