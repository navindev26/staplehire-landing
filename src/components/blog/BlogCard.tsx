import { Link } from 'react-router-dom';
import type { BlogPostMeta } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostMeta;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogCard({ post }: BlogCardProps) {
  const href = `/blog/${post.slug}`;

  return (
    <Link
      to={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card transition-all hover:border-foreground/20 hover:shadow-lg"
    >
      {post.image && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <time className="caption text-muted-foreground" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
        <h2 className="typography-h3 text-foreground group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="para text-muted-foreground line-clamp-3 flex-1">{post.description}</p>
        <span className="text-sm font-semibold text-primary">Read more →</span>
      </div>
    </Link>
  );
}
