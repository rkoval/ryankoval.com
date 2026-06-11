import {profile} from '@/lib/resume-basics';

export function SiteFooter() {
  return (
    <footer className="print-hide border-t border-border">
      <div className="page-container flex flex-col items-center justify-center gap-1 py-4 text-xs text-resume-muted sm:flex-row sm:justify-between">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Made with 🍕</span>
      </div>
    </footer>
  );
}
