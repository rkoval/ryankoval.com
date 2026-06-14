import {createFileRoute} from '@tanstack/react-router';
import {SiteErrorPage} from '@/components/SiteErrorPage';

const ERROR_TITLE = "This page didn't load — Ryan A. Koval";

export const Route = createFileRoute('/error')({
  head: () => ({
    meta: [
      {title: ERROR_TITLE},
      {name: 'robots', content: 'noindex'},
    ],
  }),
  component: ErrorPage,
});

function ErrorPage() {
  return <SiteErrorPage />;
}
