import { Link, useParams } from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { BlogCoverImage } from '@/components/blog/BlogCoverImage';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { BlogSeoHead } from '@/components/blog/BlogSeoHead';
import { BLOG_PUBLISHED, getPostBySlug } from '@/lib/blog';

function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_PUBLISHED && slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <SiteLayout activePage="blog">
        <main id="main" className="px-4 sm:px-6 md:px-[104px] py-12 md:py-20">
          <div className="max-w-[720px] mx-auto text-center">
            <h1 className="typography-h2 text-foreground mb-4">
              {BLOG_PUBLISHED ? 'Post not found' : 'Coming soon'}
            </h1>
            <p className="para text-muted-foreground mb-8">
              {BLOG_PUBLISHED
                ? 'This article may have been moved or removed.'
                : 'Our blog is not live yet. Check back soon.'}
            </p>
            <Link to="/blog" className="font-semibold text-primary hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </main>
      </SiteLayout>
    );
  }

  const { Component: PostContent, ...meta } = post;

  return (
    <SiteLayout activePage="blog">
      <BlogSeoHead post={meta} />
      <main id="main" className="px-4 sm:px-6 md:px-[104px] py-12 md:py-20">
        <article className="max-w-[720px] mx-auto">
          <nav className="mb-8 md:mb-10" aria-label="Breadcrumb">
            <Link
              to="/blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ← All posts
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
