import {type ImgHTMLAttributes, type Ref} from 'react';
import {cn} from '@/lib/utils';

export type SkillImageOpts = {
  useDarkModeLightBackground?: boolean;
  isRaster?: boolean;
};

type SkillImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  opts?: SkillImageOpts;
  imgRef?: Ref<HTMLImageElement>;
  /** Green grayscale tint — experience cards only. */
  grayscaleTint?: boolean;
  /** When set, fade opacity applies to the whole icon (stroke layer + image). */
  loaded?: boolean;
};

/** Optional stroke (back) + optional grayscale tint (front) for skill icons. */
export function SkillImage({
  className,
  opts,
  imgRef,
  src,
  alt,
  grayscaleTint = false,
  loaded,
  ...props
}: SkillImageProps) {
  const contrast = opts?.useDarkModeLightBackground;
  const fadeOnRoot = loaded !== undefined;
  const fadeClass = fadeOnRoot ? (loaded ? 'opacity-100' : 'opacity-0') : undefined;

  return (
    <span
      className={cn(
        'relative flex h-full w-full items-center justify-center',
        contrast && 'skill-img-stroke-pad',
        fadeOnRoot && 'skill-tile-fade',
        fadeClass
      )}
    >
      {contrast && src ? (
        <span className="skill-img-stroke-layer pointer-events-none absolute inset-0" aria-hidden>
          <img src={src} alt="" className="h-full w-full object-contain" />
        </span>
      ) : null}
      <span
        className={cn(
          'relative z-[1] flex h-full w-full items-center justify-center',
          contrast && opts?.isRaster && 'skill-img-dark-contrast-raster'
        )}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            'h-full w-full object-contain',
            grayscaleTint && 'exp-skill-img',
            fadeOnRoot ? 'skill-tile-img opacity-85' : className
          )}
          {...props}
        />
      </span>
    </span>
  );
}
