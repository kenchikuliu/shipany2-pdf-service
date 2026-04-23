import { lookup } from 'node:dns/promises';

function isIpv4(hostname: string) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
}

function isPrivateIpv4(hostname: string) {
  if (!isIpv4(hostname)) {
    return false;
  }

  const parts = hostname.split('.').map((part) => Number.parseInt(part, 10));
  if (parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return true;
  }

  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

function isLocalHostname(hostname: string) {
  const normalized = hostname.trim().toLowerCase();

  return (
    normalized === 'localhost' ||
    normalized.endsWith('.localhost') ||
    normalized.endsWith('.local') ||
    normalized.endsWith('.internal')
  );
}

function isPrivateIpv6(hostname: string) {
  const normalized = hostname.trim().toLowerCase();

  return (
    normalized === '::1' ||
    normalized === '::' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80:') ||
    normalized.startsWith('::ffff:127.') ||
    normalized.startsWith('::ffff:10.') ||
    normalized.startsWith('::ffff:192.168.') ||
    /^::ffff:172\.(1[6-9]|2\d|3[0-1])\./.test(normalized) ||
    /^::ffff:169\.254\./.test(normalized) ||
    /^::ffff:100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(normalized)
  );
}

function isPrivateIpAddress(address: string) {
  return isPrivateIpv4(address) || isPrivateIpv6(address);
}

export function getSafeProxyTarget(raw?: string | null) {
  if (!raw) {
    return null;
  }

  try {
    const url = new URL(raw.trim());

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }

    if (url.username || url.password) {
      return null;
    }

    if (url.port && url.port !== '80' && url.port !== '443') {
      return null;
    }

    const hostname = url.hostname.trim().toLowerCase();
    if (!hostname || isLocalHostname(hostname) || isPrivateIpv4(hostname)) {
      return null;
    }

    if (hostname.includes(':')) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

export async function isSafeResolvedProxyTarget(url: URL) {
  const hostname = url.hostname.trim().toLowerCase();
  if (!hostname) {
    return false;
  }

  if (isPrivateIpAddress(hostname) || isLocalHostname(hostname)) {
    return false;
  }

  try {
    const records = await lookup(hostname, { all: true, verbatim: true });
    if (!records.length) {
      return false;
    }

    return records.every((record) => !isPrivateIpAddress(record.address));
  } catch {
    return false;
  }
}

export function isAllowedProxiedContentType(contentType?: string | null) {
  if (!contentType) {
    return false;
  }

  const normalized = contentType.toLowerCase();

  return (
    normalized.startsWith('image/') ||
    normalized.startsWith('audio/') ||
    normalized.startsWith('video/')
  );
}
