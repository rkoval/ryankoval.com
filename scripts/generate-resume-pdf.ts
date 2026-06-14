import {chromium} from 'playwright';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const BASE_URL = process.env.RESUME_PDF_URL ?? 'http://localhost:8080/resume';
const OUT_DIR = join(fileURLToPath(new URL('..', import.meta.url)), 'public');

async function saveResumePdf(
  browser: Awaited<ReturnType<typeof chromium.launch>>,
  filename: string,
  dark: boolean,
) {
  const page = await browser.newPage();
  await page.goto(BASE_URL, {waitUntil: 'networkidle'});
  await page.emulateMedia({media: 'print'});

  if (dark) {
    await page.evaluate(() => {
      document.documentElement.classList.add('print-dark');
      document.body.classList.add('print-dark');
      document.querySelector('.resume-page')?.classList.add('print-dark');
    });
  }

  await page.waitForTimeout(500);

  const path = join(OUT_DIR, filename);
  // preferCSSPageSize interacts badly with @page + fixed sheet heights and yields blank PDFs.
  await page.pdf({
    path,
    format: 'Letter',
    printBackground: true,
    margin: {top: '0', right: '0', bottom: '0', left: '0'},
  });

  await page.close();
  console.log(`wrote ${path}`);
}

async function main() {
  const browser = await chromium.launch();
  try {
    await saveResumePdf(browser, 'ryan-koval-resume.pdf', false);
    await saveResumePdf(browser, 'ryan-koval-resume-dark.pdf', true);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
