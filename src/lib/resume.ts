import {parse} from 'yaml';
// Raw YAML source of truth, scraped from ryankoval.com's resume.yml.
import rawYaml from '@/resume.yml?raw';

// ---- Image resolution: map YAML "/images/..." paths to bundled assets ----
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

function resolveSkillImg(src?: string) {
  if (!src) return undefined;
  return skillLookup[src.replace('/images/skills/', '')];
}

function resolveLogo(src?: string) {
  if (!src) return undefined;
  return logoLookup[src.replace('/images/logo/', '')];
}

function bgColorFromStyle(style?: string) {
  if (!style) return undefined;
  const m = style.match(/background-color:\s*([^;]+)/i);
  return m ? m[1].trim() : undefined;
}

function imgStyleFromStyle(style?: string): Record<string, string> | undefined {
  if (!style) return undefined;
  const out: Record<string, string> = {};
  const pad = style.match(/(?:^|;)\s*padding:\s*([^;]+)/i);
  if (pad) out.padding = pad[1].trim();
  return Object.keys(out).length ? out : undefined;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDate(d?: string) {
  if (!d) return 'present';
  const [y, m] = d.split('-');
  const mi = Number(m) - 1;
  return `${MONTHS[mi] ?? ''} ${y}`.trim();
}

function hostLabel(url: string) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^\/\//, '')
    .replace(/\/$/, '');
}

// ---- Raw YAML shapes ----
interface RawPicture {
  src?: string;
  style?: string;
}
interface RawSkill {
  name: string;
  tag: string;
  website?: string;
  resume?: boolean;
  use_dark_mode_light_background?: boolean;
  picture?: RawPicture;
}
interface RawWork {
  company: {name: string; description?: string};
  resume?: boolean;
  position: string;
  website?: string;
  picture?: RawPicture;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  skills?: RawSkill[];
}
interface RawResume {
  skills: {skill: RawSkill}[];
  basics: {
    name: string;
    label: string;
    email: string;
    website: string;
    portfolio?: string;
    bookmarks?: string;
    location?: {city?: string; region?: string; countryCode?: string};
    profiles?: {network: string; username?: string; url: string}[];
    interests?: string[];
  };
  work: RawWork[];
  education: {
    institution: string;
    website?: string;
    summary?: string;
    area?: string;
    studyType?: string;
    picture?: RawPicture;
  }[];
  awards: {title: string; date?: string; awarder?: string; summary?: string; url?: string}[];
}

const doc = parse(rawYaml) as RawResume;

// ---- Public, typed model constructed entirely from the YAML ----
export interface Skill {
  name: string;
  tag: string;
  website?: string;
  img?: string;
  inResume: boolean;
  useDarkModeLightBackground: boolean;
  isRaster: boolean;
}

export const skillsAll: Skill[] = doc.skills.map(({skill}) => ({
  name: skill.name,
  tag: skill.tag,
  website: skill.website,
  img: resolveSkillImg(skill.picture?.src),
  inResume: skill.resume === true,
  useDarkModeLightBackground: skill.use_dark_mode_light_background === true,
  isRaster: skill.picture?.src?.endsWith('.png') ?? false,
}));

export interface SkillGroup {
  category: string;
  skills: string[];
}

const categoryOrder = [
  'Programming Languages',
  'Data Stores',
  'Cloud / Infrastructure',
  'Frameworks & Libraries',
  'Automation',
  'Miscellaneous',
];

export const skillGroups: SkillGroup[] = (() => {
  const order: string[] = [];
  const map: Record<string, string[]> = {};
  for (const s of skillsAll) {
    if (!s.inResume) continue;
    if (!map[s.tag]) {
      map[s.tag] = [];
      order.push(s.tag);
    }
    map[s.tag].push(s.name);
  }
  const sorted = [...order].sort((a, b) => {
    const ia = categoryOrder.indexOf(a);
    const ib = categoryOrder.indexOf(b);
    return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
  });
  return sorted.map((category) => ({category, skills: map[category]}));
})();

export const profile = {
  name: doc.basics.name,
  title: doc.basics.label,
  email: doc.basics.email,
  website: doc.basics.website,
  resumeUrl: 'https://ryankoval.com/resume',
};

export const links = [
  doc.basics.website && {label: hostLabel(doc.basics.website), href: doc.basics.website},
  doc.basics.portfolio && {label: hostLabel(doc.basics.portfolio), href: doc.basics.portfolio},
  doc.basics.bookmarks && {label: hostLabel(doc.basics.bookmarks), href: doc.basics.bookmarks},
].filter(Boolean) as {label: string; href: string}[];

export const interests: string[] = doc.basics.interests ?? [];

export interface Social {
  network: string;
  url: string;
  username?: string;
}

export const socials: Social[] = [
  ...(doc.basics.profiles ?? []).map((p) => ({
    network: p.network,
    username: p.username,
    url: p.url.startsWith('//') ? `https:${p.url}` : p.url,
  })),
  ...(doc.basics.email
    ? [{network: 'Email', url: `mailto:${doc.basics.email}?subject=ryankoval.com%20Inquiry`}]
    : []),
  ...(doc.basics.bookmarks ? [{network: 'Bookmarks', url: doc.basics.bookmarks}] : []),
];

export interface ExperienceSkill {
  name: string;
  img?: string;
  website?: string;
  useDarkModeLightBackground: boolean;
  isRaster: boolean;
}

export interface ExperienceItem {
  company: string;
  meta?: string;
  role: string;
  period: string;
  bullets: string[];
  description?: string;
  link?: string;
  logo?: string;
  logoBg?: string;
  logoStyle?: Record<string, string>;
  current?: boolean;
  skills: ExperienceSkill[];
}

export const experience: ExperienceItem[] = (() => {
  let usedCurrent = false;
  return doc.work
    .filter((w) => w.resume === true)
    .map((w) => {
      const current = !w.endDate && !usedCurrent;
      if (current) usedCurrent = true;
      return {
        company: w.company.name,
        meta: w.company.description,
        role: w.position,
        period: `${fmtDate(w.startDate)} to ${fmtDate(w.endDate)}`,
        bullets: w.highlights ?? [],
        description: w.summary?.trim(),
        link: w.website,
        logo: resolveLogo(w.picture?.src),
        logoBg: bgColorFromStyle(w.picture?.style),
        logoStyle: imgStyleFromStyle(w.picture?.style),
        current,
        skills: (w.skills ?? [])
          .map((s) => ({
            name: s.name,
            img: resolveSkillImg(s.picture?.src),
            website: s.website,
            useDarkModeLightBackground: s.use_dark_mode_light_background === true,
            isRaster: s.picture?.src?.endsWith('.png') ?? false,
          }))
          .filter((s) => s.img),
      };
    });
})();

// Page-split logic mirroring resume.ryankoval.com's template.
const jobsOnFirstPage = 4;
export const firstPageJobs: ExperienceItem[] = experience.slice(0, jobsOnFirstPage);
export const restJobs: ExperienceItem[] = experience.slice(jobsOnFirstPage);

const edu = doc.education[0];
export const education = {
  school: edu.institution,
  degree: [edu.studyType, edu.area].filter(Boolean).join(', '),
  description: edu.summary ?? '',
  logo: resolveLogo(edu.picture?.src),
  logoBg: bgColorFromStyle(edu.picture?.style),
  logoStyle: imgStyleFromStyle(edu.picture?.style),
};

export interface Certification {
  label: string;
  url?: string;
}

export const certifications: Certification[] = doc.awards.map((a) => ({
  label: [a.title, a.awarder].filter(Boolean).join(' – '),
  url: a.url,
}));
