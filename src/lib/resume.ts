import {
  doc,
  fmtDate,
  hostLabel,
  bgColorFromStyle,
  imgStyleFromStyle,
  type RawSkill,
} from '@/lib/resume-doc';
import {resolveSkillImg, resolveLogo} from '@/lib/resume-images';

export type {Social} from '@/lib/resume-basics';
export {profile, socials, linkedInUrl} from '@/lib/resume-basics';

export interface Skill {
  name: string;
  label?: string;
  seoName?: string;
  tag: string;
  website?: string;
  img?: string;
  /** Basename under assets/skills (e.g. docker, docker-compose) for SVG sprite lookup. */
  spriteKey?: string;
  inResume: boolean;
  useDarkModeLightBackground: boolean;
  isRaster: boolean;
}

function skillSpriteKey(src?: string) {
  if (!src) return undefined;
  const m = src.match(/\/images\/skills\/(.+)$/);
  if (!m) return undefined;
  return m[1].replace(/\.[^.]+$/, '');
}

export const skillsAll: Skill[] = doc.skills.map(({skill}) => {
  const isRaster = /\.(png|jpe?g)$/i.test(skill.picture?.src ?? '');
  return {
    name: skill.name,
    label: skill.label,
    seoName: skill.seoName,
    tag: skill.tag,
    website: skill.website,
    img: isRaster ? resolveSkillImg(skill.picture?.src) : undefined,
    spriteKey: skillSpriteKey(skill.picture?.src),
    inResume: skill.resume === true,
    useDarkModeLightBackground: skill.use_dark_mode_light_background === true,
    isRaster,
  };
});

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

export const links = [
  doc.basics.website && {label: hostLabel(doc.basics.website), href: doc.basics.website},
  ...(doc.basics.profiles ?? [])
    .filter((p) => p.network.toLowerCase().includes('linkedin'))
    .map((p) => {
      const href = p.url.startsWith('//') ? `https:${p.url}` : p.url;
      return {label: hostLabel(href), href};
    }),
  doc.basics.portfolio && {label: hostLabel(doc.basics.portfolio), href: doc.basics.portfolio},
  doc.basics.bookmarks && {label: hostLabel(doc.basics.bookmarks), href: doc.basics.bookmarks},
].filter(Boolean) as {label: string; href: string}[];

export const interests: string[] = doc.basics.interests ?? [];

export interface ExperienceSkill {
  name: string;
  label?: string;
  seoName?: string;
  spriteKey?: string;
  /** Bundled URL for raster skills only. */
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
          .map((s: RawSkill) => {
            const isRaster = /\.(png|jpe?g)$/i.test(s.picture?.src ?? '');
            return {
              name: s.name,
              label: s.label,
              seoName: s.seoName,
              spriteKey: skillSpriteKey(s.picture?.src),
              img: isRaster ? resolveSkillImg(s.picture?.src) : undefined,
              website: s.website,
              useDarkModeLightBackground: s.use_dark_mode_light_background === true,
              isRaster,
            };
          })
          .filter((s) => s.spriteKey || s.img),
      };
    });
})();

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
