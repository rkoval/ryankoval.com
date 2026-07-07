import {createFileRoute} from '@tanstack/react-router';
import {TopNav} from '@/components/TopNav';
import {PostCard} from '@/components/blog/PostCard';
import {SiteFooter} from '@/components/SiteFooter';
import {sortedPosts} from '@/content/blog/posts';
import blogCss from '../blog.css?url';
import {OG_IMAGES, SITE_URL, absoluteUrl, canonicalLink, jsonLdScript, socialMeta} from '@/lib/seo';
import {PAGE_METADATA} from '@/lib/site-metadata';

const BLOG_METADATA = PAGE_METADATA.blog;

export const Route = createFileRoute('/blog')({
  head: () => ({
    meta: [
      {title: BLOG_METADATA.title},
      {name: 'description', content: BLOG_METADATA.description},
      ...socialMeta({
        title: BLOG_METADATA.ogTitle,
        description: BLOG_METADATA.ogDescription,
        path: BLOG_METADATA.path,
        image: OG_IMAGES.home,
      }),
    ],
    links: [{rel: 'stylesheet', href: blogCss}, canonicalLink(BLOG_METADATA.path)],
    scripts: [
      jsonLdScript({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: BLOG_METADATA.title,
        url: absoluteUrl(BLOG_METADATA.path),
        description: BLOG_METADATA.description,
        publisher: {'@type': 'Person', name: 'Ryan A. Koval', url: SITE_URL},
        blogPost: sortedPosts.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title.replace(/`/g, ''),
          url: absoluteUrl(`/blog/${post.slug}`),
          datePublished: post.date,
          author: {'@type': 'Person', name: 'Ryan A. Koval', url: SITE_URL},
        })),
      }),
    ],
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
