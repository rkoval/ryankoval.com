import {useState} from 'react';
import {Link} from '@tanstack/react-router';
import {FaGithub, FaLinkedin, FaBookmark, FaGlobe} from 'react-icons/fa';
import {Pizza} from 'lucide-react';
import type {IconType} from 'react-icons';
import {socials} from '@/lib/resume-basics';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

const NAV_LINKS = [
  {to: '/', label: 'Home'},
  {to: '/resume', label: 'Résumé'},
  {to: '/blog', label: 'Blog'},
] as const;

const navLinkClass =
  'rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground';

const mobileNavLinkClass =
  'block rounded-md px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary [&.active]:bg-secondary';

function socialIcon(network: string): IconType {
  const n = network.toLowerCase();
  if (n.includes('github')) return FaGithub;
  if (n.includes('linkedin')) return FaLinkedin;
  if (n.includes('bookmark')) return FaBookmark;
  return FaGlobe;
}

function MenuToggleIcon({open}: {open: boolean}) {
  const bar =
    'absolute left-0 block h-0.5 w-5 origin-center rounded-full bg-current transition-transform duration-200 ease-out';

  return (
    <span className="relative block h-5 w-5" aria-hidden>
      <span
        className={cn(bar, open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[3px] rotate-0')}
      />
      <span className={cn(bar, 'top-1/2 -translate-y-1/2', open ? 'scale-x-0' : 'scale-x-100')} />
      <span
        className={cn(bar, open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-[3px] rotate-0')}
      />
    </span>
  );
}

function SocialLinks() {
  return (
    <>
      {socials.map((s) => (
        <a
          key={s.network}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.network}
          title={s.network}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {(() => {
            const Icon = socialIcon(s.network);
            return <Icon size={18} />;
          })()}
        </a>
      ))}
      <a
        href="https://ryankoval.pizza"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pizza"
        title="ryankoval.pizza"
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Pizza size={18} />
      </a>
    </>
  );
}

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-[100] border-b border-border bg-background max-sm:bg-background sm:bg-background/80 sm:backdrop-blur-md print-hide relative">
      <div className="page-container-wide flex items-center justify-between py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuToggleIcon open={menuOpen} />
          </Button>

          <div className="hidden items-center gap-1 sm:flex sm:gap-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={navLinkClass}
                activeOptions={{exact: l.to === '/'}}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <SocialLinks />
        </div>
      </div>

      <div
        className={cn(
          'absolute inset-x-0 top-full border-b border-border bg-background py-2 shadow-md transition-all duration-200 ease-out sm:hidden',
          menuOpen
            ? 'visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible -translate-y-2 opacity-0'
        )}
        aria-hidden={!menuOpen}
      >
        <div className="page-container-wide">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={mobileNavLinkClass}
              activeOptions={{exact: l.to === '/'}}
              tabIndex={menuOpen ? undefined : -1}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
