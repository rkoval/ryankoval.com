import {Link} from '@tanstack/react-router';
import type {Post} from '@/content/blog/types';
import {formatPostDate, titleSegments} from '@/content/blog/posts';
import {FadeImage} from '@/components/FadeImage';

export function PostCard({post}: {post: Post}) {
  return (
    <Link
      to="/blog/$slug"
      params={{slug: post.slug}}
      className="group card-bleed-xs flex h-auto flex-col overflow-hidden rounded-xl border border-border bg-card/50 transition-colors hover:border-primary/40 hover:bg-card xs:h-[230px] xs:flex-row"
    >
      {post.coverImage ? (
        <div className="h-[294px] w-full shrink-0 overflow-hidden xs:order-last xs:h-auto xs:w-1/4 xs:p-5 xs:pl-0">
          <FadeImage
            src={post.coverImage}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover max-xs:rounded-none group-hover:scale-105 xs:rounded-lg"
          />
        </div>
      ) : null}
      <div className="card-pad flex min-w-0 flex-1 flex-col">
        <h2 className="font-display text-lg font-bold tracking-tight text-foreground group-hover:text-primary">
          {titleSegments(post.title).map((seg, i) =>
            seg.code ? (
              <code key={i} className="font-mono">
                {seg.text}
              </code>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </h2>
        <time dateTime={post.date} className="mt-1 text-sm text-muted-foreground">
          {formatPostDate(post.date)}
        </time>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-3">
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
    </Link>
  );
}
