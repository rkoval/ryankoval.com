import {expect, test, type Page} from '@playwright/test';
import {BLOG_POST_METADATA, stripMd} from '../../src/content/blog/metadata';
import {PAGE_METADATA, SITE_NAME, SITE_URL, TWITTER_SITE} from '../../src/lib/site-metadata';

type MetaSelector = {property: string} | {name: string};

type ExpectedPage = {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogType: 'website' | 'article';
  ogUrl: string;
  publishedTime?: string;
};

type ExpectedImage = {
  path: string | RegExp;
  width?: string;
  height?: string;
  type?: string;
};

const pages: ExpectedPage[] = [
  ...(['home', 'blog', 'resume'] as const).map((key) => ({
    path: PAGE_METADATA[key].path,
    title: PAGE_METADATA[key].title,
    description: PAGE_METADATA[key].description,
    ogTitle: PAGE_METADATA[key].ogTitle,
    ogDescription: PAGE_METADATA[key].ogDescription,
    ogType: 'website' as const,
    ogUrl: `${SITE_URL}${PAGE_METADATA[key].path}`,
  })),
  ...BLOG_POST_METADATA.map((post) => {
    const title = stripMd(post.title);
    const description = stripMd(post.excerpt);
    const path = `/blog/${post.slug}`;

    return {
      path,
      title: `${title} — ${SITE_NAME}`,
      description,
      ogTitle: title,
      ogDescription: description,
      ogType: 'article',
      ogUrl: `${SITE_URL}${path}`,
      publishedTime: post.date,
    } satisfies ExpectedPage;
  }),
];

function expectedOgImage(path: string): ExpectedImage {
  const pageMetadata = Object.values(PAGE_METADATA).find((page) => page.path === path);
  if (pageMetadata) return {path: pageMetadata.ogImage};

  const post = BLOG_POST_METADATA.find((metadata) => `/blog/${metadata.slug}` === path);
  if (!post) throw new Error(`Missing expected OG image source for ${path}`);

  const extension =
    post.cover.type === 'image/jpeg'
      ? 'jpe?g'
      : post.cover.type === 'image/svg+xml'
        ? 'svg'
        : post.cover.type.split('/')[1];
  return {
    path: new RegExp(`^/assets/${post.cover.assetBaseName}-.+\\.${extension}$`),
    width: post.cover.width,
    height: post.cover.height,
    type: post.cover.type,
  };
}

function metaContent(page: Page, selector: MetaSelector) {
  const attribute = 'property' in selector ? 'property' : 'name';
  const value = selector[attribute];
  return page.locator(`meta[${attribute}="${value}"]`).getAttribute('content');
}

async function expectExactMeta(page: Page, selector: MetaSelector, expected: string) {
  await expect.poll(() => metaContent(page, selector)).toBe(expected);
}

async function assertOgImageMetadata(page: Page, path: string) {
  const ogImage = await metaContent(page, {property: 'og:image'});
  expect(ogImage).toBeTruthy();

  const ogImageUrl = new URL(ogImage!);
  expect(ogImageUrl.origin).toBe(SITE_URL);

  const expectedImage = expectedOgImage(path);
  expect(ogImageUrl.pathname).toEqual(expect.stringMatching(expectedImage.path));

  const imagePath = `${ogImageUrl.pathname}${ogImageUrl.search}`;
  const imageResponse = await page.request.get(imagePath);
  expect(imageResponse.status()).toBe(200);

  const contentType = expectedImage.type ?? imageResponse.headers()['content-type']?.split(';')[0];
  expect(contentType).toBeTruthy();

  const dimensions =
    expectedImage.width && expectedImage.height
      ? {width: expectedImage.width, height: expectedImage.height}
      : await page.evaluate(
          (src) =>
            new Promise<{width: string; height: string}>((resolve, reject) => {
              const image = new Image();
              image.onload = () =>
                resolve({width: String(image.naturalWidth), height: String(image.naturalHeight)});
              image.onerror = () => reject(new Error(`Failed to load ${src}`));
              image.src = src;
            }),
          imagePath
        );

  await expectExactMeta(page, {property: 'og:image:width'}, dimensions.width);
  await expectExactMeta(page, {property: 'og:image:height'}, dimensions.height);
  await expectExactMeta(page, {property: 'og:image:type'}, contentType!);
  await expectExactMeta(page, {name: 'twitter:image'}, ogImage!);
}

test.describe('normal page metadata', () => {
  for (const expectedPage of pages) {
    test(`${expectedPage.path} loads with Open Graph metadata`, async ({page}) => {
      const response = await page.goto(expectedPage.path, {waitUntil: 'domcontentloaded'});

      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(expectedPage.title);
      await expect(page.getByRole('heading', {name: "This page didn't load"})).toHaveCount(0);
      await expect(page.getByRole('heading', {name: '404'})).toHaveCount(0);

      await expectExactMeta(page, {name: 'description'}, expectedPage.description);
      await expectExactMeta(page, {property: 'og:site_name'}, SITE_NAME);
      await expectExactMeta(page, {property: 'og:title'}, expectedPage.ogTitle);
      await expectExactMeta(page, {property: 'og:description'}, expectedPage.ogDescription);
      await expectExactMeta(page, {property: 'og:type'}, expectedPage.ogType);
      await expectExactMeta(page, {property: 'og:url'}, expectedPage.ogUrl);
      await assertOgImageMetadata(page, expectedPage.path);
      await expectExactMeta(page, {name: 'twitter:card'}, 'summary_large_image');
      await expectExactMeta(page, {name: 'twitter:site'}, TWITTER_SITE);
      await expectExactMeta(page, {name: 'twitter:title'}, expectedPage.ogTitle);
      await expectExactMeta(page, {name: 'twitter:description'}, expectedPage.ogDescription);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        expectedPage.ogUrl
      );

      if (expectedPage.publishedTime) {
        await expectExactMeta(
          page,
          {property: 'article:published_time'},
          expectedPage.publishedTime
        );
      } else {
        await expect(page.locator('meta[property="article:published_time"]')).toHaveCount(0);
      }
    });
  }
});
