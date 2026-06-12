interface BlogCoverImageProps {
  src: string;
  alt?: string;
}

export function BlogCoverImage({ src, alt = '' }: BlogCoverImageProps) {
  return (
    <figure className="blog-prose-figure not-prose mb-10 md:mb-12">
      <div className="blog-prose-banner">
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          className="blog-prose-banner__img"
        />
      </div>
      {alt ? <figcaption className="blog-prose-caption">{alt}</figcaption> : null}
    </figure>
  );
}
