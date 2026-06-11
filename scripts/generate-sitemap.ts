import {writeFileSync} from 'node:fs';
import {posts} from '../src/content/blog/posts';
import {SITE_URL} from '../src/lib/seo';

const staticUrls = [
  {loc: `${SITE_URL}/`, changefreq: 'monthly', priority: '1.0'},
  {loc: `${SITE_URL}/resume`, changefreq: 'monthly', priority: '0.8'},
  {loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: '0.8'},
];

const postUrls = posts.map((p) => ({
  loc: `${SITE_URL}/blog/${p.slug}`,
  changefreq: 'yearly',
  priority: '0.6',
  lastmod: p.date,
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
