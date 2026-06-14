import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const MINIMAL_FALLBACK = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <p>Something went wrong. <a href="/">Go home</a> or refresh to try again.</p>
  </body>
</html>`;

let cachedPrerenderedHtml: string | undefined;

function prerenderedErrorPagePaths(): string[] {
  return [
    join(process.cwd(), 'dist/client/error/index.html'),
    join(import.meta.dirname, '../../client/error/index.html'),
  ];
}

function readPrerenderedErrorPage(): string | undefined {
  if (cachedPrerenderedHtml) return cachedPrerenderedHtml;

  for (const path of prerenderedErrorPagePaths()) {
    if (!existsSync(path)) continue;
    cachedPrerenderedHtml = readFileSync(path, 'utf8');
    return cachedPrerenderedHtml;
  }

  return undefined;
}

async function fetchLiveErrorPage(request: Request): Promise<string | undefined> {
  try {
    const response = await fetch(new URL('/error', request.url), {
      headers: {accept: 'text/html'},
    });
    if (!response.ok) return undefined;
    return await response.text();
  } catch {
    return undefined;
  }
}

/** Last-resort HTML when SSR fails before React can render the /error route. */
export async function renderErrorPage(request?: Request): Promise<string> {
  const prerendered = readPrerenderedErrorPage();
  if (prerendered) return prerendered;

  if (request) {
    const live = await fetchLiveErrorPage(request);
    if (live) return live;
  }

  return MINIMAL_FALLBACK;
}
