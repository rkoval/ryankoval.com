import {expect, test} from '@playwright/test';

const useProductionHost = ['1', 'true'].includes(process.env.USE_E2E_PRODUCTION_HOST ?? '');

type Redirect = {
  localRedirectFrom: string;
  localRedirectTo: string;
  prodRedirectFrom: string;
  prodRedirectTo: string;
};

const redirects: Redirect[] = [
  {
    localRedirectFrom: 'http://resume.ryankoval.local/',
    localRedirectTo: 'https://ryankoval.com/resume/',
    prodRedirectFrom: 'https://resume.ryankoval.com/',
    prodRedirectTo: 'https://ryankoval.com/resume/',
  },
  {
    localRedirectFrom: 'http://resume.ryankoval.local/?download=1',
    localRedirectTo: 'https://ryankoval.com/resume/?download=1',
    prodRedirectFrom: 'https://resume.ryankoval.com/?download=1',
    prodRedirectTo: 'https://ryankoval.com/resume/?download=1',
  },
  {
    localRedirectFrom: 'http://resume.ryankoval.local/archive?download=1',
    localRedirectTo: 'https://ryankoval.com/resume/archive?download=1',
    prodRedirectFrom: 'https://resume.ryankoval.com/archive?download=1',
    prodRedirectTo: 'https://ryankoval.com/resume/archive?download=1',
  },
  {
    localRedirectFrom: 'http://blog.ryankoval.local/',
    localRedirectTo: 'https://ryankoval.com/blog/',
    prodRedirectFrom: 'https://blog.ryankoval.com/',
    prodRedirectTo: 'https://ryankoval.com/blog/',
  },
  {
    localRedirectFrom:
      'http://blog.ryankoval.local/recovering-tectonic-using-an-externally-provisioned-etc-on-aws',
    localRedirectTo:
      'https://ryankoval.com/blog/recovering-tectonic-using-an-externally-provisioned-etc-on-aws',
    prodRedirectFrom:
      'https://blog.ryankoval.com/recovering-tectonic-using-an-externally-provisioned-etc-on-aws',
    prodRedirectTo:
      'https://ryankoval.com/blog/recovering-tectonic-using-an-externally-provisioned-etc-on-aws',
  },
];

test.describe('redirect behavior', () => {
  for (const redirect of redirects) {
    const from = useProductionHost ? redirect.prodRedirectFrom : redirect.localRedirectFrom;
    const to = useProductionHost ? redirect.prodRedirectTo : redirect.localRedirectTo;
    const localURL = new URL(redirect.localRedirectFrom);

    test(`${from} redirects to ${to}`, async ({request}) => {
      const response = await request.get(
        useProductionHost ? from : `${localURL.pathname}${localURL.search}`,
        {
          ...(useProductionHost ? {} : {headers: {Host: localURL.host}}),
          maxRedirects: 0,
        }
      );

      expect(response.status()).toBe(301);
      expect(response.headers().location).toBe(to);
    });
  }

  test('amp suffix redirects to the canonical path', async ({request}) => {
    const response = await request.get(
      useProductionHost ? 'https://ryankoval.com/resume/amp?source=rss' : '/resume/amp?source=rss',
      {
        ...(useProductionHost ? {} : {headers: {Host: 'ryankoval.local'}}),
        maxRedirects: 0,
      }
    );

    expect(response.status()).toBe(302);
    expect(response.headers().location).toBe(
      useProductionHost
        ? 'https://ryankoval.com/resume?source=rss'
        : 'http://ryankoval.local/resume?source=rss'
    );
  });
});
