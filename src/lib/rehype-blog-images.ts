import type { Root } from 'hast';
import type { Element } from 'hast';
import { visit } from 'unist-util-visit';

/** Light-mode asset → dark-mode variant (class-based `.dark` on html). */
const THEME_IMAGE_PAIRS: Record<string, string> = {
  '/landing/research-flow.gif': '/landing/research-flow-dark.gif',
};

function themedImg(src: string, alt: string, visibilityClass: string): Element {
  return {
    type: 'element',
    tagName: 'img',
    properties: {
      src,
      alt,
      className: ['blog-prose-banner__img', visibilityClass],
      loading: 'lazy',
      decoding: 'async',
    },
    children: [],
  };
}

function createBannerFigure(img: Element): Element {
  const alt = typeof img.properties?.alt === 'string' ? img.properties.alt : '';
  const src = typeof img.properties?.src === 'string' ? img.properties.src : '';
  const darkSrc = THEME_IMAGE_PAIRS[src];

  const bannerChildren: Element[] = darkSrc
    ? [
        themedImg(src, alt, 'dark:hidden'),
        themedImg(darkSrc, alt, 'hidden dark:block'),
      ]
    : [
        {
          ...img,
          properties: {
            ...img.properties,
            className: ['blog-prose-banner__img'],
            loading: 'lazy',
            decoding: 'async',
          },
        },
      ];

  const figureChildren: Element[] = [
    {
      type: 'element',
      tagName: 'div',
      properties: { className: ['blog-prose-banner'] },
      children: bannerChildren,
    },
  ];

  if (alt) {
    figureChildren.push({
      type: 'element',
      tagName: 'figcaption',
      properties: { className: ['blog-prose-caption'] },
      children: [{ type: 'text', value: alt }],
    });
  }

  return {
    type: 'element',
    tagName: 'figure',
    properties: { className: ['blog-prose-figure'] },
    children: figureChildren,
  };
}

export function rehypeBlogImages() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return;

      // Markdown images are often wrapped in a lone <p>
      if (
        node.tagName === 'p' &&
        node.children?.length === 1 &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'img'
      ) {
        parent.children[index] = createBannerFigure(node.children[0] as Element);
        return;
      }

      if (node.tagName === 'img') {
        parent.children[index] = createBannerFigure(node);
      }
    });
  };
}
