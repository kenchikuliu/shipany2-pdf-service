import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const htmlEntityMap: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

export function decodeHtmlEntities(value?: string | null) {
  if (!value || !value.includes('&')) {
    return value || '';
  }

  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (entity, code) => {
    if (code[0] === '#') {
      const isHex = code[1]?.toLowerCase() === 'x';
      const point = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);

      if (!Number.isNaN(point)) {
        return String.fromCodePoint(point);
      }

      return entity;
    }

    return htmlEntityMap[code] ?? entity;
  });
}

export function getSafeExternalUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value.trim());

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }

    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

export function normalizeExternalUrl(value: string) {
  const normalized = getSafeExternalUrl(value);
  if (!normalized) {
    throw new Error('Invalid external URL');
  }

  return normalized;
}
