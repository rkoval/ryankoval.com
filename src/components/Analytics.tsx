type HeadScript = {
  src?: string;
  async?: boolean;
  defer?: boolean;
  children?: string;
  [key: string]: string | boolean | undefined;
};

/** Production analytics scripts for the document head. */
export function analyticsHeadScripts(): HeadScript[] {
  if (!import.meta.env.PROD) return [];

  return [
    {
      defer: true,
      src: 'https://static.cloudflareinsights.com/beacon.min.js',
      'data-cf-beacon': '{"token": "d74723ffc0a94df895824c092b3db8d1"}',
    },
    {
      async: true,
      src: 'https://www.googletagmanager.com/gtag/js?id=UA-64912146-1',
    },
    {
      children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','UA-64912146-1');`,
    },
  ];
}
