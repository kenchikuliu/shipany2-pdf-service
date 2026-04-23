// components/MarkdownPreview.tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import MarkdownIt from 'markdown-it';

import 'github-markdown-css/github-markdown-light.css';
import './markdown.css';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function getTocItems(content: string): TocItem[] {
  if (!content) return [];

  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
      .replace(/(^-|-$)/g, '');

    toc.push({ id, text, level });
  }

  return toc;
}

function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
});

// Custom renderer for headings with IDs
md.renderer.rules.heading_open = function (tokens, idx) {
  const token = tokens[idx];
  const level = token.markup.length;
  const nextToken = tokens[idx + 1];

  if (nextToken && nextToken.type === 'inline') {
    const headingText = nextToken.content;
    const id = generateHeadingId(headingText);
    return `<h${level} id="${id}">`;
  }

  return `<h${level}>`;
};

// Custom renderer for links
md.renderer.rules.link_open = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx];
  const hrefIndex = token.attrIndex('href');

  if (hrefIndex >= 0) {
    const href = token.attrGet('href');

    if (href?.startsWith('#')) {
      const targetIndex = token.attrIndex('target');
      const relIndex = token.attrIndex('rel');
      if (targetIndex >= 0) token.attrs?.splice(targetIndex, 1);
      if (relIndex >= 0) token.attrs?.splice(relIndex, 1);
    } else if (
      href &&
      !href.startsWith('/') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      !href.startsWith('http://') &&
      !href.startsWith('https://')
    ) {
      const targetIndex = token.attrIndex('target');
      const relIndex = token.attrIndex('rel');
      if (targetIndex >= 0) token.attrs?.splice(targetIndex, 1);
      if (relIndex >= 0) token.attrs?.splice(relIndex, 1);
    } else if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      token.attrSet('rel', 'nofollow noopener noreferrer');
      token.attrSet('target', '_blank');
    }
  }

  return renderer.renderToken(tokens, idx, options);
};

interface MarkdownPreviewProps {
  content: string;
}

function resolveInternalDocHref(href: string, pathname: string) {
  if (
    !href ||
    href.startsWith('#') ||
    href.startsWith('/') ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return href;
  }

  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];

  if (!locale) {
    return `/docs/${href.replace(/^\.?\//, '')}`;
  }

  return `/${locale}/docs/${href.replace(/^\.?\//, '')}`;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const html = useMemo(() => {
    return content ? md.render(content) : '';
  }, [content]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const internalHref = resolveInternalDocHref(href, window.location.pathname);
      if (internalHref !== href) {
        link.setAttribute('href', internalHref);
        link.removeAttribute('target');
        link.removeAttribute('rel');
        return;
      }

      if (href.startsWith('#') || href.startsWith('/')) return;

      try {
        if (href.startsWith('http://') || href.startsWith('https://')) {
          const url = new URL(href);
          if (url.hostname === window.location.hostname) {
            link.removeAttribute('target');
            link.removeAttribute('rel');
          }
        }
      } catch {}
    });
  }, [html]);

  return (
    <div ref={containerRef} className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
