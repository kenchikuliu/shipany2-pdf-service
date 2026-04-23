const DIRECTORY_SUBMIT_FREE_PRODUCT_ID = 'directory-submit-free';
const DIRECTORY_SUBMIT_PRO_PRODUCT_ID = 'directory-submit-pro';

export function resolveDirectorySubmitCheckoutTarget({
  callbackUrl,
  completionPlan,
  activeOrderCheckoutUrl,
  activeOrderStatus,
}: {
  callbackUrl: string;
  completionPlan?: 'free' | 'pro' | null;
  activeOrderCheckoutUrl?: string | null;
  activeOrderStatus?: string | null;
}) {
  if (completionPlan) {
    return { checkoutUrl: callbackUrl, reused: true as const };
  }

  if (activeOrderStatus === 'created' && activeOrderCheckoutUrl) {
    return { checkoutUrl: activeOrderCheckoutUrl, reused: true as const };
  }

  if (activeOrderStatus === 'pending' || activeOrderStatus === 'created') {
    return { error: 'checkout_in_progress' as const };
  }

  return null;
}

export function getDirectoryFreeSubmitOrderNo(itemId: string) {
  return `directory-free-${itemId}`;
}

export function getDirectoryProSubmitOrderNo(itemId: string) {
  return `directory-pro-${itemId}`;
}

export function escapeSqlLike(value: string) {
  return value.replace(/[\\%_]/g, '\\$&');
}

function extractDirectorySubmitItemIdFromPayload(payload?: string | null) {
  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload);

    if (typeof parsed?.nav_item_id === 'string' && parsed.nav_item_id) {
      return parsed.nav_item_id;
    }

    if (
      typeof parsed?.metadata?.nav_item_id === 'string' &&
      parsed.metadata.nav_item_id
    ) {
      return parsed.metadata.nav_item_id;
    }
  } catch {
    return null;
  }

  return null;
}

export function parseDirectorySubmitItemId(callbackUrl: string) {
  return new URL(callbackUrl, 'https://directory-submit.local').searchParams.get(
    'id'
  );
}

export function extractDirectorySubmitItemId({
  checkoutInfo,
  paymentResult,
  callbackUrl,
}: {
  checkoutInfo?: string | null;
  paymentResult?: string | null;
  callbackUrl?: string | null;
}) {
  const fromCheckoutInfo = extractDirectorySubmitItemIdFromPayload(checkoutInfo);
  if (fromCheckoutInfo) {
    return fromCheckoutInfo;
  }

  const fromPaymentResult = extractDirectorySubmitItemIdFromPayload(paymentResult);
  if (fromPaymentResult) {
    return fromPaymentResult;
  }

  if (!callbackUrl) {
    return null;
  }

  try {
    return parseDirectorySubmitItemId(callbackUrl);
  } catch {
    return null;
  }
}

export function getDirectorySubmitCompletionPlan(productId?: string | null) {
  if (productId === DIRECTORY_SUBMIT_PRO_PRODUCT_ID) {
    return 'pro' as const;
  }

  if (productId === DIRECTORY_SUBMIT_FREE_PRODUCT_ID) {
    return 'free' as const;
  }

  return null;
}

export function getDirectorySubmitOrderSearchPatterns(itemId: string) {
  const escapedItemId = escapeSqlLike(itemId);

  return {
    checkoutInfo: `%\"nav_item_id\":\"${escapedItemId}\"%`,
    paymentResult: `%\"nav_item_id\":\"${escapedItemId}\"%`,
    callbackUrl: `%id=${escapedItemId}%`,
  };
}
