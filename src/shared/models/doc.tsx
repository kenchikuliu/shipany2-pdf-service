import React from 'react';
import {
  and,
  asc,
  count,
  eq,
  isNull,
  ne,
  sql,
} from 'drizzle-orm';

import { db } from '@/core/db';
import { generateTOC } from '@/core/docs/toc';
import { doc } from '@/config/db/schema';
import { locales } from '@/config/locale';
import { MarkdownContent } from '@/shared/blocks/common/markdown-content';

export type Doc = typeof doc.$inferSelect;
export type NewDoc = typeof doc.$inferInsert;
export type UpdateDoc = Partial<Omit<NewDoc, 'id' | 'createdAt'>>;

export enum DocStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

export interface DocTreeNode {
  id: string;
  slug: string;
  path: string;
  title: string;
  description?: string;
  icon?: string;
  level: number;
  sort: number;
  children?: DocTreeNode[];
  hasChildren: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocWithContent extends Doc {
  body?: React.ReactNode;
  toc?: ReturnType<typeof generateTOC>;
}

function getDocLocaleCandidates(locale = 'en') {
  const normalized = locales.includes(locale) ? locale : 'en';
  return [normalized, ...locales.filter((item) => item !== normalized)];
}

function isMissingDocTableError(error: unknown) {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  return (
    message.includes('relation "doc" does not exist') ||
    message.includes('no such table: doc') ||
    message.includes("table 'doc' doesn't exist") ||
    message.includes('table "doc" does not exist')
  );
}

function buildDocSearchCondition(search?: string) {
  if (!search) return undefined;

  const query = `%${search.toLowerCase()}%`;
  return sql`(
    lower(coalesce(${doc.title}, '')) like ${query}
    or lower(coalesce(${doc.description}, '')) like ${query}
    or lower(coalesce(${doc.content}, '')) like ${query}
  )`;
}

export async function addDoc(data: NewDoc) {
  try {
    const now = new Date();
    const insertData = {
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
    };
    const [result] = await db().insert(doc).values(insertData).returning();
    return result;
  } catch (error) {
    if (isMissingDocTableError(error)) {
      throw new Error('doc table missing, please run database migration first');
    }
    throw error;
  }
}

export async function updateDoc(id: string, data: UpdateDoc) {
  try {
    const [result] = await db()
      .update(doc)
      .set(data)
      .where(eq(doc.id, id))
      .returning();
    return result;
  } catch (error) {
    if (isMissingDocTableError(error)) {
      throw new Error('doc table missing, please run database migration first');
    }
    throw error;
  }
}

export async function deleteDoc(id: string) {
  return updateDoc(id, {
    status: DocStatus.ARCHIVED,
    deletedAt: new Date(),
  });
}

export async function findDoc({
  id,
  path,
  slug,
  locale,
  status,
}: {
  id?: string;
  path?: string;
  slug?: string;
  locale?: string;
  status?: DocStatus;
}) {
  try {
    const [result] = await db()
      .select()
      .from(doc)
      .where(
        and(
          id ? eq(doc.id, id) : undefined,
          path ? eq(doc.path, path) : undefined,
          slug ? eq(doc.slug, slug) : undefined,
          locale ? eq(doc.locale, locale) : undefined,
          status ? eq(doc.status, status) : undefined
        )
      )
      .limit(1);

    return result;
  } catch (error) {
    if (isMissingDocTableError(error)) {
      return undefined;
    }
    throw error;
  }
}

export async function getDocs({
  locale,
  status,
  parentId,
  level,
  page = 1,
  limit = 100,
  search,
}: {
  locale?: string;
  status?: DocStatus;
  parentId?: string | null;
  level?: number;
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<Doc[]> {
  try {
    return await db()
      .select()
      .from(doc)
      .where(
        and(
          locale ? eq(doc.locale, locale) : undefined,
          status ? eq(doc.status, status) : ne(doc.status, DocStatus.ARCHIVED),
          parentId !== undefined
            ? parentId === null
              ? isNull(doc.parentId)
              : eq(doc.parentId, parentId)
            : undefined,
          level !== undefined ? eq(doc.level, level) : undefined,
          buildDocSearchCondition(search)
        )
      )
      .orderBy(asc(doc.level), asc(doc.sort), asc(doc.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
  } catch (error) {
    if (isMissingDocTableError(error)) {
      return [];
    }
    throw error;
  }
}

export async function getDocsCount({
  locale,
  status,
  parentId,
  level,
  search,
}: {
  locale?: string;
  status?: DocStatus;
  parentId?: string | null;
  level?: number;
  search?: string;
} = {}): Promise<number> {
  try {
    const [result] = await db()
      .select({ count: count() })
      .from(doc)
      .where(
        and(
          locale ? eq(doc.locale, locale) : undefined,
          status ? eq(doc.status, status) : ne(doc.status, DocStatus.ARCHIVED),
          parentId !== undefined
            ? parentId === null
              ? isNull(doc.parentId)
              : eq(doc.parentId, parentId)
            : undefined,
          level !== undefined ? eq(doc.level, level) : undefined,
          buildDocSearchCondition(search)
        )
      )
      .limit(1);

    return result?.count || 0;
  } catch (error) {
    if (isMissingDocTableError(error)) {
      return 0;
    }
    throw error;
  }
}

export async function buildDocTree({
  locale = 'en',
  status = DocStatus.PUBLISHED,
}: {
  locale?: string;
  status?: DocStatus;
} = {}): Promise<DocTreeNode[]> {
  const localeCandidates = getDocLocaleCandidates(locale);
  const docMap = new Map<string, Doc>();

  for (const candidate of localeCandidates) {
    const docs = await getDocs({ locale: candidate, status, limit: 1000 });
    for (const item of docs) {
      if (!docMap.has(item.path)) {
        docMap.set(item.path, item);
      }
    }
  }

  const allDocs = Array.from(docMap.values()).sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    if (a.sort !== b.sort) return a.sort - b.sort;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  const childrenMap = new Map<string, Doc[]>();

  for (const item of allDocs) {
    const parentKey = item.parentId || 'root';
    const group = childrenMap.get(parentKey) || [];
    group.push(item);
    childrenMap.set(parentKey, group);
  }

  const buildNode = (item: Doc): DocTreeNode => {
    const children = childrenMap.get(item.id) || [];

    return {
      id: item.id,
      slug: item.slug,
      path: item.path,
      title: item.title,
      description: item.description || undefined,
      icon: item.icon || undefined,
      level: item.level,
      sort: item.sort,
      hasChildren: children.length > 0,
      children: children.length > 0 ? children.map(buildNode) : undefined,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  };

  return (childrenMap.get('root') || []).map(buildNode);
}

export async function getDoc({
  path,
  locale = 'en',
}: {
  path: string;
  locale?: string;
}): Promise<DocWithContent | null> {
  let docData: Doc | undefined;

  for (const candidate of getDocLocaleCandidates(locale)) {
    docData = await findDoc({
      path,
      locale: candidate,
      status: DocStatus.PUBLISHED,
    });

    if (docData) {
      break;
    }
  }

  if (!docData) return null;

  const content = docData.content || '';

  return {
    ...docData,
    body: content ? <MarkdownContent content={content} /> : undefined,
    toc: content ? generateTOC(content) : undefined,
  };
}

export async function getFirstDocPath(locale: string = 'en'): Promise<string | null> {
  const tree = await buildDocTree({ locale });
  if (tree.length === 0) return null;

  const first = tree[0];
  if (first.hasChildren && first.children && first.children.length > 0) {
    return first.children[0].path;
  }

  return first.path;
}

export function generateDocPath(parentPath: string | null, slug: string): string {
  if (!parentPath || parentPath === '/') {
    return `/${slug}`;
  }

  return `${parentPath}/${slug}`;
}

export function convertToPageTree(nodes: DocTreeNode[], locale: string = 'en'): any[] {
  return nodes.map((node) => {
    const item: any = {
      type: node.hasChildren ? 'folder' : 'page',
      name: node.title,
      url: node.hasChildren ? undefined : `/${locale}/docs${node.path}`,
      icon: node.icon || undefined,
    };

    if (node.children && node.children.length > 0) {
      item.children = convertToPageTree(node.children, locale);
    }

    return item;
  });
}

export async function getMergedDocTree({
  locale = 'en',
}: {
  locale?: string;
} = {}): Promise<any[]> {
  const dbTree = await buildDocTree({ locale });
  return convertToPageTree(dbTree, locale);
}
