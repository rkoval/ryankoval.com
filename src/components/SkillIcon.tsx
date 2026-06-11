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

function SkillSymbolUse({
  symbolId,
  viewBox,
  className,
  title,
  grayscaleTint,
}: {
  symbolId: string;
  viewBox: string;
  className?: string;
  title: string;
  grayscaleTint?: boolean;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={cn(
        'skill-symbol skill-tile-img h-full w-full text-foreground',
        grayscaleTint && 'exp-skill-img',
        className
      )}
      role="img"
      aria-label={title}
    >
      <use href={`#${symbolId}`} />
    </svg>
  );
}

function ContrastShell({
  contrast,
  stroke,
  front,
}: {
  contrast: boolean;
  stroke?: ReactNode;
  front: ReactNode;
}) {
  if (!contrast) {
    return (
      <span className="relative flex h-full w-full items-center justify-center">{front}</span>
    );
  }

  return (
    <span className="relative h-full w-full">
      {stroke}
      <span className="skill-img-stroke-inset z-[1]">{front}</span>
    </span>
  );
}

const tileImgClass = 'skill-tile-img h-full w-full object-contain opacity-85';

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
  const imgClass = cn(tileImgClass, grayscaleTint && 'exp-skill-img');

  if (rasterUrl) {
    return (
      <ContrastShell
        contrast={contrast}
        stroke={
          <span className="skill-img-stroke-layer skill-img-stroke-inset pointer-events-none" aria-hidden>
            <img src={rasterUrl} alt="" className={imgClass} />
          </span>
        }
        front={
          <span className={cn('h-full w-full', contrast && isRaster && 'skill-img-dark-contrast-raster')}>
            <img src={rasterUrl} alt={title} className={imgClass} loading={loading} decoding="async" />
          </span>
        }
      />
    );
  }

  if (!symbolId) {
    if (!imgFallbackUrl) return null;
    return (
      <ContrastShell
        contrast={contrast}
        stroke={
          <span className="skill-img-stroke-layer skill-img-stroke-inset pointer-events-none" aria-hidden>
            <img src={imgFallbackUrl} alt="" className={imgClass} />
          </span>
        }
        front={
          <img
            src={imgFallbackUrl}
            alt={title}
            className={imgClass}
            loading={loading}
            decoding="async"
          />
        }
      />
    );
  }

  return (
    <ContrastShell
      contrast={contrast}
      stroke={
        <span className="skill-img-stroke-layer skill-img-stroke-inset pointer-events-none" aria-hidden>
          <SkillSymbolUse
            symbolId={symbolId}
            viewBox={viewBox}
            title=""
            grayscaleTint={grayscaleTint}
            className="opacity-85"
          />
        </span>
      }
      front={
        <SkillSymbolUse
          symbolId={symbolId}
          viewBox={viewBox}
          title={title}
          grayscaleTint={grayscaleTint}
          className="opacity-85"
        />
      }
    />
  );
}
