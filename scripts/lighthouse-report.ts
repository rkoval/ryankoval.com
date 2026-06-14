/**
 * Run Lighthouse against a URL and write HTML + JSON reports.
 * Usage: bun run scripts/lighthouse-report.ts [url] [mobile|desktop]
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

const url = process.argv[2] ?? 'https://ryankoval.com';
const formFactor = process.argv[3] === 'desktop' ? 'desktop' : 'mobile';
const outDir = path.join(process.cwd(), 'lighthouse-reports');
const { hostname, pathname } = new URL(url);
const host = hostname.replace(/\./g, '-');
const pathSlug = pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const baseName = `${host}-${pathSlug}-${formFactor}-${stamp}`;

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
});

try {
  const result = await lighthouse(
    url,
    {
      port: chrome.port,
      output: ['html', 'json'],
      logLevel: 'error',
      onlyCategories: ['accessibility', 'performance', 'best-practices', 'seo'],
    },
    formFactor === 'desktop' ? desktopConfig : undefined
  );

  if (!result) {
    throw new Error('Lighthouse returned no result');
  }

  const lhr = result.lhr;
  const reports = result.report;

  await mkdir(outDir, { recursive: true });

  const htmlPath = path.join(outDir, `${baseName}.html`);
  const jsonPath = path.join(outDir, `${baseName}.json`);

  const htmlReport =
    Array.isArray(reports)
      ? reports.find((r) => typeof r === 'string' && r.startsWith('<!')) ?? reports[0]
      : reports;
  const jsonReport =
    Array.isArray(reports)
      ? reports.find((r) => typeof r === 'string' && r.trim().startsWith('{')) ?? reports[1]
      : JSON.stringify(lhr);

  await writeFile(htmlPath, htmlReport);
  await writeFile(jsonPath, jsonReport);

  const toScore = (raw: number | null | undefined) => (raw == null ? null : Math.round(raw * 100));

  const scores = {
    performance: toScore(lhr.categories.performance?.score),
    accessibility: toScore(lhr.categories.accessibility?.score),
    bestPractices: toScore(lhr.categories['best-practices']?.score),
    seo: toScore(lhr.categories.seo?.score),
  };

  const a11yIds = new Set(lhr.categories.accessibility.auditRefs.map((r) => r.id));
  const failedA11y = Object.values(lhr.audits)
    .filter((a) => a11yIds.has(a.id) && a.score !== null && a.score < 1)
    .map((a) => ({
      id: a.id,
      title: a.title,
      score: a.score,
      displayValue: a.displayValue ?? null,
    }));

  console.log(
    JSON.stringify(
      {
        url,
        formFactor,
        finalUrl: lhr.finalUrl,
        fetchTime: lhr.fetchTime,
        scores,
        failedA11y,
        reports: { html: htmlPath, json: jsonPath },
      },
      null,
      2
    )
  );
} finally {
  await chrome.kill();
}
