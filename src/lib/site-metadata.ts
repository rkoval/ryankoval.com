export const SITE_URL = 'https://ryankoval.com';
export const SITE_NAME = 'Ryan A. Koval';
export const TWITTER_SITE = '@whoaitskoval';

export const OG_IMAGES = {
  home: '/images/home-og-image.jpg',
  resume: '/images/resume-og-image.jpg',
} as const;

export const PAGE_METADATA = {
  home: {
    path: '/',
    title: 'Ryan A. Koval — Engineering, Architecture & Leadership',
    description:
      'Ryan A. Koval is a multidisciplinary software leader spanning engineering, architecture, product, and management—NVIDIA, Roblox, Guilded, LTK, and more.',
    ogTitle: 'Ryan A. Koval — Software Leader',
    ogDescription:
      'Engineering, architecture & management across NVIDIA, Roblox, Guilded, LTK and more.',
    ogImage: OG_IMAGES.home,
  },
  blog: {
    path: '/blog',
    title: 'Blog — Ryan A. Koval',
    description:
      'Writing and notes from Ryan A. Koval on software engineering, JavaScript, Scala, and infrastructure.',
    ogTitle: 'Blog — Ryan A. Koval',
    ogDescription:
      'Writing and notes from Ryan A. Koval on software engineering, JavaScript, Scala, and infrastructure.',
    ogImage: OG_IMAGES.home,
  },
  resume: {
    path: '/resume',
    title: 'Resume — Ryan A. Koval',
    description:
      'Formal résumé for Ryan A. Koval — Software Engineering, Architecture & Management across NVIDIA, Roblox, Guilded, LTK and more.',
    ogTitle: 'Resume — Ryan A. Koval',
    ogDescription:
      'Formal résumé for Ryan A. Koval — Software Engineering, Architecture & Management.',
    ogImage: OG_IMAGES.resume,
  },
} as const;

/** Static résumé PDF downloads (regenerate with `bun run generate-resume-pdf`). */
export const RESUME_PDF = {
  light: '/resume/ryan-koval-resume.pdf',
  dark: '/resume/ryan-koval-resume-dark.pdf',
  downloadName: {
    light: 'ryan-koval-resume.pdf',
    dark: 'ryan-koval-resume-dark.pdf',
  },
} as const;
