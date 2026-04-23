'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { NavCategory } from '@/shared/models/nav_category';
import { NavItemCard, NavItemCardLabels } from './NavItemCard';

type SerializedNavItem = {
  id: string;
  userId: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  url: string;
  thumbnailUrl: string | null;
  pricingModel: string | null;
  discountCode: string | null;
  githubUrl: string | null;
  status: string;
  isFeatured: boolean;
  isAffiliate: boolean;
  categories: string | null;
  createdAt: string;
  updatedAt: string;
};

export function DirectoryLatestSection({
  initialItems,
  initialHasMore,
  locale,
  categories,
}: {
  initialItems: SerializedNavItem[];
  initialHasMore: boolean;
  locale: string;
  categories: NavCategory[];
}) {
  const t = useTranslations('directory.home');
  const tItem = useTranslations('directory.item');
  const tCategory = useTranslations('directory.categories');
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(page);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || loadingRef.current || !hasMoreRef.current) {
          return;
        }

        setLoading(true);
        try {
          const nextPage = pageRef.current + 1;
          const response = await fetch(`/api/directory/latest?page=${nextPage}`);
          const data = await response.json();
          if (data.items) {
            setItems((prev) => [...prev, ...data.items]);
            setPage(nextPage);
            setHasMore(Boolean(data.hasMore));
          }
        } catch (error) {
          console.error('load latest nav items failed:', error);
        } finally {
          setLoading(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) {
    return null;
  }

  const labels: NavItemCardLabels = {
    featured: tItem('featured'),
    badgeNew: tItem('badge_new'),
    badgeDeal: tItem('badge_deal'),
    pricingFree: tItem('pricing_free'),
    pricingPaid: tItem('pricing_paid'),
    categoryLabels: Object.fromEntries(
      categories.map((category) => [
        category.slug,
        tCategory.has?.(category.slug) ? tCategory(category.slug) : category.name,
      ])
    ),
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('latest')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <NavItemCard
            key={item.id}
            item={item}
            locale={locale}
            categories={categories}
            labels={labels}
          />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="py-8 text-center text-sm text-muted-foreground">
          {loading ? t('loading_more') : ''}
        </div>
      )}
    </div>
  );
}
