export function SiteFooter() {
  return (
    <footer className="print-hide border-t border-border">
      <div className="page-container flex flex-col items-center justify-center gap-1 py-4 text-xs text-resume-muted sm:flex-row sm:justify-between">
        <a
          href="https://endtoend.productions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-resume-muted underline-offset-2 hover:text-resume-muted hover:underline"
        >
          © {new Date().getFullYear()} End to End Productions LLC
        </a>
        <a
          href="https://ryankoval.pizza"
          target="_blank"
          rel="noopener noreferrer"
          className="text-resume-muted underline-offset-2 hover:text-resume-muted hover:underline"
        >
          Made with 🍕
        </a>
      </div>
    </footer>
  );
}
