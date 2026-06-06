import { Link, useParams } from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { BlogCoverImage } from '@/components/blog/BlogCoverImage';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { BlogSeoHead } from '@/components/blog/BlogSeoHead';
import { getPostBySlug } from '@/lib/blog';

function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <SiteLayout>
        <main id="main" className="px-4 sm:px-6 md:px-[104px] py-12 md:py-20">
          <div className="max-w-[720px] mx-auto text-center">
            <h1 className="typography-h2 text-foreground mb-4">Post not found</h1>
            <p className="para text-muted-foreground mb-8">
              This article may have been moved or removed.
            </p>
            <Link to="/blog" className="text-primary font-semibold hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </main>
      </SiteLayout>
    );
  }

  const { Component: PostContent, ...meta } = post;

  return (
    <SiteLayout>
      <BlogSeoHead post={meta} />
      <main id="main" className="px-4 sm:px-6 md:px-[104px] py-12 md:py-20">
        <article className="max-w-[720px] mx-auto">
          <nav className="mb-8 md:mb-10">
            <Link
              to="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Blog
            </Link>
          </nav>

          <BlogPostHeader post={meta} />

          {meta.image && (
            <BlogCoverImage
              src={meta.image}
              alt={meta.title}
            />
          )}

          <div className="blog-prose">
            <PostContent />
          </div>
        </article>
      </main>
    </SiteLayout>
  );
}

export function Component() {
  return <BlogPostPage />;
}

export default BlogPostPage;
