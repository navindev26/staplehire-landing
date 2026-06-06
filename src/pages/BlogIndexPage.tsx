import { SiteLayout } from '@/components/layout/SiteLayout';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogSeoHead } from '@/components/blog/BlogSeoHead';
import { getAllPosts } from '@/lib/blog';

function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <SiteLayout>
      <BlogSeoHead />
      <main id="main" className="px-4 sm:px-6 md:px-[104px] py-12 md:py-20">
        <div className="max-w-[1170px] mx-auto">
          <header className="mb-12 md:mb-16">
            <h1 className="typography-h1 text-foreground">Blog</h1>
          </header>
          {posts.length === 0 ? (
            <p className="para text-muted-foreground">No posts yet. Check back soon.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </SiteLayout>
  );
}

export function Component() {
  return <BlogIndexPage />;
}

export default BlogIndexPage;
