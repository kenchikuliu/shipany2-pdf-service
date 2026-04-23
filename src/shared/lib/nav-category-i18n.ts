type CategoryTranslationFn = {
  (key: string): string;
  has?: (key: string) => boolean;
};

type NavCategoryLike = {
  slug: string;
  name: string;
};

export function getNavCategoryLabel(
  tCategory: CategoryTranslationFn,
  category: NavCategoryLike
) {
  if (category.slug && tCategory.has?.(category.slug)) {
    return tCategory(category.slug);
  }

  return category.name;
}
