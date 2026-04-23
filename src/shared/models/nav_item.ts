import { and, count, desc, eq, inArray, notInArray, like, ilike, or, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { navItem } from '@/config/db/schema';
import { withRetry } from '../lib/db-retry';

export type NavItem = typeof navItem.$inferSelect;
export type NewNavItem = typeof navItem.$inferInsert;
export type UpdateNavItem = Partial<Omit<NewNavItem, 'id' | 'createdAt'>>;
type NavItemSearchField = 'name' | 'tagline' | 'description';

export enum NavItemStatus {
  DRAFT = 'draft',
  LIVE = 'live',
  PENDING_REVIEW = 'pending_review',
  REJECTED = 'rejected',
}

export async function addNavItem(data: NewNavItem) {
  const now = new Date();
  const insertData = {
    ...data,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
  return withRetry(async () => {
    const result = await db().insert(navItem).values(insertData).returning();
    return result[0];
  });
}

export async function updateNavItem(id: string, data: UpdateNavItem) {
  return withRetry(async () => {
    const result = await db()
      .update(navItem)
      .set(data)
      .where(eq(navItem.id, id))
      .returning();
    return result[0];
  });
}

export async function deleteNavItem(id: string) {
  return updateNavItem(id, { status: NavItemStatus.REJECTED });
}

export async function findNavItem({ id, slug }: { id?: string; slug?: string }) {
  const conditions: any[] = [];
  if (id) conditions.push(eq(navItem.id, id));
  if (slug) conditions.push(eq(navItem.slug, slug));

  if (conditions.length === 0) return null;

  return withRetry(async () => {
    const [result] = await db()
      .select()
      .from(navItem)
      .where(and(...conditions))
      .limit(1);
    return result;
  });
}

export async function findNavItemByUserAndUrl({
  userId,
  url,
  statuses,
}: {
  userId: string;
  url: string;
  statuses?: NavItemStatus[];
}) {
  const conditions: any[] = [eq(navItem.userId, userId), eq(navItem.url, url)];

  if (statuses?.length) {
    conditions.push(inArray(navItem.status, statuses));
  }

  return withRetry(async () => {
    const [result] = await db()
      .select()
      .from(navItem)
      .where(and(...conditions))
      .orderBy(desc(navItem.createdAt))
      .limit(1);
    return result;
  });
}

export async function getNavItems({
  status,
  categoryId,
  isFeatured,
  isAffiliate,
  page = 1,
  limit = 48,
  excludeId,
  query,
  queryFields = ['name', 'tagline', 'description'],
}: {
  status?: NavItemStatus | NavItemStatus[];
  categoryId?: string;
  isFeatured?: boolean;
  isAffiliate?: boolean;
  page?: number;
  limit?: number;
  excludeId?: string;
  query?: string;
  queryFields?: NavItemSearchField[];
} = {}): Promise<NavItem[]> {
  const conditions: any[] = [];
  
  if (excludeId) {
    conditions.push(sql`${navItem.id} != ${excludeId}`);
  }

  if (status) {
    if (Array.isArray(status)) {
      conditions.push(inArray(navItem.status, status));
    } else {
      conditions.push(eq(navItem.status, status));
    }
  }

  if (isFeatured !== undefined) {
    conditions.push(eq(navItem.isFeatured, isFeatured));
  }

  if (isAffiliate !== undefined) {
    conditions.push(eq(navItem.isAffiliate, isAffiliate));
  }

  if (categoryId) {
    conditions.push(like(navItem.categories, `%"${categoryId}"%`));
  }

  if (query && query.trim()) {
    const searchPattern = `%${query.trim().toLowerCase()}%`;
    const searchConditions = [];

    if (queryFields.includes('name')) {
      searchConditions.push(like(sql`lower(${navItem.name})`, searchPattern));
    }
    if (queryFields.includes('tagline')) {
      searchConditions.push(like(sql`lower(coalesce(${navItem.tagline}, ''))`, searchPattern));
    }
    if (queryFields.includes('description')) {
      searchConditions.push(like(sql`lower(coalesce(${navItem.description}, ''))`, searchPattern));
    }

    if (searchConditions.length > 0) {
      conditions.push(or(...searchConditions));
    }
  }

  return withRetry(async () => {
    return db()
      .select()
      .from(navItem)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(navItem.isFeatured), desc(navItem.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
  });
}

export async function getNavItemsCount({
  status,
  categoryId,
  isFeatured,
  isAffiliate,
  query,
  queryFields = ['name', 'tagline', 'description'],
}: {
  status?: NavItemStatus;
  categoryId?: string;
  isFeatured?: boolean;
  isAffiliate?: boolean;
  query?: string;
  queryFields?: NavItemSearchField[];
} = {}): Promise<number> {
  const conditions: any[] = [];
  if (status) conditions.push(eq(navItem.status, status));
  if (isFeatured !== undefined) conditions.push(eq(navItem.isFeatured, isFeatured));
  if (isAffiliate !== undefined) conditions.push(eq(navItem.isAffiliate, isAffiliate));
  if (categoryId) conditions.push(like(navItem.categories, `%"${categoryId}"%`));

  if (query && query.trim()) {
    const searchPattern = `%${query.trim().toLowerCase()}%`;
    const searchConditions = [];

    if (queryFields.includes('name')) {
      searchConditions.push(like(sql`lower(${navItem.name})`, searchPattern));
    }
    if (queryFields.includes('tagline')) {
      searchConditions.push(like(sql`lower(coalesce(${navItem.tagline}, ''))`, searchPattern));
    }
    if (queryFields.includes('description')) {
      searchConditions.push(like(sql`lower(coalesce(${navItem.description}, ''))`, searchPattern));
    }

    if (searchConditions.length > 0) {
      conditions.push(or(...searchConditions));
    }
  }

  return withRetry(async () => {
    const [result] = await db()
      .select({ count: count() })
      .from(navItem)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(1);
    return result?.count || 0;
  });
}

export async function searchNavItems({
  query,
  categoryId,
  status,
  page = 1,
  limit = 24,
}: {
  query?: string;
  categoryId?: string;
  status?: NavItemStatus;
  page?: number;
  limit?: number;
}): Promise<{ items: NavItem[]; total: number }> {
  const conditions: any[] = [];

  if (status) conditions.push(eq(navItem.status, status));
  if (categoryId) conditions.push(like(navItem.categories, `%"${categoryId}"%`));

  if (query && query.trim()) {
    const searchPattern = `%${query.trim().toLowerCase()}%`;
    conditions.push(
      or(
        like(sql`lower(${navItem.name})`, searchPattern),
        like(sql`lower(coalesce(${navItem.tagline}, ''))`, searchPattern),
        like(sql`lower(coalesce(${navItem.description}, ''))`, searchPattern)
      )
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, [countResult]] = await Promise.all([
    db()
      .select()
      .from(navItem)
      .where(where)
      .orderBy(desc(navItem.isFeatured), desc(navItem.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),
    db().select({ count: count() }).from(navItem).where(where),
  ]);

  return { items, total: countResult?.count || 0 };
}
export async function getRecommendedNavItems({
  item,
  limit = 5,
  excludeIds = [],
  categoryId,
}: {
  item: NavItem;
  limit?: number;
  excludeIds?: string[];
  categoryId?: string;
}): Promise<NavItem[]> {
  let categoryIds: string[] = [];
  try {
    categoryIds = item.categories ? JSON.parse(item.categories) : [];
  } catch (e) {
    categoryIds = [];
  }
  const matchedCategoryIds =
    categoryId && categoryIds.includes(categoryId) ? [categoryId] : categoryIds;
  
  const baseConditions = [
    eq(navItem.status, NavItemStatus.LIVE),
    sql`${navItem.id} != ${item.id}`
  ];

  if (excludeIds.length > 0) {
    baseConditions.push(notInArray(navItem.id, excludeIds));
  }

  if (matchedCategoryIds.length === 0) {
    return withRetry(() =>
      db()
        .select()
        .from(navItem)
        .where(and(...baseConditions, eq(navItem.isFeatured, true)))
        .orderBy(desc(navItem.createdAt))
        .limit(limit)
    );
  }

  return withRetry(async () => {
    const categoryConditions = matchedCategoryIds.map((id: string) =>
      like(navItem.categories, `%"${id}"%`)
    );

    return db()
      .select()
      .from(navItem)
      .where(
        and(
          ...baseConditions,
          categoryConditions.length > 0 ? or(...categoryConditions) : undefined
        )
      )
      .orderBy(desc(navItem.isFeatured), desc(navItem.createdAt))
      .limit(limit);
  });
}
