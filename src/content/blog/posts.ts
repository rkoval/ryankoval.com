import type {Post} from './types';
import {BLOG_SLUGS} from './slugs';
import {BLOG_POST_METADATA_BY_SLUG, type BlogSlug} from './metadata';
import {DebuggingJavascript} from './DebuggingJavascript';
import avoidingOptionMd from './avoiding-option.md?raw';
import recoveringTectonicMd from './recovering-tectonic.md?raw';
import thinkingCover from '@/assets/blog/thinking.png';
import kubernetesCover from '@/assets/blog/kubernetes.svg';
import awesomeCover from '@/assets/blog/awesome.jpg';

function metadataFor(slug: BlogSlug) {
  const metadata = BLOG_POST_METADATA_BY_SLUG[slug];
  const {cover: _, ...postMetadata} = metadata;
  return {slug, ...postMetadata};
}

export const posts: Post[] = [
  {
    kind: 'react',
    ...metadataFor('debugging-javascript-in-chrome-and-firefox'),
    coverImage: awesomeCover,
    Component: DebuggingJavascript,
  },
  {
    kind: 'markdown',
    ...metadataFor('avoiding-option-altogether'),
    coverImage: thinkingCover,
    content: avoidingOptionMd,
  },
  {
    kind: 'markdown',
    ...metadataFor('recovering-tectonic-using-an-externally-provisioned-etc-on-aws'),
    coverImage: kubernetesCover,
    content: recoveringTectonicMd,
  },
];

const slugs = posts.map((p) => p.slug);
const missing = BLOG_SLUGS.filter((s) => !slugs.includes(s));
const extra = slugs.filter((s) => !BLOG_SLUGS.includes(s as (typeof BLOG_SLUGS)[number]));
if (missing.length || extra.length) {
  throw new Error(
    `posts.ts slugs out of sync with slugs.ts (missing: ${missing.join(', ')}, extra: ${extra.join(', ')})`
  );
}

/** Posts sorted newest-first. */
export const sortedPosts: Post[] = [...posts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

const DATE_FMT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function formatPostDate(iso: string): string {
  // Append time to avoid timezone shifting the day backwards.
  return DATE_FMT.format(new Date(`${iso}T12:00:00`));
}

/** Splits a title into plain + `code` segments for rendering. */
export function titleSegments(title: string): {text: string; code: boolean}[] {
  return title
    .split(/(`[^`]+`)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('`') && part.endsWith('`')
        ? {text: part.slice(1, -1), code: true}
        : {text: part, code: false}
    );
}
