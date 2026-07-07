import {writeFileSync} from 'node:fs';
import {posts} from '../src/content/blog/posts';
import {PAGE_METADATA, SITE_URL} from '../src/lib/site-metadata';

type PostWithOptionalUpdate = {
  date: string;
  updated?: string;
  lastUpdated?: string;
  last_updated?: string;
  lastCreated?: string;
  last_created?: string;
};

function postLastmod(post: PostWithOptionalUpdate): string {
  return (
    post.updated ??
    post.lastUpdated ??
    post.last_updated ??
    post.lastCreated ??
    post.last_created ??
    post.date
  );
}

const buildLastmod = new Date().toISOString().slice(0, 10);
const blogLastmod = posts
  .map(postLastmod)
  .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

const staticUrls = [
  {
    loc: `${SITE_URL}${PAGE_METADATA.home.path}`,
    changefreq: 'monthly',
    priority: '1.0',
    lastmod: buildLastmod,
  },
  {
    loc: `${SITE_URL}${PAGE_METADATA.resume.path}`,
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: buildLastmod,
  },
  {
    loc: `${SITE_URL}${PAGE_METADATA.blog.path}`,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: blogLastmod,
  },
];

const postUrls = posts.map((p) => ({
  loc: `${SITE_URL}/blog/${p.slug}`,
  changefreq: 'yearly',
  priority: '0.6',
  lastmod: postLastmod(p),
}));

const urlXml = [...staticUrls, ...postUrls]
  .map((u) =>
    [
      '  <url>',
      `    <loc>${u.loc}</loc>`,
      'lastmod' in u && u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n')
  )
  .join('\n');

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urlXml,
  '</urlset>',
].join('\n');

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log('Wrote public/sitemap.xml');
