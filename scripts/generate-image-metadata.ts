import {mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {extname, join, relative, sep} from 'node:path';

type ImageMetadata = {
  width: number;
  height: number;
  type: string;
};

type ImageEntry =
  | {kind: 'public'; key: string; metadata: ImageMetadata}
  | {kind: 'asset'; importName: string; importPath: string; metadata: ImageMetadata};

const ROOT = new URL('..', import.meta.url).pathname;
const OUT_DIR = join(ROOT, 'src/generated');
const OUT_TS = join(OUT_DIR, 'image-metadata.ts');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.svg', '.webp']);

function walk(dir: string): string[] {
  return readdirSync(dir)
    .flatMap((name) => {
      const path = join(dir, name);
      const stat = statSync(path);
      return stat.isDirectory() ? walk(path) : [path];
    })
    .filter((path) => IMAGE_EXTENSIONS.has(extname(path).toLowerCase()));
}

function imageType(path: string): string {
  switch (extname(path).toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.svg':
      return 'image/svg+xml';
    case '.webp':
      return 'image/webp';
    default:
      throw new Error(`Unsupported image extension: ${path}`);
  }
}

function pngDimensions(buffer: Buffer): Pick<ImageMetadata, 'width' | 'height'> {
  const signature = '89504e470d0a1a0a';
  if (buffer.subarray(0, 8).toString('hex') !== signature) {
    throw new Error('Invalid PNG signature');
  }
  return {width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20)};
}

function jpegDimensions(buffer: Buffer): Pick<ImageMetadata, 'width' | 'height'> {
  if (buffer.readUInt16BE(0) !== 0xffd8) throw new Error('Invalid JPEG signature');

  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    offset += 2;

    if (
      marker === 0xd8 ||
      marker === 0xd9 ||
      marker === 0x01 ||
      (marker >= 0xd0 && marker <= 0xd7)
    ) {
      continue;
    }

    const length = buffer.readUInt16BE(offset);
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      };
    }

    offset += length;
  }

  throw new Error('Could not find JPEG dimensions');
}

function svgDimensions(buffer: Buffer): Pick<ImageMetadata, 'width' | 'height'> {
  const svg = buffer.toString('utf8');
  const viewBox = svg.match(/\bviewBox=["']([^"']+)["']/i)?.[1];
  if (viewBox) {
    const parts = viewBox
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      return {width: parts[2], height: parts[3]};
    }
  }

  const width = parseFloat(svg.match(/\bwidth=["']([^"']+)["']/i)?.[1] ?? '');
  const height = parseFloat(svg.match(/\bheight=["']([^"']+)["']/i)?.[1] ?? '');
  if (Number.isFinite(width) && Number.isFinite(height)) return {width, height};

  throw new Error('Could not find SVG dimensions');
}

function webpDimensions(buffer: Buffer): Pick<ImageMetadata, 'width' | 'height'> {
  if (
    buffer.subarray(0, 4).toString('ascii') !== 'RIFF' ||
    buffer.subarray(8, 12).toString('ascii') !== 'WEBP'
  ) {
    throw new Error('Invalid WebP signature');
  }

  const format = buffer.subarray(12, 16).toString('ascii');
  if (format === 'VP8X') {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }
  if (format === 'VP8L') {
    const bits = buffer.readUInt32LE(21);
    return {
      width: 1 + (bits & 0x3fff),
      height: 1 + ((bits >> 14) & 0x3fff),
    };
  }
  if (format === 'VP8 ') {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  throw new Error(`Unsupported WebP format: ${format}`);
}

function readImageMetadata(path: string): ImageMetadata {
  const buffer = readFileSync(path);
  const type = imageType(path);
  const dimensions =
    type === 'image/jpeg'
      ? jpegDimensions(buffer)
      : type === 'image/png'
        ? pngDimensions(buffer)
        : type === 'image/svg+xml'
          ? svgDimensions(buffer)
          : webpDimensions(buffer);

  return {...dimensions, type};
}

function toPublicKey(path: string): string {
  return `/${relative(join(ROOT, 'public'), path).split(sep).join('/')}`;
}

function toImportPath(path: string): string {
  return `../${relative(join(ROOT, 'src'), path).split(sep).join('/')}`;
}

function collectEntries(): ImageEntry[] {
  const publicImages = walk(join(ROOT, 'public/images')).map((path) => ({
    kind: 'public' as const,
    key: toPublicKey(path),
    metadata: readImageMetadata(path),
  }));

  const routeAssets = walk(join(ROOT, 'src/assets/blog')).map((path, index) => ({
    kind: 'asset' as const,
    importName: `routeImage${index}`,
    importPath: toImportPath(path),
    metadata: readImageMetadata(path),
  }));

  return [...publicImages, ...routeAssets];
}

function formatMetadata({width, height, type}: ImageMetadata): string {
  return `{width: '${Math.round(width)}', height: '${Math.round(height)}', type: '${type}'}`;
}

function generateTs(entries: ImageEntry[]): string {
  const imports = entries
    .filter((entry): entry is Extract<ImageEntry, {kind: 'asset'}> => entry.kind === 'asset')
    .map((entry) => `import ${entry.importName} from '${entry.importPath}';`);

  const rows = entries.map((entry) => {
    const key = entry.kind === 'public' ? JSON.stringify(entry.key) : `[${entry.importName}]`;
    return `  ${key}: ${formatMetadata(entry.metadata)},`;
  });

  return [
    '// Generated by scripts/generate-image-metadata.ts. Do not edit directly.',
    ...imports,
    '',
    'export type ImageMetadata = {width: string; height: string; type: string};',
    '',
    'export const IMAGE_METADATA: Record<string, ImageMetadata> = {',
    ...rows,
    '};',
    '',
  ].join('\n');
}

const entries = collectEntries();
mkdirSync(OUT_DIR, {recursive: true});
writeFileSync(OUT_TS, generateTs(entries));
console.log(`image metadata: ${entries.length} image(s) -> src/generated/image-metadata.ts`);
