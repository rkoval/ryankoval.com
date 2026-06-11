export const SITE_URL = 'https://ryankoval.com';
export const SITE_NAME = 'Ryan A. Koval';

export const OG_IMAGES = {
  home: '/images/home-og-image.jpg',
  resume: '/images/resume-og-image.jpg',
} as const;

/** Standard Open Graph image size (1200×630). */
export const OG_IMAGE_DIMENSIONS = {
  width: '1200',
  height: '630',
  type: 'image/jpeg',
} as const;

export const TWITTER_SITE = '@whoaitskoval';

/** Resolve a site-relative or absolute path to a full URL. */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

type SocialMetaOpts = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  publishedTime?: string;
};

/** Open Graph + Twitter card meta for a page. */
export function socialMeta({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
}: SocialMetaOpts) {
  const url = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image) : undefined;

  return [
    {property: 'og:site_name', content: SITE_NAME},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: type},
    {property: 'og:url', content: url},
    ...(imageUrl ? [{property: 'og:image', content: imageUrl}] : []),
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: TWITTER_SITE},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    ...(imageUrl ? [{name: 'twitter:image', content: imageUrl}] : []),
    ...(publishedTime ? [{property: 'article:published_time', content: publishedTime}] : []),
  ];
}

export function canonicalLink(path: string) {
  return {rel: 'canonical' as const, href: absoluteUrl(path)};
}

export function jsonLdScript(data: object) {
  return {
    type: 'application/ld+json' as const,
    children: JSON.stringify(data),
  };
}
