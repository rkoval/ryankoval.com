import {useEffect, useRef} from 'react';
import {SkillIcon} from '@/components/SkillIcon';
import {SkillTile} from '@/components/SkillTile';
import {skillsAll} from '@/lib/resume';

type MarqueeSkill = {
  spriteKey: string;
  href?: string;
  title: string;
  ariaLabel?: string;
  useDarkModeLightBackground: boolean;
  isRaster: boolean;
  rasterSrc?: string;
};

const rawSkills: MarqueeSkill[] = skillsAll
  .filter((s) => s.spriteKey)
  .map((s) => ({
    spriteKey: s.spriteKey as string,
    href: s.website,
    title: s.seoName ?? s.name,
    ariaLabel: s.label,
    useDarkModeLightBackground: s.useDarkModeLightBackground,
    isRaster: s.isRaster,
    rasterSrc: s.img,
  }));

// Icons flow in columns (grid-flow-col). Row count changes by breakpoint (4 on
// xs, 3 on sm+), so pad to lcm(4, 3) = 12 — each repeated third must span a
// whole number of columns at every row count.
const ROW_COUNTS = [4, 3] as const;
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;
const ROW_LCM = ROW_COUNTS.reduce((acc, n) => lcm(acc, n), 1);

const skills: MarqueeSkill[] = (() => {
  const pad = (ROW_LCM - (rawSkills.length % ROW_LCM)) % ROW_LCM;
  if (pad === 0 || rawSkills.length === 0) return rawSkills;
  const mid = Math.floor(rawSkills.length / 2);
  const fillers = Array.from({length: pad}, (_, i) => rawSkills[(mid + i) % rawSkills.length]);
  return [...rawSkills.slice(0, mid), ...fillers, ...rawSkills.slice(mid)];
})();

const MARQUEE_COPIES = 5;
const CENTER_COPY = Math.floor(MARQUEE_COPIES / 2);
const SCROLL_IDLE_MS = 160;

export function SkillsMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  const normalize = (el: HTMLDivElement) => {
    const copyWidth = el.scrollWidth / MARQUEE_COPIES;
    if (copyWidth <= 0) return;

    const offset = ((el.scrollLeft % copyWidth) + copyWidth) % copyWidth;
    el.scrollLeft = CENTER_COPY * copyWidth + offset;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    normalize(el);

    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let resizeFrame = 0;

    const scheduleNormalize = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => normalize(el), SCROLL_IDLE_MS);
    };

    // Programmatic scrollLeft writes cancel iOS momentum, so normalization waits
    // until scrolling settles instead of wrapping at each repeated-content edge.
    const onScroll = () => scheduleNormalize();
    el.addEventListener('scroll', onScroll, {passive: true});
    el.addEventListener('scrollend', scheduleNormalize);

    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => normalize(el));
    });
    resize.observe(el);

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      cancelAnimationFrame(resizeFrame);
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('scrollend', scheduleNormalize);
      resize.disconnect();
    };
  }, []);

  const repeatedSkills = Array.from({length: MARQUEE_COPIES}, () => skills).flat();

  return (
    <div className="skills-marquee">
      <div ref={containerRef} className="skills-marquee-scroll">
        <div className="skills-marquee-grid">
          {repeatedSkills.map((skill, i) => (
            <SkillTile key={i} title={skill.title} ariaLabel={skill.ariaLabel} href={skill.href} variant="marquee">
              <SkillIcon
                spriteKey={skill.spriteKey}
                title={skill.title}
                useDarkModeLightBackground={skill.useDarkModeLightBackground}
                isRaster={skill.isRaster}
                rasterSrc={skill.rasterSrc}
              />
            </SkillTile>
          ))}
        </div>
      </div>
      <div className="skills-marquee-fade-r" aria-hidden />
    </div>
  );
}
