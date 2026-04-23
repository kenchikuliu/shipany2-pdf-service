import Image from 'next/image';
import { Crown, ExternalLink } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Link as I18nLink } from '@/core/i18n/navigation';
import { NavItem } from '@/shared/models/nav_item';
import { NavCategory } from '@/shared/models/nav_category';
import { getNavCategoryLabel } from '@/shared/lib/nav-category-i18n';
import { decodeHtmlEntities, getSafeExternalUrl } from '@/shared/lib/utils';

interface NavFeaturedCardProps {
  item: Omit<NavItem, 'createdAt' | 'updatedAt'> & { createdAt: Date | string; updatedAt: Date | string };
  locale: string;
  fromCategory?: string;
  categories: NavCategory[];
}

export async function NavFeaturedCard({ item, locale, fromCategory, categories }: NavFeaturedCardProps) {
  const t = await getTranslations('directory.item');
  const tCategory = await getTranslations('directory.categories');
  const detailHref = `/item/${item.slug}${fromCategory ? `?category=${fromCategory}` : ''}`;
  const isNew = new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const hasDiscount = !!item.discountCode;
  const itemName = decodeHtmlEntities(item.name);
  const itemTagline = decodeHtmlEntities(item.tagline);
  const externalUrl = getSafeExternalUrl(item.url);

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
    ? getNavCategoryLabel(tCategory, displayCategory)
    : null;

  return (
    <div className="relative group h-full">
      <div className="absolute -inset-[2px] bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-xl opacity-75 blur-[2px] group-hover:opacity-100 group-hover:blur-[4px] transition-all duration-300 dark:from-yellow-600 dark:via-orange-700 dark:to-yellow-600" />

      <div className="relative h-full bg-card dark:bg-zinc-900 rounded-xl flex flex-col overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold tracking-wide dark:from-yellow-600 dark:to-orange-700">
            <Crown className="w-3.5 h-3.5 fill-current" />
            {t('featured')}
          </div>
        </div>

        {/* Stretched link covering the entire card */}
        <I18nLink href={detailHref} className="absolute inset-0 z-0" title={itemName} aria-label={itemName} />

        {/* Thumbnail */}
        <div className="relative w-full h-32 bg-gray-100 dark:bg-zinc-800 overflow-hidden pointer-events-none">
          {item.thumbnailUrl ? (
            <Image
              src={item.thumbnailUrl}
              alt={itemName}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-purple-500/10" />
          )}
        </div>

        <div className="p-4 pt-0 flex-1 flex flex-col pointer-events-none">
          <div className="flex items-start gap-4">
            <div className="-mt-6 relative z-10 flex-shrink-0">
              <div className="relative w-[60px] h-[60px] bg-card dark:bg-zinc-900 rounded-xl shadow-sm flex items-center justify-center p-1">
                {item.logoUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={item.logoUrl}
                      alt={item.name}
                      fill
                      loading="lazy"
                      sizes="60px"
                      className="rounded-lg object-contain border border-gray-100 dark:border-zinc-800 p-1"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-lg flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-600 text-white font-bold text-xl">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-3">
              <h3 className="font-bold text-lg line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-orange-600 transition-all duration-300">
                {itemName}
              </h3>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mt-3 mb-4">
            {itemTagline}
          </p>

          <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-2">
              {displayCategory && (
                <span className="rounded-full border border-orange-500/20 bg-orange-500/8 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-orange-700 dark:border-orange-400/15 dark:bg-orange-400/10 dark:text-orange-200">
                  {displayCategoryLabel}
                </span>
              )}
              {item.pricingModel && item.pricingModel !== 'Free' && (
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-full">
                  {item.pricingModel}
                </span>
              )}
            </div>
            {externalUrl && (
              <Link
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center gap-1.5 rounded-full bg-orange-50 p-1.5 text-xs font-bold text-orange-600 transition-all hover:text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:text-orange-300 pointer-events-auto"
                title={`${t('visit')} ${itemName}`}
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
