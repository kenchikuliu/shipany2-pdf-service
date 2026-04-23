'use client';

import { type RefObject, useEffect } from 'react';
import { toast } from 'sonner';

interface CodeBlockEnhancerProps {
  rootRef: RefObject<HTMLElement | null>;
}

const COPY_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const CHECK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

export function CodeBlockEnhancer({ rootRef }: CodeBlockEnhancerProps) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const enhance = () => {
      const blocks = root.querySelectorAll<HTMLElement>('pre');

      blocks.forEach((pre) => {
        if (!pre.parentElement) return;

        if (!pre.parentElement.classList.contains('code-block-wrapper')) {
          const wrapper = document.createElement('div');
          wrapper.className = 'code-block-wrapper';
          pre.parentNode?.insertBefore(wrapper, pre);
          wrapper.appendChild(pre);
        }

        const wrapper = pre.parentElement;
        if (!wrapper) return;

        const code = pre.querySelector('code');
        const language =
          pre.dataset.language ||
          Array.from(code?.classList || [])
            .find((item) => item.startsWith('language-'))
            ?.replace('language-', '');
        if (language && !wrapper.querySelector('.code-language-badge')) {
          const badge = document.createElement('span');
          badge.className = 'code-language-badge';
          badge.textContent = language;
          wrapper.appendChild(badge);
        }

        if (wrapper.querySelector('.copy-button')) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'copy-button';
        button.innerHTML = COPY_ICON;
        button.title = 'Copy code';

        button.addEventListener('click', async () => {
          const code = pre.textContent || '';

          try {
            await navigator.clipboard.writeText(code);
            button.innerHTML = CHECK_ICON;
            toast.success('Code copied to clipboard');
            window.setTimeout(() => {
              button.innerHTML = COPY_ICON;
            }, 2000);
          } catch {
            toast.error('Failed to copy code');
          }
        });

        wrapper.appendChild(button);
      });
    };

    enhance();

    const observer = new MutationObserver(enhance);
    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [rootRef]);

  return null;
}
