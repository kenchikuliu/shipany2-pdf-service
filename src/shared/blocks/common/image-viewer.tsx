'use client';

import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageViewerProps {
  children: React.ReactNode;
  className?: string;
}

interface ViewerImage {
  src: string;
  alt?: string;
}

export function ImageViewer({ children, className }: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<ViewerImage[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncImages = () => {
      const nextImages = Array.from(container.querySelectorAll('img'))
        .map((img) => {
          if (img.loading !== 'lazy') {
            img.loading = 'lazy';
          }

          if (img.decoding !== 'async') {
            img.decoding = 'async';
          }

          return {
          src: img.currentSrc || img.getAttribute('src') || '',
          alt: img.getAttribute('alt') || '',
          };
        })
        .filter((img) => img.src);

      setImages(nextImages);
    };

    syncImages();

    const observer = new MutationObserver(syncImages);
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset', 'alt'],
    });

    const handleClick = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;

      const imgElements = Array.from(container.querySelectorAll('img'));
      const nextIndex = imgElements.indexOf(target);
      if (nextIndex === -1) return;

      event.preventDefault();
      setIndex(nextIndex);
    };

    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
      observer.disconnect();
    };
  }, [children]);

  useEffect(() => {
    if (index === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [index]);

  const currentImage = index === null ? null : images[index];

  const move = (direction: -1 | 1) => {
    if (!images.length || index === null) return;
    setIndex((index + direction + images.length) % images.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIndex(null);
      return;
    }

    if (event.key === 'ArrowLeft') {
      move(-1);
      return;
    }

    if (event.key === 'ArrowRight') {
      move(1);
    }
  };

  return (
    <>
      <div ref={containerRef} className={className}>
        {children}
      </div>
      {currentImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 p-4"
          onClick={() => setIndex(null)}
          onKeyDown={onKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label={currentImage.alt || 'Image viewer'}
          tabIndex={-1}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
            onClick={() => setIndex(null)}
            aria-label="Close image viewer"
          >
            <X className="size-5" />
          </button>
          {images.length > 1 ? (
            <button
              type="button"
              className="absolute left-4 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
              onClick={(event) => {
                event.stopPropagation();
                move(-1);
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </button>
          ) : null}
          <img
            src={currentImage.src}
            alt={currentImage.alt || ''}
            className="max-h-[90vh] max-w-[92vw] rounded-xl bg-white object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
          {images.length > 1 ? (
            <button
              type="button"
              className="absolute right-4 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
              onClick={(event) => {
                event.stopPropagation();
                move(1);
              }}
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
