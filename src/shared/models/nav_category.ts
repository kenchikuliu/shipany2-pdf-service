import { and, asc, count, desc, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { navCategory } from '@/config/db/schema';
import { withRetry } from '../lib/db-retry';

export type NavCategory = typeof navCategory.$inferSelect;
export type NewNavCategory = typeof navCategory.$inferInsert;
export type UpdateNavCategory = Partial<Omit<NewNavCategory, 'id' | 'createdAt'>>;

export enum NavCategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export async function addNavCategory(data: NewNavCategory) {
  const now = new Date();
  const insertData = {
    ...data,
    updatedAt: data.updatedAt || now,
    createdAt: data.createdAt || now,
  };
  const result = await db().insert(navCategory).values(insertData).returning();
  return result[0];
}

export async function updateNavCategory(id: string, data: UpdateNavCategory) {
  const result = await db()
    .update(navCategory)
    .set(data)
    .where(eq(navCategory.id, id))
    .returning();
  return result[0];
}

export async function deleteNavCategory(id: string) {
  return updateNavCategory(id, { status: NavCategoryStatus.INACTIVE });
}

export async function findNavCategory({ id, slug }: { id?: string; slug?: string }) {
  const conditions: any[] = [];
  if (id) conditions.push(eq(navCategory.id, id));
  if (slug) conditions.push(eq(navCategory.slug, slug));

  if (conditions.length === 0) return null;

  return withRetry(async () => {
    const [result] = await db()
      .select()
      .from(navCategory)
      .where(and(...conditions))
      .limit(1);
    return result;
  });
}

export async function getNavCategories({
  status,
  page = 1,
  limit = 100,
}: {
  status?: NavCategoryStatus;
  page?: number;
  limit?: number;
} = {}): Promise<NavCategory[]> {
  return withRetry(async () => {
    const conditions: any[] = [];
    if (status) conditions.push(eq(navCategory.status, status));

    return db()
      .select()
      .from(navCategory)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(navCategory.sort), desc(navCategory.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
  });
}

export async function getNavCategoriesCount({ status }: { status?: NavCategoryStatus } = {}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(navCategory)
    .where(status ? eq(navCategory.status, status) : undefined)
    .limit(1);
  return result?.count || 0;
}
