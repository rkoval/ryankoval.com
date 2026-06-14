import {TopNav} from '@/components/TopNav';
import {SiteFooter} from '@/components/SiteFooter';

type SiteErrorPageProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function SiteErrorPage({
  title = "This page didn't load",
  description = 'Something went wrong on our end. You can try refreshing or head back home.',
  onRetry,
}: SiteErrorPageProps) {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <section className="page-container flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
          ) : (
            <button
              type="button"
              onClick={() => location.reload()}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
          )}
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
