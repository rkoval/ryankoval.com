import {parse} from 'yaml';
import rawYaml from '@/resume.yml?raw';

export interface RawPicture {
  src?: string;
  style?: string;
}

export interface RawSkill {
  name: string;
  tag: string;
  website?: string;
  resume?: boolean;
  use_dark_mode_light_background?: boolean;
  picture?: RawPicture;
}

export interface RawWork {
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

export interface RawResume {
  skills: {skill: RawSkill}[];
  basics: {
    name: string;
    label: string;
    email?: string;
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

export const doc = parse(rawYaml) as RawResume;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function fmtDate(d?: string) {
  if (!d) return 'present';
  const [y, m] = d.split('-');
  const mi = Number(m) - 1;
  return `${MONTHS[mi] ?? ''} ${y}`.trim();
}

export function hostLabel(url: string) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^\/\//, '')
    .replace(/\/$/, '');
}

export function bgColorFromStyle(style?: string) {
  if (!style) return undefined;
  const m = style.match(/background-color:\s*([^;]+)/i);
  return m ? m[1].trim() : undefined;
}

export function imgStyleFromStyle(style?: string): Record<string, string> | undefined {
  if (!style) return undefined;
  const out: Record<string, string> = {};
  const pad = style.match(/(?:^|;)\s*padding:\s*([^;]+)/i);
  if (pad) out.padding = pad[1].trim();
  return Object.keys(out).length ? out : undefined;
}
