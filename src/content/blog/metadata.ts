export type BlogCoverMetadata = {
  assetBaseName: string;
  width: string;
  height: string;
  type: string;
};

export type BlogPostMetadata = {
  slug: string;
  title: string;
  date: string;
  tags: readonly string[];
  excerpt: string;
  cover: BlogCoverMetadata;
};

type BlogPostMetadataValue = Omit<BlogPostMetadata, 'slug'>;

export const BLOG_POST_METADATA_BY_SLUG = {
  'debugging-javascript-in-chrome-and-firefox': {
    title: 'Debugging JavaScript in Chrome and Firefox',
    date: '2013-02-23',
    tags: ['javascript'],
    excerpt:
      'Simple tools you can use to make your life as a JavaScript developer much easier — with live, interactive demos.',
    cover: {assetBaseName: 'awesome', width: '995', height: '601', type: 'image/jpeg'},
  },
  'avoiding-option-altogether': {
    title: 'Avoiding `Option` Altogether',
    date: '2014-12-05',
    tags: ['scala', 'functional-programming', 'monads'],
    excerpt:
      'Avoiding `null`-able values when you can guarantee that a value will never be `null`/`None`.',
    cover: {assetBaseName: 'thinking', width: '1000', height: '500', type: 'image/png'},
  },
  'recovering-tectonic-using-an-externally-provisioned-etc-on-aws': {
    title: 'Recovering Tectonic Using an Externally Provisioned etcd on AWS',
    date: '2017-11-18',
    tags: ['kubernetes', 'tectonic', 'coreos'],
    excerpt:
      'Braindump of the recovery process I had to do to recover our Tectonic Kubernetes cluster from a manual configuration change that broke the control plane.',
    cover: {assetBaseName: 'kubernetes', width: '170', height: '127', type: 'image/svg+xml'},
  },
} as const satisfies Record<string, BlogPostMetadataValue>;

export type BlogSlug = keyof typeof BLOG_POST_METADATA_BY_SLUG;

export const BLOG_SLUGS = Object.keys(BLOG_POST_METADATA_BY_SLUG) as BlogSlug[];

export const BLOG_POST_METADATA: BlogPostMetadata[] = BLOG_SLUGS.map((slug) => ({
  slug,
  ...BLOG_POST_METADATA_BY_SLUG[slug],
}));

export function stripMd(s: string): string {
  return s.replace(/`/g, '');
}
