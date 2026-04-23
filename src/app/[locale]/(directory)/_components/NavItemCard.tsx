'use client';

import Image from 'next/image';
import { Link } from '@/core/i18n/navigation';
import { NavItem } from '@/shared/models/nav_item';
import { cn, decodeHtmlEntities } from '@/shared/lib/utils';

import { NavCategory } from '@/shared/models/nav_category';

export interface NavItemCardLabels {
  featured: string;
  badgeNew: string;
  badgeDeal: string;
  pricingFree: string;
  pricingPaid: string;
  categoryLabels: Record<string, string>;
}

interface NavItemCardProps {
  item: Omit<NavItem, 'createdAt' | 'updatedAt'> & { createdAt: Date | string; updatedAt: Date | string };
  locale: string;
  fromCategory?: string;
  categories: NavCategory[];
  labels: NavItemCardLabels;
}

const isNewItem = (createdAt: Date | string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(createdAt) > sevenDaysAgo;
};

export function NavItemCard({ item, locale, fromCategory, categories, labels }: NavItemCardProps) {
  const isNew = isNewItem(item.createdAt);
  const detailHref = `/item/${item.slug}${fromCategory ? `?category=${fromCategory}` : ''}`;
  const hasDiscount = !!item.discountCode;
  const itemName = decodeHtmlEntities(item.name);
  const itemTagline = decodeHtmlEntities(item.tagline);

  // Find the active category to display: prioritize 'fromCategory', otherwise use the first one available
  let displayCategory = null;
  try {
    const categoryIds = item.categories ? JSON.parse(item.categories) : [];
    if (fromCategory && categoryIds.length > 0) {
      const categoryFromSource = categories.find((c) => c.slug === fromCategory);
      if (categoryFromSource && categoryIds.includes(categoryFromSource.id)) {
        displayCategory = categoryFromSource;
      }
    }
    if (!displayCategory && categoryIds.length > 0) {
      displayCategory = categories.find(c => c.id === categoryIds[0]);
    }
  } catch (e) {
    // catch JSON parse error
  }

  const displayCategoryLabel = displayCategory
    ? labels.categoryLabels[displayCategory.slug] ?? displayCategory.name
    : null;

  const badge = item.isFeatured
    ? { text: labels.featured, cls: 'bg-amber-500 text-white dark:bg-amber-600' }
    : isNew
      ? { text: labels.badgeNew, cls: 'bg-primary text-primary-foreground' }
      : hasDiscount
        ? { text: labels.badgeDeal, cls: 'bg-green-500 text-white dark:bg-green-600' }
        : null;

  return (
    <div className="relative">
      <Link href={detailHref} title={itemName} className="block h-full">
        <div className="relative pt-3 h-full">
          <div
            className={cn(
              'bg-card rounded-xl shadow-md border border-gray-200 hover:shadow-lg dark:border-gray-800 p-3 transition-all duration-200 relative h-full flex flex-col',
              'hover:-translate-y-0.5'
            )}
          >
            {badge && (
              <span className={cn('text-xs px-2 py-1 rounded-md absolute -top-3 -right-3 z-50', badge.cls)}>
                {badge.text}
              </span>
            )}

            <div className="mb-2 flex-shrink-0">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-card border border-gray-100 dark:border-gray-800 overflow-hidden">
                  {item.logoUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.logoUrl}
                        alt={item.name}
                        fill
                        loading="lazy"
                        sizes="32px"
                        className="rounded-lg object-contain p-0.5"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-white font-bold text-xs">{item.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold line-clamp-1 truncate flex-1 min-w-0">{itemName}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{itemTagline}</p>
            </div>

            <div className="flex-grow" />

            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              {displayCategory ? (
                <div className="flex items-center gap-1">
                  <span className="rounded-full border border-border/70 bg-muted/55 px-2.5 py-1 text-[10px] font-medium tracking-wide text-muted-foreground">
                    {displayCategoryLabel}
                  </span>
                </div>

              ) : (
                <div className="flex items-center gap-1" />

              )}
              {item.pricingModel && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  {item.pricingModel === 'Paid'
                    ? labels.pricingPaid
                    : item.pricingModel === 'Free'
                    ? labels.pricingFree
                    : item.pricingModel}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
