import {expect, test} from '@playwright/test';

test.describe('404 behavior', () => {
  test('unknown pages return the prerendered 404 response', async ({page}) => {
    const response = await page.goto('/definitely-not-a-real-page', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle('Page not found — Ryan A. Koval');
    await expect(page.getByRole('heading', {name: '404'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Page not found'})).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });

  test('unknown static assets return 404', async ({request}) => {
    const response = await request.get('/images/definitely-not-real.png');

    expect(response.status()).toBe(404);
  });
});
