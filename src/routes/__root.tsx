import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import {useEffect, type ReactNode} from 'react';

import appCss from '../styles.css?url';
import inter400 from '@fontsource/inter/400.css?url';
import inter500 from '@fontsource/inter/500.css?url';
import inter600 from '@fontsource/inter/600.css?url';
import spaceGrotesk400 from '@fontsource/space-grotesk/400.css?url';
import spaceGrotesk600 from '@fontsource/space-grotesk/600.css?url';
import spaceGrotesk700 from '@fontsource/space-grotesk/700.css?url';
import {analyticsHeadScripts} from '../components/Analytics';
import {SiteErrorPage} from '../components/SiteErrorPage';
import {SiteNotFoundPage} from '../components/SiteNotFoundPage';
import {SkillImageFilters} from '../components/SkillImageFilters';
import {reportLovableError} from '../lib/lovable-error-reporting';

const FONT_STYLESHEETS = [
  inter400,
  inter500,
  inter600,
  spaceGrotesk400,
  spaceGrotesk600,
  spaceGrotesk700,
] as const;

function NotFoundComponent() {
  return <SiteNotFoundPage />;
}

function ErrorComponent({error, reset}: {error: Error; reset: () => void}) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, {boundary: 'tanstack_root_error_component'});
  }, [error]);

  return (
    <SiteErrorPage
      onRetry={() => {
        router.invalidate();
        reset();
      }}
    />
  );
}

export const Route = createRootRouteWithContext<{queryClient: QueryClient}>()({
  head: () => ({
    meta: [
      {charSet: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {title: 'Ryan A. Koval'},
      {
        name: 'description',
        content:
          'Ryan A. Koval — Software Engineering, Architecture & Management. Technical experience, résumé, and writing.',
      },
      {property: 'og:type', content: 'website'},
    ],
    scripts: analyticsHeadScripts(),
    links: [
      {rel: 'icon', href: '/favicon.ico'},
      {rel: 'preload', href: appCss, as: 'style'},
      {rel: 'stylesheet', href: appCss},
      ...FONT_STYLESHEETS.map((href) => ({rel: 'stylesheet' as const, href})),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({children}: {children: ReactNode}) {
  return (
    <html lang="en" className="dark bg-background">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const {queryClient} = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SkillImageFilters />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
