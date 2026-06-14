export function SiteFooter() {
  return (
    <footer className="print-hide border-t border-border">
      <div className="page-container flex flex-col items-center justify-center gap-3 py-4 text-xs text-resume-muted sm:flex-row sm:justify-between sm:gap-6">
        <a
          href="https://endtoend.productions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-6 min-w-6 items-center py-1 text-resume-muted underline-offset-2 hover:text-resume-muted hover:underline"
        >
          © {new Date().getFullYear()} End to End Productions LLC
        </a>
        <a
          href="https://ryankoval.pizza"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-6 min-w-6 items-center py-1 text-resume-muted underline-offset-2 hover:text-resume-muted hover:underline"
        >
          Made with 🍕
        </a>
      </div>
    </footer>
  );
}
