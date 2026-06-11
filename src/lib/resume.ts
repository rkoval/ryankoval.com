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
export {profile, socials} from '@/lib/resume-basics';

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

export const links = [
  doc.basics.website && {label: hostLabel(doc.basics.website), href: doc.basics.website},
  doc.basics.portfolio && {label: hostLabel(doc.basics.portfolio), href: doc.basics.portfolio},
  doc.basics.bookmarks && {label: hostLabel(doc.basics.bookmarks), href: doc.basics.bookmarks},
].filter(Boolean) as {label: string; href: string}[];

export const interests: string[] = doc.basics.interests ?? [];

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
          .map((s: RawSkill) => ({
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
