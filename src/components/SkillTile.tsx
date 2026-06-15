import {type ReactNode} from 'react';
import {cn} from '@/lib/utils';

type SkillTileProps = {
  title: string;
  ariaLabel?: string;
  href?: string;
  variant: 'marquee' | 'experience';
  children: ReactNode;
};

export function SkillTile({title, ariaLabel, href, variant, children}: SkillTileProps) {
  const tileClass = cn('skill-tile', variant === 'marquee' ? 'skill-tile--marquee' : 'skill-tile--experience');
  const labelClass = cn(
    'skill-tile-label',
    variant === 'marquee' ? 'skill-tile-label--marquee' : 'skill-tile-label--experience'
  );
  const anchorLabel = ariaLabel && ariaLabel !== title ? ariaLabel : undefined;

  const inner = (
    <>
      {children}
      <span className={labelClass}>{title}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        {...(anchorLabel ? {'aria-label': anchorLabel} : {})}
        className={tileClass}
      >
        {inner}
      </a>
    );
  }

  return (
    <div title={title} className={tileClass}>
      {inner}
    </div>
  );
}
