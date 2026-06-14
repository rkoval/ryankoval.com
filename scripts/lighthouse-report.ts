/**
 * Run Lighthouse against a URL and write HTML + JSON reports.
 * Usage: bun run scripts/lighthouse-report.ts [url]
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const url = process.argv[2] ?? 'https://ryankoval.com';
const outDir = path.join(process.cwd(), 'lighthouse-reports');
const host = new URL(url).hostname.replace(/\./g, '-');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const baseName = `${host}-${stamp}`;

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
});

try {
  const result = await lighthouse(url, {
    port: chrome.port,
    output: ['html', 'json'],
    logLevel: 'error',
    onlyCategories: ['accessibility', 'performance', 'best-practices', 'seo'],
  });

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

  const scores = {
    performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
    seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
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

  console.log(JSON.stringify({ finalUrl: lhr.finalUrl, fetchTime: lhr.fetchTime, scores, failedA11y, reports: { html: htmlPath, json: jsonPath } }, null, 2));
} finally {
  await chrome.kill();
}
