import {createFileRoute} from '@tanstack/react-router';
import {Download} from 'lucide-react';
import {TopNav} from '@/components/TopNav';
import {SiteFooter} from '@/components/SiteFooter';
import {
  profile,
  firstPageJobs,
  restJobs,
  education,
  skillGroups,
  certifications,
  interests,
  links,
  type ExperienceItem,
  projects,
  type Project,
} from '@/lib/resume';
import {RESUME_PDF} from '@/lib/resume-basics';
import resumeCss from '../resume.css?url';
import {
  OG_IMAGES,
  OG_IMAGE_DIMENSIONS,
  SITE_URL,
  absoluteUrl,
  canonicalLink,
  jsonLdScript,
  socialMeta,
} from '@/lib/seo';

const RESUME_TITLE = 'Resume — Ryan A. Koval';
const RESUME_DESCRIPTION =
  'Formal résumé for Ryan A. Koval — Software Engineering, Architecture & Management across NVIDIA, Roblox, Guilded, LTK and more.';
const RESUME_OG_DESCRIPTION =
  'Formal résumé for Ryan A. Koval — Software Engineering, Architecture & Management.';

export const Route = createFileRoute('/resume')({
  head: () => ({
    meta: [
      {title: RESUME_TITLE},
      {name: 'description', content: RESUME_DESCRIPTION},
      ...socialMeta({
        title: RESUME_TITLE,
        description: RESUME_OG_DESCRIPTION,
        path: '/resume',
        image: OG_IMAGES.resume,
      }),
      {property: 'og:image:width', content: OG_IMAGE_DIMENSIONS.width},
      {property: 'og:image:height', content: OG_IMAGE_DIMENSIONS.height},
      {property: 'og:image:type', content: OG_IMAGE_DIMENSIONS.type},
    ],
    links: [{rel: 'stylesheet', href: resumeCss}, canonicalLink('/resume')],
    scripts: [
      jsonLdScript({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: RESUME_TITLE,
        url: absoluteUrl('/resume'),
        description: RESUME_DESCRIPTION,
        mainEntity: {
          '@type': 'Person',
          name: 'Ryan A. Koval',
          url: SITE_URL,
          jobTitle: 'Software Engineering, Architecture & Management',
          image: absoluteUrl(OG_IMAGES.resume),
        },
      }),
    ],
  }),
  component: ResumePage,
});

/** Ensure a bullet ends with terminal punctuation. */
function withPeriod(text: string) {
  const t = text.trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

/** Short company-name renderer that splits any parenthetical meta into its own muted span. */
function CompanyHeading({
  company,
  meta,
  role,
  link,
}: {
  company: string;
  meta?: string;
  role: string;
  link?: string;
}) {
  return (
    <h2 className="resume-h2">
      {link ? (
        <a href={link} target="_blank" rel="noreferrer">
          {company}
        </a>
      ) : (
        <span>{company}</span>
      )}
      {meta ? <span className="resume-company-meta"> ({meta})</span> : null}
      <span className="text-white"> · </span>
      <span>{role}</span>
    </h2>
  );
}

function ExperienceSection({item}: {item: ExperienceItem}) {
  return (
    <section className="resume-section">
      <span className="resume-date">{item.period}</span>
      <CompanyHeading company={item.company} meta={item.meta} role={item.role} link={item.link} />
      <ul className="resume-ul">
        {item.bullets.map((b, i) => (
          <li key={i}>{withPeriod(b)}</li>
        ))}
      </ul>
    </section>
  );
}

function ProjectSection({item}: {item: Project}) {
  return (
    <section className="resume-section">
      <h2 className="resume-h2">
        {item.url ? (
          <a href={item.url} target="_blank" rel="noreferrer">
            {item.name}
          </a>
        ) : (
          <span>{item.name}</span>
        )}
      </h2>
      <ul className="resume-ul">
        <li>{item.description}</li>
      </ul>
      {item.technologies.length > 0 ? (
        <div className="resume-project-metadata">Technologies: {item.technologies.join(', ')}</div>
      ) : null}
      {item.source ? (
        <div className="resume-project-metadata">
          Source:{' '}
          <a href={item.source} target="_blank" rel="noreferrer">
            {item.source.replace(/^https?:\/\//, '')}
          </a>
        </div>
      ) : null}
    </section>
  );
}

function ResumePage() {
  return (
    <main className="resume-page">
      <TopNav />

      <div className="resume-sheets">
        <div className="resume-print-actions print-hide">
          <a
            href={RESUME_PDF.light}
            download={RESUME_PDF.downloadName.light}
            className="resume-print-btn"
          >
            <Download size={15} />
            <span>Download PDF – Light Mode</span>
          </a>
          <a
            href={RESUME_PDF.dark}
            download={RESUME_PDF.downloadName.dark}
            className="resume-print-dark-link"
          >
            … or Dark Mode
          </a>
        </div>

        <div className="sheet-container">
          <div className="sheet resume-sheet">
            <header className="resume-center">
              <h1 className="resume-h1">{profile.name}</h1>
              <div className="resume-subtitle">{profile.title}</div>
              <p className="resume-contact">
                {links.map((l, i) => (
                  <span key={l.href}>
                    {i > 0 ? ' – ' : null}
                    <a href={l.href} target="_blank" rel="noreferrer">
                      {l.label}
                    </a>
                  </span>
                ))}
              </p>
            </header>

            <div className="resume-skills-grid">
              {skillGroups.map((group) => (
                <div key={group.category} className="resume-skill">
                  <h2 className="resume-h2">{group.category}</h2>
                  <div className="resume-skill-list">{group.skills.join(', ')}</div>
                </div>
              ))}
            </div>

            <hr className="resume-hr" />

            <div className="resume-rows">
              {firstPageJobs.map((item) => (
                <ExperienceSection key={item.company + item.period} item={item} />
              ))}
            </div>

            <footer className="resume-footer">Page 1 of 3</footer>
          </div>
        </div>

        <div className="sheet-container">
          <div className="sheet resume-sheet">
            <div className="resume-rows">
              {restJobs.map((item) => (
                <ExperienceSection key={item.company + item.period} item={item} />
              ))}
            </div>

            <hr className="resume-hr" />

            <div className="resume-rows">
              <section className="resume-section">
                <h2 className="resume-h2">{education.school}</h2>
                <ul className="resume-ul">
                  <li>{education.degree}</li>
                </ul>
              </section>
            </div>

            <hr className="resume-hr" />

            <div className="resume-rows">
              <section className="resume-section">
                <h2 className="resume-h2">Certifications</h2>
                <ul className="resume-ul">
                  {certifications.map((c) => (
                    <li key={c.label}>{c.label}</li>
                  ))}
                </ul>
              </section>
            </div>

            <hr className="resume-hr" />

            <div className="resume-rows">
              <section className="resume-section">
                <h2 className="resume-h2">Interests</h2>
                <ul className="resume-ul">
                  <li>{interests.join(', ')}</li>
                </ul>
              </section>
            </div>

            <footer className="resume-footer">Page 2 of 3</footer>
          </div>
        </div>

        <div className="sheet-container">
          <div className="sheet resume-sheet">
            <div className="resume-rows">
              <section className="resume-section">
                <h2 className="resume-h2">Side Projects</h2>
              </section>
              {projects.map((item) => (
                <ProjectSection key={item.name} item={item} />
              ))}
            </div>

            <footer className="resume-footer">Page 3 of 3</footer>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
