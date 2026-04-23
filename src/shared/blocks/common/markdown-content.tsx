'use client';

import { useEffect, useMemo, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import GithubSlugger from 'github-slugger';
import hljs from 'highlight.js';

import { CodeBlockEnhancer } from './code-block-enhancer';
import { ImageViewer } from './image-viewer';
import { markdownItCjkRelax } from '@/shared/utils/markdown-it-cjk-relax';

import 'highlight.js/styles/github.css';
import './markdown.css';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  highlight: (str: string, lang: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre data-language="${lang}"><code class="hljs language-${lang}">${hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value}</code></pre>`;
      } catch {}
    }

    try {
      const result = hljs.highlightAuto(str);
      return `<pre><code class="hljs">${result.value}</code></pre>`;
    } catch {}

    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
  },
}).use(markdownItCjkRelax);

md.renderer.rules.heading_open = function (tokens, idx) {
  const token = tokens[idx];
  const level = token.markup.length;
  const nextToken = tokens[idx + 1];
  const slugger = (tokens as any).__slugger || ((tokens as any).__slugger = new GithubSlugger());

  if (nextToken && nextToken.type === 'inline') {
    const headingText = nextToken.content;
    const id = slugger.slug(headingText);
    return `<h${level} id="${id}">`;
  }

  return `<h${level}>`;
};

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

md.renderer.rules.table_open = function () {
  return '<div class="table-wrapper"><table>';
};

md.renderer.rules.table_close = function () {
  return '</table></div>';
};

interface MarkdownContentProps {
  content: string;
  id?: string;
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

export function MarkdownContent({ content, id = 'markdown-content' }: MarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const html = useMemo(() => (content ? md.render(content) : ''), [content]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tables = container.querySelectorAll('table');
    tables.forEach((table) => {
      if (table.parentElement?.getAttribute('data-slot') === 'table-wrapper') {
        return;
      }

      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-slot', 'table-wrapper');
      wrapper.className = 'w-full overflow-x-auto';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

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
  }, [content, html]);

  return (
    <ImageViewer>
      <CodeBlockEnhancer rootRef={containerRef} />
      <div
        ref={containerRef}
        id={id}
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </ImageViewer>
  );
}
