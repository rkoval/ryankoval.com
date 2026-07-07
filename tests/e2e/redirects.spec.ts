import {expect, test} from '@playwright/test';

const redirects = [
  {
    host: 'resume.ryankoval.local',
    path: '/',
    location: 'https://ryankoval.com/resume/',
  },
  {
    host: 'resume.ryankoval.local',
    path: '/?download=1',
    location: 'https://ryankoval.com/resume/?download=1',
  },
  {
    host: 'resume.ryankoval.local',
    path: '/archive?download=1',
    location: 'https://ryankoval.com/resume/archive?download=1',
  },
  {
    host: 'blog.ryankoval.local',
    path: '/',
    location: 'https://ryankoval.com/blog/',
  },
  {
    host: 'blog.ryankoval.local',
    path: '/recovering-tectonic-using-an-externally-provisioned-etc-on-aws',
    location:
      'https://ryankoval.com/blog/recovering-tectonic-using-an-externally-provisioned-etc-on-aws',
  },
  {
    host: 'resume.ryankoval.com',
    path: '/',
    location: 'https://ryankoval.com/resume/',
  },
  {
    host: 'blog.ryankoval.com',
    path: '/',
    location: 'https://ryankoval.com/blog/',
  },
] as const;

test.describe('redirect behavior', () => {
  for (const redirect of redirects) {
    test(`${redirect.host}${redirect.path} redirects to ${redirect.location}`, async ({
      request,
    }) => {
      const response = await request.get(redirect.path, {
        headers: {Host: redirect.host},
        maxRedirects: 0,
      });

      expect(response.status()).toBe(301);
      expect(response.headers().location).toBe(redirect.location);
    });
  }

  test('amp suffix redirects to the canonical local path', async ({request}) => {
    const response = await request.get('/resume/amp?source=rss', {
      headers: {Host: 'ryankoval.local'},
      maxRedirects: 0,
    });

    expect(response.status()).toBe(302);
    expect(response.headers().location).toBe('http://ryankoval.local/resume?source=rss');
  });
});
