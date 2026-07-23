import {expect, test} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {RESUME_PDF} from '../../src/lib/site-metadata';

const resumeDownloads = [
  {
    name: 'light résumé PDF',
    linkName: /Download PDF.*Light Mode/,
    suggestedFilename: RESUME_PDF.downloadName.light,
  },
  {
    name: 'dark résumé PDF',
    linkName: /Dark Mode/,
    suggestedFilename: RESUME_PDF.downloadName.dark,
  },
] as const;

test.describe('resume', () => {
  test('renders résumé skill categories in the intended order', async ({page}) => {
    await page.goto('/resume', {waitUntil: 'domcontentloaded'});

    await expect(page.locator('.resume-skills-grid .resume-h2')).toHaveText([
      'Programming Languages',
      'Data Stores',
      'Cloud / Infrastructure',
      'Frameworks & Libraries',
      'Automation & CI/CD',
      'Miscellaneous',
    ]);
  });

  for (const resumeDownload of resumeDownloads) {
    test(`downloads the ${resumeDownload.name}`, async ({page}) => {
      await page.goto('/resume', {waitUntil: 'domcontentloaded'});

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('link', {name: resumeDownload.linkName}).click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe(resumeDownload.suggestedFilename);

      const path = await download.path();
      expect(path).not.toBeNull();

      const bytes = await readFile(path!);
      expect(bytes.byteLength).toBeGreaterThan(1_024);
      expect(bytes.subarray(0, 4).toString()).toBe('%PDF');
    });
  }

  test('keeps résumé text within each rendered page', async ({page}) => {
    await page.emulateMedia({media: 'print'});
    await page.goto('/resume', {waitUntil: 'domcontentloaded'});

    const sheets = page.locator('.resume-sheet');
    await expect(sheets).toHaveCount(3);

    const overflows = await page.evaluate(() => {
      const tolerance = 1;
      const issues: string[] = [];

      document.querySelectorAll<HTMLElement>('.resume-sheet').forEach((sheet, pageIndex) => {
        const sheetRect = sheet.getBoundingClientRect();
        const walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT);

        let textNode = walker.nextNode();
        while (textNode) {
          const text = textNode.textContent?.replace(/\s+/g, ' ').trim();
          const parent = textNode.parentElement;

          if (text && parent && getComputedStyle(parent).display !== 'none') {
            const range = document.createRange();
            range.selectNodeContents(textNode);

            for (const rect of range.getClientRects()) {
              if (!rect.width || !rect.height) continue;

              const isOutside =
                rect.left < sheetRect.left - tolerance ||
                rect.right > sheetRect.right + tolerance ||
                rect.top < sheetRect.top - tolerance ||
                rect.bottom > sheetRect.bottom + tolerance;

              if (isOutside) {
                issues.push(
                  `page ${pageIndex + 1}: "${text.slice(0, 80)}" at ` +
                    `${Math.round(rect.left)},${Math.round(rect.top)},` +
                    `${Math.round(rect.right)},${Math.round(rect.bottom)} outside ` +
                    `${Math.round(sheetRect.left)},${Math.round(sheetRect.top)},` +
                    `${Math.round(sheetRect.right)},${Math.round(sheetRect.bottom)}`
                );
              }
            }

            range.detach();
          }

          textNode = walker.nextNode();
        }
      });

      return issues;
    });

    expect(overflows).toEqual([]);
  });
});
