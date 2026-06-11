import {createFileRoute} from '@tanstack/react-router';
import {TopNav} from '@/components/TopNav';
import {PostCard} from '@/components/blog/PostCard';
import {SiteFooter} from '@/components/SiteFooter';
import {sortedPosts} from '@/content/blog/posts';
import {OG_IMAGES, canonicalLink, socialMeta} from '@/lib/seo';

const BLOG_TITLE = 'Blog — Ryan A. Koval';
const BLOG_DESCRIPTION =
  'Writing and notes from Ryan A. Koval on software engineering, JavaScript, Scala, and infrastructure.';

export const Route = createFileRoute('/blog')({
  head: () => ({
    meta: [
      {title: BLOG_TITLE},
      {name: 'description', content: BLOG_DESCRIPTION},
      ...socialMeta({
        title: BLOG_TITLE,
        description: BLOG_DESCRIPTION,
        path: '/blog',
        image: OG_IMAGES.home,
      }),
    ],
    links: [canonicalLink('/blog')],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <TopNav />
      <section className="page-container pb-24 pt-16">
        <header className="content-align mb-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Writing and notes on software engineering, architecture, and the occasional debugging
            rabbit hole.
          </p>
        </header>
        <div className="flex flex-col gap-4">
          {sortedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
