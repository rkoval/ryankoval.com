import {type ReactNode} from 'react';
import {cn} from '@/lib/utils';
import {
  skillMarqueeImgUrls,
  skillRasterUrls,
  skillSymbolIds,
  skillSymbolViewBoxes,
} from '@/generated/skills-sprite';

export type SkillIconProps = {
  spriteKey: string;
  title: string;
  useDarkModeLightBackground: boolean;
  isRaster: boolean;
  /** Bundled URL for raster skills (PNG/JPEG). */
  rasterSrc?: string;
  /** Green grayscale tint — experience cards only. */
  grayscaleTint?: boolean;
  loading?: 'eager' | 'lazy';
};

function SkillSymbol({
  symbolId,
  viewBox,
  title,
  grayscaleTint,
}: {
  symbolId: string;
  viewBox: string;
  title: string;
  grayscaleTint?: boolean;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={cn('skill-icon-media', grayscaleTint && 'exp-skill-img')}
      role="img"
      aria-label={title}
    >
      <use href={`#${symbolId}`} />
    </svg>
  );
}

function SkillIconShell({
  contrast,
  stroke,
  front,
}: {
  contrast: boolean;
  stroke?: ReactNode;
  front: ReactNode;
}) {
  if (!contrast) {
    return <div className="skill-icon-root">{front}</div>;
  }

  return (
    <div className="skill-icon-root skill-icon-root--contrast">
      <div className="skill-icon-stroke-back skill-img-stroke-layer skill-img-stroke-inset" aria-hidden>
        {stroke}
      </div>
      <div className="skill-icon-front skill-img-stroke-inset">{front}</div>
    </div>
  );
}

/** Skill icon via build-time SVG sprite (symbols) or bundled raster URL. */
export function SkillIcon({
  spriteKey,
  title,
  useDarkModeLightBackground: contrast,
  isRaster,
  rasterSrc,
  grayscaleTint = false,
  loading = 'eager',
}: SkillIconProps) {
  const symbolId = skillSymbolIds[spriteKey];
  const viewBox = skillSymbolViewBoxes[spriteKey] ?? '0 0 24 24';
  const rasterUrl = skillRasterUrls[spriteKey] ?? (isRaster ? rasterSrc : undefined);
  const imgFallbackUrl = skillMarqueeImgUrls[spriteKey] ?? rasterSrc;
  const mediaClass = cn('skill-icon-media', grayscaleTint && 'exp-skill-img');

  if (rasterUrl) {
    const img = (alt: string, withLoading = false) => (
      <img
        src={rasterUrl}
        alt={alt}
        className={mediaClass}
        {...(withLoading ? {loading, decoding: 'async' as const} : {})}
      />
    );
    return (
      <SkillIconShell
        contrast={contrast}
        stroke={img('', false)}
        front={
          <div className={cn('skill-icon-raster-front', contrast && isRaster && 'skill-img-dark-contrast-raster')}>
            {img(title, true)}
          </div>
        }
      />
    );
  }

  if (symbolId) {
    return (
      <SkillIconShell
        contrast={contrast}
        stroke={
          <SkillSymbol symbolId={symbolId} viewBox={viewBox} title="" grayscaleTint={grayscaleTint} />
        }
        front={
          <SkillSymbol symbolId={symbolId} viewBox={viewBox} title={title} grayscaleTint={grayscaleTint} />
        }
      />
    );
  }

  if (!imgFallbackUrl) return null;

  const img = (alt: string, withLoading = false) => (
    <img
      src={imgFallbackUrl}
      alt={alt}
      className={mediaClass}
      {...(withLoading ? {loading, decoding: 'async' as const} : {})}
    />
  );

  return <SkillIconShell contrast={contrast} stroke={img('', false)} front={img(title, true)} />;
}
