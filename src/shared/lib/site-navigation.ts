import { getNavCategoryLabel } from '@/shared/lib/nav-category-i18n';
import { NavCategory } from '@/shared/models/nav_category';
import { Brand, NavItem } from '@/shared/types/blocks/common';
import { Footer, Header } from '@/shared/types/blocks/landing';

type TranslationFn = {
  (key: string): string;
};

export function buildSiteHeader(
  header: Header,
  options: {
    brand?: Brand;
    tDirectory: TranslationFn;
    tBlog: TranslationFn;
  }
): Header {
  return {
    ...header,
    brand: options.brand || header.brand,
    nav: {
      ...(header.nav || { items: [] }),
      items: [
        {
          title: options.tDirectory('layout.sidebar.special_links.all'),
          url: '/',
          icon: 'House',
        },
        {
          title: options.tDirectory('layout.sidebar.quick_links.search'),
          url: '/search',
          icon: 'Search',
        },
        {
          title: options.tDirectory('layout.sidebar.quick_links.explore'),
          url: '/explore',
          icon: 'Compass',
        },
        {
          title: options.tDirectory('layout.sidebar.quick_links.submit'),
          url: '/submit',
          icon: 'Plus',
        },
        {
          title: options.tBlog('metadata.title'),
          url: '/blog',
          icon: 'Newspaper',
        },
      ],
    },
    topbanner: undefined,
  };
}

export function buildSiteFooter(
  footer: Footer,
  options: {
    categories: NavCategory[];
    tDirectory: TranslationFn & { has?: (key: string) => boolean };
  }
): Footer {
  const featuredCategories = options.categories.slice(0, 3).map((category) => ({
    title: getNavCategoryLabel(options.tDirectory, category),
    url: `/categories/${category.slug}`,
    target: '_self',
  }));

  const navItems = [...(footer.nav?.items || [])];
  const aboutColumn = navItems[0];
  const resourcesColumn = navItems[1];

  if (aboutColumn) {
    navItems[0] = {
      ...aboutColumn,
      title: options.tDirectory('layout.sidebar.categories_title'),
      children: featuredCategories,
    };
  }

  if (resourcesColumn) {
    navItems[1] = {
      ...resourcesColumn,
      children: (resourcesColumn.children || []).filter(
        (item: NavItem) => item.url !== '/chat'
      ),
    };
  }

  return {
    ...footer,
    nav: footer.nav
      ? {
          ...footer.nav,
          items: navItems,
        }
      : footer.nav,
  };
}
