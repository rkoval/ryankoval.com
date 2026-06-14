import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const CLIENT_DIR = join(import.meta.dirname, '../dist/client');
const SOURCE = join(CLIENT_DIR, '404/index.html');
const OUTPUT = join(CLIENT_DIR, '404.html');

/** Static nginx fallback — prerendered 404 UI without client bootstrap (avoids hydration crash). */
function generateStaticFallbackHtml(source: string): string {
  return source
    .replace(/<script class="\$tsr" id="\$tsr-stream-barrier">[\s\S]*?<\/script>/, '')
    .replace(/<script type="module" async="">[\s\S]*?<\/script>/, '')
    .replace(/<script>\(function\(t\)\{[\s\S]*?document\.currentScript\.remove\(\)<\/script>/, '');
}

const source = readFileSync(SOURCE, 'utf8');
writeFileSync(OUTPUT, generateStaticFallbackHtml(source));
console.log('Wrote dist/client/404.html');
