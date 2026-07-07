import {writeFileSync} from 'node:fs';
import {sortedPosts} from '../src/content/blog/posts';
import {stripMd} from '../src/content/blog/metadata';
import {BLOG_FEED, PAGE_METADATA, SITE_NAME, SITE_URL} from '../src/lib/site-metadata';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function rfc822Date(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00.000Z`).toUTCString();
}

const feedUrl = `${SITE_URL}${BLOG_FEED.path}`;
const blogUrl = `${SITE_URL}${PAGE_METADATA.blog.path}`;
const latestFeedDate = sortedPosts[0]?.date ?? new Date().toISOString();

const items = sortedPosts
  .map((post) => {
    const url = `${SITE_URL}/blog/${post.slug}`;
    const title = stripMd(post.title);
    const description = stripMd(post.excerpt);

    return [
      '    <item>',
      `      <title>${escapeXml(title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${rfc822Date(post.date)}</pubDate>`,
      `      <description>${escapeXml(description)}</description>`,
      ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
      '    </item>',
    ].join('\n');
  })
  .join('\n');

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  '  <channel>',
  `    <title>${escapeXml(BLOG_FEED.title)}</title>`,
  `    <link>${escapeXml(blogUrl)}</link>`,
  `    <description>${escapeXml(PAGE_METADATA.blog.description)}</description>`,
  `    <language>en-us</language>`,
  `    <lastBuildDate>${rfc822Date(latestFeedDate)}</lastBuildDate>`,
  `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
  `    <generator>${escapeXml(SITE_NAME)}</generator>`,
  items,
  '  </channel>',
  '</rss>',
].join('\n');

writeFileSync(new URL('../public/feed.xml', import.meta.url), `${xml}\n`);
console.log('Wrote public/feed.xml');
