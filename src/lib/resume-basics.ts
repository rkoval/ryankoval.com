import {doc} from '@/lib/resume-doc';

export interface Social {
  network: string;
  url: string;
  username?: string;
}

export const profile = {
  name: doc.basics.name,
  title: doc.basics.label,
  email: doc.basics.email,
  website: doc.basics.website,
  resumeUrl: 'https://ryankoval.com/resume',
};

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
