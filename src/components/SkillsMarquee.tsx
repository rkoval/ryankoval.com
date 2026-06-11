import {useEffect, useRef, useState} from 'react';
import {SkillImage} from '@/components/SkillImage';
import {skillsAll} from '@/lib/resume';

type Skill = {
  url: string;
  href?: string;
  title: string;
  useDarkModeLightBackground: boolean;
  isRaster: boolean;
};

const rawSkills: Skill[] = skillsAll
  .filter((s) => s.img)
  .map((s) => ({
    url: s.img as string,
    href: s.website,
    title: s.name,
    useDarkModeLightBackground: s.useDarkModeLightBackground,
    isRaster: s.isRaster,
  }));

// Icons flow in columns (grid-flow-col). Row count changes by breakpoint (4 on
// xs, 3 on sm+), so pad to lcm(4, 3) = 12 — each repeated third must span a
// whole number of columns at every row count.
const ROW_COUNTS = [4, 3] as const;
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;
const ROW_LCM = ROW_COUNTS.reduce((acc, n) => lcm(acc, n));

const skills: Skill[] = (() => {
  const pad = (ROW_LCM - (rawSkills.length % ROW_LCM)) % ROW_LCM;
  if (pad === 0 || rawSkills.length === 0) return rawSkills;
  const mid = Math.floor(rawSkills.length / 2);
  const fillers = Array.from({length: pad}, (_, i) => rawSkills[(mid + i) % rawSkills.length]);
  return [...rawSkills.slice(0, mid), ...fillers, ...rawSkills.slice(mid)];
})();

function markImageLoaded(img: HTMLImageElement | null, setLoaded: (v: boolean) => void) {
  if (img?.complete && img.naturalWidth > 0) {
    setLoaded(true);
  }
}

function SkillTile({skill}: {skill: Skill}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Cached images can finish before onLoad is attached — check after mount.
  useEffect(() => {
    markImageLoaded(imgRef.current, setLoaded);
  }, [skill.url]);

  const inner = (
    <>
      <SkillImage
        imgRef={imgRef}
        src={skill.url}
        alt={skill.title}
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
        opts={{
          useDarkModeLightBackground: skill.useDarkModeLightBackground,
          isRaster: skill.isRaster,
        }}
        loaded={loaded}
      />
      <span className="skill-tile-label pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-1 text-center text-[13px] font-semibold leading-tight text-foreground">
        {skill.title}
      </span>
    </>
  );

  // xs: 4×68 + 3×16 = 320px; sm+: 3×96 + 2×16 = 320px
  const cls =
    'group relative z-0 flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-md hover:z-10 sm:h-24 sm:w-24';

  return skill.href ? (
    <a
      href={skill.href}
      target="_blank"
      rel="noopener noreferrer"
      title={skill.title}
      className={cls}
    >
      {inner}
    </a>
  ) : (
    <div title={skill.title} className={cls}>
      {inner}
    </div>
  );
}

export function SkillsMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep the scroll position within the middle third so the user can scroll
  // (and fling with inertia) in either direction without ever hitting an edge.
  const wrap = (el: HTMLDivElement) => {
    const third = el.scrollWidth / 3;
    if (third <= 0) return;
    if (el.scrollLeft >= 2 * third) el.scrollLeft -= third;
    else if (el.scrollLeft < third) el.scrollLeft += third;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Start in the middle copy so there is room to scroll left immediately.
    el.scrollLeft = el.scrollWidth / 3;

    const onScroll = () => wrap(el);
    el.addEventListener('scroll', onScroll, {passive: true});

    const resize = new ResizeObserver(() => wrap(el));
    resize.observe(el);

    return () => {
      el.removeEventListener('scroll', onScroll);
      resize.disconnect();
    };
  }, []);

  const tripled = [...skills, ...skills, ...skills];

  return (
    <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] py-2">
      <div ref={containerRef} className="overflow-x-auto scrollbar-hide">
        <div className="grid h-[20rem] grid-flow-col grid-rows-4 gap-4 px-6 sm:grid-rows-3">
          {tripled.map((skill, i) => (
            <SkillTile key={i} skill={skill} />
          ))}
        </div>
      </div>
      <div className="skills-marquee-fade-r" aria-hidden />
    </div>
  );
}
