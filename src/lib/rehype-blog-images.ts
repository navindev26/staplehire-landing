import type { Root } from 'hast';
import type { Element } from 'hast';
import { visit } from 'unist-util-visit';

function createBannerFigure(img: Element): Element {
  const alt = typeof img.properties?.alt === 'string' ? img.properties.alt : '';

  const figureChildren: Element[] = [
    {
      type: 'element',
      tagName: 'div',
      properties: { className: ['blog-prose-banner'] },
      children: [img],
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
