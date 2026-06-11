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

// The marquee lays icons out in columns of 3 (grid-rows-3, grid-flow-col).
// For the infinite wrap to be seamless, each repeated copy must span a whole
// number of columns — i.e. the base length must be divisible by 3. If we're
// short by 1 or 2 icons, pad by duplicating icons from the very middle of the
// list, where the repeat is least noticeable.
const pad = (3 - (rawSkills.length % 3)) % 3;
const skills: Skill[] = (() => {
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
        className={`transition duration-500 ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:blur-[3px] ${loaded ? 'opacity-85' : 'opacity-0'}`}
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/65 px-1 text-center text-[13px] font-semibold leading-tight text-foreground opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
        {skill.title}
      </span>
    </>
  );

  const cls =
    'group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md sm:h-24 sm:w-24';

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
  const ref = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // Keep the scroll position within the middle third so the user can scroll
  // (and fling with inertia) in either direction without ever hitting an edge.
  const wrap = (el: HTMLDivElement) => {
    const third = el.scrollWidth / 3;
    if (third <= 0) return;
    if (el.scrollLeft >= 2 * third) el.scrollLeft -= third;
    else if (el.scrollLeft < third) el.scrollLeft += third;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Start in the middle copy so there is room to scroll left immediately.
    el.scrollLeft = el.scrollWidth / 3;

    const onScroll = () => wrap(el);
    el.addEventListener('scroll', onScroll, {passive: true});

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = performance.now();
    const speed = 28; // px per second
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      if (!pausedRef.current && !reduce) {
        el.scrollLeft += (speed * dt) / 1000;
        wrap(el);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
    };
  }, []);

  const tripled = [...skills, ...skills, ...skills];

  return (
    <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] py-2">
      <div
        ref={ref}
        className="overflow-x-auto scrollbar-hide"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        <div className="grid grid-flow-col grid-rows-3 gap-4 px-6">
          {tripled.map((skill, i) => (
            <SkillTile key={i} skill={skill} />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
