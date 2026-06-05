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
    <header className="blog-post-header text-center mb-10 md:mb-12">
      <time className="caption text-muted-foreground block mb-3" dateTime={post.date}>
        {formatDate(post.date)}
      </time>
      <h1 className="blog-post-title text-foreground text-balance mb-3">{post.title}</h1>
      <p className="blog-post-subtitle text-muted-foreground max-w-[560px] mx-auto text-balance">
        {post.description}
      </p>
      <div className="flex items-center justify-center gap-3 mt-5">
        {post.authorImage ? (
          <img
            src={post.authorImage}
            alt=""
            className="size-9 shrink-0 rounded-full object-cover border border-foreground/10"
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
