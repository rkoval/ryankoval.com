import {createFileRoute} from '@tanstack/react-router';
import {SiteNotFoundPage} from '@/components/SiteNotFoundPage';

export const Route = createFileRoute('/$')({
  head: () => ({
    meta: [{title: 'Page not found — Ryan A. Koval'}, {name: 'robots', content: 'noindex'}],
  }),
  component: SiteNotFoundPage,
});
