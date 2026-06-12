import { SiteLayout } from '@/components/layout/SiteLayout';
import { BlogSeoHead } from '@/components/blog/BlogSeoHead';

function BlogIndexPage() {
  return (
    <SiteLayout activePage="blog">
      <BlogSeoHead />
      <main id="main" className="px-4 sm:px-6 md:px-[104px] py-12 md:py-20">
        <div className="mx-auto max-w-[1170px]">
          <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
            COMING SOON
          </p>
          <p className="para text-muted-foreground">
            We&apos;re working on our first posts. Check back soon.
          </p>
        </div>
      </main>
    </SiteLayout>
  );
}

export function Component() {
  return <BlogIndexPage />;
}

export default BlogIndexPage;
