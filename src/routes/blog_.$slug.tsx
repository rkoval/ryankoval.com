import {createFileRoute, Link, notFound, useRouter} from '@tanstack/react-router';
import {TopNav} from '@/components/TopNav';
import {Markdown} from '@/components/blog/Markdown';
import {getPostBySlug, formatPostDate, titleSegments} from '@/content/blog/posts';
import blogCss from '../blog.css?url';
import {absoluteUrl, canonicalLink, jsonLdScript, socialMeta} from '@/lib/seo';

export const Route = createFileRoute('/blog_/$slug')({
  loader: ({params}): {slug: string} => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return {slug: post.slug};
  },
  head: ({params}) => {
    const post = getPostBySlug(params.slug);
    if (!post) return {};
    const title = stripMd(post.title);
    const description = stripMd(post.excerpt);
    const path = `/blog/${params.slug}`;

    return {
      meta: [
        {title: `${title} — Ryan A. Koval`},
        {name: 'description', content: description},
        ...socialMeta({
          title,
          description,
          path,
          image: post.coverImage,
          type: 'article',
          publishedTime: post.date,
        }),
      ],
      links: [{rel: 'stylesheet', href: blogCss}, canonicalLink(path)],
      scripts: [
        jsonLdScript({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          url: absoluteUrl(path),
          datePublished: post.date,
          author: {'@type': 'Person', name: 'Ryan A. Koval', url: absoluteUrl('/')},
          keywords: post.tags.join(', '),
          ...(post.coverImage ? {image: absoluteUrl(post.coverImage)} : {}),
        }),
      ],
    };
  },
  component: BlogPostPage,
  notFoundComponent: PostNotFound,
  errorComponent: PostError,
});

/** Removes inline-code backticks so titles read cleanly in metadata. */
function stripMd(s: string): string {
  return s.replace(/`/g, '');
}

function BlogPostPage() {
  const {slug} = Route.useLoaderData() as {slug: string};
  const post = getPostBySlug(slug);
  if (!post) return null;
  return (
    <main className="min-h-screen bg-background">
      <TopNav />
      <article className="page-container pb-24 pt-12">
        <div className="content-align">
          <Link to="/blog" className="read-more text-sm">
            ← All posts
          </Link>
          <header className="mb-8 mt-6">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {renderTitle(post.title)}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden>·</span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {post.coverImage ? (
            <div className="blog-cover-bleed-xs blog-cover-pad-xs mb-8 overflow-hidden">
              <img
                src={post.coverImage}
                alt={stripMd(post.title)}
                className="max-h-[420px] w-full object-cover max-xs:rounded-none xs:rounded-lg"
              />
            </div>
          ) : null}

          {post.kind === 'markdown' ? <Markdown>{post.content}</Markdown> : <post.Component />}
        </div>
      </article>
    </main>
  );
}

/** Renders a title, treating `code` spans as monospace. */
function renderTitle(title: string) {
  return titleSegments(title).map((seg, i) =>
    seg.code ? (
      <code key={i} className="font-mono">
        {seg.text}
      </code>
    ) : (
      <span key={i}>{seg.text}</span>
    )
  );
}

function PostNotFound() {
  return (
    <main className="min-h-screen bg-background">
      <TopNav />
      <section className="page-container py-24 text-center">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <p className="mt-4 text-muted-foreground">
          That post doesn't exist (or hasn't been written yet).
        </p>
        <Link to="/blog" className="read-more mt-8 inline-block">
          ← Back to the blog
        </Link>
      </section>
    </main>
  );
}

function PostError({reset}: {error: Error; reset: () => void}) {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-background">
      <TopNav />
      <section className="page-container py-24 text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">We couldn't load this post.</p>
        <button
          type="button"
          className="read-more mt-8 inline-block"
          onClick={() => {
            reset();
            router.invalidate();
          }}
        >
          Try again
        </button>
      </section>
    </main>
  );
}
