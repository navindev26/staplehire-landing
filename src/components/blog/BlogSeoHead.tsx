import { Head } from 'vite-react-ssg';
import {
  DEFAULT_OG_IMAGE,
  SITE_URL,
  getDocumentTitle,
  type BlogPostMeta,
} from '@/lib/blog';

interface BlogSeoHeadProps {
  post?: BlogPostMeta;
}

const BLOG_INDEX_TITLE = 'Blog | Staplehire';
const BLOG_INDEX_DESCRIPTION =
  'The Staplehire blog is coming soon. Notes on hiring, technical interviews, and building better recruiting workflows.';

export function BlogSeoHead({ post }: BlogSeoHeadProps) {
  if (!post) {
    const canonical = `${SITE_URL}/blog`;
    return (
      <Head>
        <title>{BLOG_INDEX_TITLE}</title>
        <meta name="description" content={BLOG_INDEX_DESCRIPTION} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={BLOG_INDEX_TITLE} />
        <meta property="og:description" content={BLOG_INDEX_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:site_name" content="Staplehire" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={BLOG_INDEX_TITLE} />
        <meta name="twitter:description" content={BLOG_INDEX_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      </Head>
    );
  }

  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const title = getDocumentTitle(post);
  const image = post.image ? `${SITE_URL}${post.image}` : DEFAULT_OG_IMAGE;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    url: canonical,
    image,
    publisher: {
      '@type': 'Organization',
      name: 'Staplehire',
      url: SITE_URL,
    },
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={post.description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={post.metaTitle ?? post.title} />
      <meta property="og:description" content={post.description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Staplehire" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.metaTitle ?? post.title} />
      <meta name="twitter:description" content={post.description} />
      <meta name="twitter:image" content={image} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}
