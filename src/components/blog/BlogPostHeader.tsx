import type { BlogPostMeta } from '@/lib/blog';

interface BlogPostHeaderProps {
  post: BlogPostMeta;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <header className="blog-post-header mb-10 md:mb-12">
      <time className="caption mb-4 block text-muted-foreground" dateTime={post.date}>
        {formatDate(post.date)}
      </time>
      <h1 className="typography-h2 text-balance text-foreground">{post.title}</h1>
      <p className="blog-post-subtitle mt-4 max-w-[60ch] text-balance text-muted-foreground">
        {post.description}
      </p>
      <div className="mt-6 flex items-center gap-3">
        {post.authorImage ? (
          <img
            src={post.authorImage}
            alt={post.author}
            className="size-9 shrink-0 rounded-full border border-foreground/10 object-cover"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div
            className="size-9 shrink-0 rounded-full bg-muted border border-foreground/10 flex items-center justify-center text-sm font-semibold text-muted-foreground"
            aria-hidden="true"
          >
            {post.author.charAt(0)}
          </div>
        )}
        <span className="text-sm font-medium text-foreground">{post.author}</span>
      </div>
    </header>
  );
}
