import type {Post} from './types';
import {BLOG_SLUGS} from './slugs';
import {DebuggingJavascript} from './DebuggingJavascript';
import avoidingOptionMd from './avoiding-option.md?raw';
import recoveringTectonicMd from './recovering-tectonic.md?raw';
import thinkingCover from '@/assets/blog/thinking.png';
import kubernetesCover from '@/assets/blog/kubernetes.svg';
import awesomeCover from '@/assets/blog/awesome.jpg';

export const posts: Post[] = [
  {
    kind: 'react',
    slug: 'debugging-javascript-in-chrome-and-firefox',
    title: 'Debugging JavaScript in Chrome and Firefox',
    date: '2013-02-23',
    tags: ['javascript'],
    excerpt:
      'Simple tools you can use to make your life as a JavaScript developer much easier — with live, interactive demos.',
    coverImage: awesomeCover,
    Component: DebuggingJavascript,
  },
  {
    kind: 'markdown',
    slug: 'avoiding-option-altogether',
    title: 'Avoiding `Option` Altogether',
    date: '2014-12-05',
    tags: ['scala', 'functional-programming', 'monads'],
    excerpt:
      'Avoiding `null`-able values when you can guarantee that a value will never be `null`/`None`.',
    coverImage: thinkingCover,
    content: avoidingOptionMd,
  },
  {
    kind: 'markdown',
    slug: 'recovering-tectonic-using-an-externally-provisioned-etc-on-aws',
    title: 'Recovering Tectonic Using an Externally Provisioned etcd on AWS',
    date: '2017-11-18',
    tags: ['kubernetes', 'tectonic', 'coreos'],
    excerpt:
      'Braindump of the recovery process I had to do to recover our Tectonic Kubernetes cluster from a manual configuration change that broke the control plane.',
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
