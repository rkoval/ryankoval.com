import {createFileRoute, Link} from '@tanstack/react-router';
import {useRef, useState} from 'react';
import {
  profile,
  linkedInUrl,
  experience,
  education,
  certifications,
  interests,
  type ExperienceItem,
  type ExperienceSkill,
} from '@/lib/resume';
import {SkillsMarquee} from '@/components/SkillsMarquee';
import {SkillsSpriteSheet} from '@/components/SkillsSpriteSheet';
import {TopNav} from '@/components/TopNav';
import {SiteFooter} from '@/components/SiteFooter';
import {SkillIcon} from '@/components/SkillIcon';
import {SkillTile} from '@/components/SkillTile';
import {cn} from '@/lib/utils';
import {
  OG_IMAGES,
  OG_IMAGE_DIMENSIONS,
  SITE_URL,
  absoluteUrl,
  canonicalLink,
  jsonLdScript,
  socialMeta,
} from '@/lib/seo';

const HOME_TITLE = 'Ryan A. Koval — Engineering, Architecture & Leadership';
const HOME_OG_TITLE = 'Ryan A. Koval — Software Leader';
const HOME_DESCRIPTION =
  'Ryan A. Koval is a multidisciplinary software leader spanning engineering, architecture, product, and management—NVIDIA, Roblox, Guilded, LTK, and more.';
const HOME_OG_DESCRIPTION =
  'Engineering, architecture & management across NVIDIA, Roblox, Guilded, LTK and more.';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {title: HOME_TITLE},
      {name: 'description', content: HOME_DESCRIPTION},
      ...socialMeta({
        title: HOME_OG_TITLE,
        description: HOME_OG_DESCRIPTION,
        path: '/',
        image: OG_IMAGES.home,
      }),
      {property: 'og:image:width', content: OG_IMAGE_DIMENSIONS.width},
      {property: 'og:image:height', content: OG_IMAGE_DIMENSIONS.height},
      {property: 'og:image:type', content: OG_IMAGE_DIMENSIONS.type},
    ],
    links: [canonicalLink('/')],
    scripts: [
      jsonLdScript({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            name: 'Ryan A. Koval',
            url: SITE_URL,
            description: HOME_DESCRIPTION,
          },
          {
            '@type': 'Person',
            name: 'Ryan A. Koval',
            url: SITE_URL,
            jobTitle: 'Software Engineering, Architecture & Management',
            image: absoluteUrl(OG_IMAGES.home),
          },
        ],
      }),
    ],
  }),
  component: Index,
});

function CompanyLogo({item, size = 'md'}: {item: ExperienceItem; size?: 'md' | 'lg'}) {
  const box = size === 'lg' ? 'h-20 w-20' : 'h-16 w-16';
  if (!item.logo) {
    const initials = item.company
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
    return (
      <div
        className={`flex ${box} shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-sm font-semibold text-resume-muted`}
      >
        {initials}
      </div>
    );
  }
  return (
    <div
      className={`flex ${box} shrink-0 items-center justify-center overflow-hidden rounded-sm shadow-sm`}
      style={{backgroundColor: item.logoBg ?? '#ffffff'}}
    >
      <img
        src={item.logo}
        alt={`${item.company} logo`}
        className={`h-full w-full ${item.logoStyle ? 'object-contain' : 'object-cover'}`}
        style={item.logoStyle}
        loading="lazy"
      />
    </div>
  );
}

function ReadMoreDescription({text, className = ''}: {text: string; className?: string}) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const collapsedMax = '4.25rem';
  const [maxHeight, setMaxHeight] = useState(collapsedMax);

  const expand = () => {
    const el = innerRef.current;
    if (el) setMaxHeight(`${el.scrollHeight}px`);
    setOpen(true);
  };

  return (
    <div className={`border-t border-border pt-4 ${className}`}>
      <div
        ref={innerRef}
        className="read-more-collapse relative overflow-hidden"
        style={{maxHeight: open ? maxHeight : collapsedMax}}
      >
        <p className="text-sm leading-relaxed text-resume-muted">{text}</p>

        <div
          className={cn(
            'read-more-fade pointer-events-none absolute inset-x-0 bottom-0 flex h-12 items-end justify-start bg-gradient-to-t from-card via-card/85 to-transparent',
            open && 'opacity-0'
          )}
        >
          <button
            type="button"
            onClick={expand}
            aria-hidden={open}
            className={cn(
              'read-more pointer-events-auto cursor-pointer text-sm font-semibold',
              open && 'pointer-events-none'
            )}
          >
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}

function ExperienceSkillIcon({skill}: {skill: ExperienceSkill}) {
  if (!skill.spriteKey) return null;
  const displayName = skill.seoName ?? skill.name;
  return (
    <SkillTile
      title={displayName}
      ariaLabel={skill.label}
      href={skill.website}
      variant="experience"
    >
      <SkillIcon
        spriteKey={skill.spriteKey}
        title={displayName}
        useDarkModeLightBackground={skill.useDarkModeLightBackground}
        isRaster={skill.isRaster}
        rasterSrc={skill.img}
        grayscaleTint
        loading="lazy"
      />
    </SkillTile>
  );
}

function ExperienceSkills({skills}: {skills: ExperienceSkill[]}) {
  if (!skills.length) return null;
  return (
    <div className="experience-skills-grid">
      {skills.map((s) => (
        <ExperienceSkillIcon key={s.name} skill={s} />
      ))}
    </div>
  );
}

function ExperienceCard({item}: {item: ExperienceItem}) {
  return (
    <article className="card-bleed-xs card-pad rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="text-lg font-semibold text-resume-header">
              {item.link ? (
                <a href={item.link} target="_blank" rel="noreferrer">
                  {item.company}
                </a>
              ) : (
                <span className="text-resume-green">{item.company}</span>
              )}
            </h3>
            {item.meta && <span className="text-xs text-resume-muted">({item.meta})</span>}
          </div>
          <p className="mt-0.5 text-sm font-medium text-resume-body">{item.role}</p>
          <p className="text-xs text-resume-muted">{item.period}</p>
        </div>
        <CompanyLogo item={item} />
      </div>

      <ul className="hanging-list mt-4 space-y-2 text-sm leading-relaxed text-resume-body">
        {item.bullets.map((b, bi) => (
          <li key={bi}>{b}</li>
        ))}
      </ul>

      <ExperienceSkills skills={item.skills} />

      {item.description && <ReadMoreDescription text={item.description} className="mt-4" />}
    </article>
  );
}

function FeaturedCard({item}: {item: ExperienceItem}) {
  return (
    <article
      className="card-enter card-bleed-xs card-pad-featured relative overflow-hidden rounded-2xl border border-primary/30 bg-card"
      style={{boxShadow: 'var(--shadow-glow)'}}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{background: 'var(--gradient-hero)'}}
      />
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-resume-body">
          <span className="h-2 w-2 rounded-full bg-foreground" />
          Current Role
        </span>

        <div className="mt-5 flex items-start justify-between gap-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-resume-header">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer">
                    {item.company}
                  </a>
                ) : (
                  <span className="text-resume-green">{item.company}</span>
                )}
              </h3>
              {item.meta && <span className="text-sm text-resume-muted">({item.meta})</span>}
            </div>
            <p className="mt-1 text-base font-semibold text-resume-body">{item.role}</p>
            <p className="text-sm text-resume-muted">{item.period}</p>
          </div>
          <CompanyLogo item={item} size="lg" />
        </div>

        <ul className="hanging-list mt-6 space-y-3 text-[15px] leading-relaxed text-resume-body">
          {item.bullets.map((b, bi) => (
            <li key={bi}>{b}</li>
          ))}
        </ul>

        <ExperienceSkills skills={item.skills} />

        {item.description && <ReadMoreDescription text={item.description} className="mt-6" />}
      </div>
    </article>
  );
}

function Index() {
  const current = experience.find((e) => e.current);
  const rest = experience.filter((e) => !e.current);

  return (
    <main className="min-h-screen bg-background">
      <SkillsSpriteSheet />
      <TopNav />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{background: 'var(--gradient-hero)'}}
        />
        <div className="page-container relative pt-5 max-sm:mx-0 sm:pt-36">
          <div className="hero-enter content-align">
            <span className="inline-block rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium tracking-wide text-resume-muted">
              Available for high-impact work
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl text-resume-header">
              {profile.name}
            </h1>
            <p
              className="mt-3 bg-clip-text text-lg font-medium text-transparent sm:text-xl"
              style={{backgroundImage: 'var(--gradient-accent)'}}
            >
              {profile.title}
            </p>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-resume-header">
              <p>
                Ryan is a software engineering leader with 15+ years of experience across
                architecture, product, and engineering management. His career spans consulting,
                startups, acquisitions, and hyperscale platforms, with a consistent focus on turning
                complex technical domains into durable products that serve real business needs.
              </p>
              <p>
                He brings first-hand startup-to-acquisition experience from Guilded, where he helped
                build and scale the product through its acquisition by Roblox, then expanded into
                engineering leadership on larger cross-functional platform work. Today at NVIDIA, he
                leads product engineering for internal automation used to operate some of the
                world&apos;s most demanding AI infrastructure.
              </p>
              <p>
                Across roles as engineer, manager, founder, consultant, and CTO, he has stayed close
                to both the code and the customer. He is strongest where technical execution,
                product judgment, team development, and business context all matter at once.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {linkedInUrl ? (
                <a
                  href={linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  style={{background: 'var(--gradient-accent)'}}
                >
                  Contact Me
                </a>
              ) : null}
              <Link
                to="/resume"
                className="rounded-lg border border-border bg-secondary px-5 py-2.5 text-sm font-semibold text-resume-body transition-colors hover:bg-muted"
              >
                Formal Résumé
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16">
        <SkillsMarquee />
      </section>

      {/* Experience */}
      <section className="page-container pb-16">
        <h2 className="content-align mb-6 text-2xl font-semibold tracking-tight text-resume-header">
          Experience
        </h2>
        {current && (
          <div className="mb-8">
            <FeaturedCard item={current} />
          </div>
        )}
        <div className="space-y-5">
          {rest.map((item) => (
            <ExperienceCard key={item.company + item.period} item={item} />
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="page-container pb-5">
        <h2 className="content-align mb-6 text-2xl font-semibold tracking-tight text-resume-header">
          Education
        </h2>
        <div className="card-bleed-xs card-pad rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-resume-header">{education.school}</h3>
              <p className="mt-0.5 text-sm font-medium text-resume-body">{education.degree}</p>
            </div>
            {education.logo ? (
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-sm shadow-sm"
                style={{backgroundColor: education.logoBg ?? '#ffffff'}}
              >
                <img
                  src={education.logo}
                  alt={`${education.school} logo`}
                  className={`h-full w-full ${education.logoStyle ? 'object-contain' : 'object-cover'}`}
                  style={education.logoStyle}
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-sm font-semibold text-resume-muted">
                SMU
              </div>
            )}
          </div>
          <ReadMoreDescription text={education.description} className="mt-4" />
        </div>
      </section>

      {/* Certifications & Interests */}
      <section className="page-container grid gap-5 pb-24 sm:grid-cols-2">
        <div className="card-bleed-xs card-pad rounded-xl border border-border bg-card">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-resume-header">
            Certifications
          </h2>
          <ul className="hanging-list space-y-2 text-sm leading-relaxed text-resume-body">
            {certifications.map((c) => (
              <li key={c.label}>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-resume-green underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary"
                  >
                    {c.label}
                  </a>
                ) : (
                  c.label
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-bleed-xs card-pad rounded-xl border border-border bg-card">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-resume-header">
            Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => (
              <span
                key={i}
                className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-resume-body"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
