import {doc} from '@/lib/resume-doc';

export interface Social {
  network: string;
  url: string;
  username?: string;
}

function normalizeUrl(url: string): string {
  return url.startsWith('//') ? `https:${url}` : url;
}

const linkedInProfile = doc.basics.profiles?.find((p) =>
  p.network.toLowerCase().includes('linkedin')
);

export const linkedInUrl = linkedInProfile ? normalizeUrl(linkedInProfile.url) : undefined;

export const profile = {
  name: doc.basics.name,
  title: doc.basics.label,
  website: doc.basics.website,
  resumeUrl: 'https://ryankoval.com/resume',
};

/** Static résumé PDF downloads (regenerate with `bun run generate-resume-pdf`). */
export const RESUME_PDF = {
  light: '/ryan-koval-resume.pdf',
  dark: '/ryan-koval-resume-dark.pdf',
  downloadName: {
    light: 'ryan-koval-resume.pdf',
    dark: 'ryan-koval-resume-dark.pdf',
  },
} as const;

export const socials: Social[] = [
  ...(doc.basics.profiles ?? []).map((p) => ({
    network: p.network,
    username: p.username,
    url: normalizeUrl(p.url),
  })),
  ...(doc.basics.bookmarks ? [{network: 'Bookmarks', url: doc.basics.bookmarks}] : []),
];
