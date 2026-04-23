export type DirectorySubmitCompletionPlan = 'free' | 'pro';
export type DirectorySubmitItemStatus =
  | 'draft'
  | 'pending_review'
  | 'live'
  | 'rejected';

export function getDirectorySubmitStepUrl({
  locale,
  step,
  itemId,
  plan,
}: {
  locale: string;
  step: 1 | 2 | 3;
  itemId?: string;
  plan?: DirectorySubmitCompletionPlan;
}) {
  const params = new URLSearchParams({ step: String(step) });

  if (itemId) {
    params.set('id', itemId);
  }

  if (plan) {
    params.set('plan', plan);
  }

  return `/${locale}/submit?${params.toString()}`;
}

export function resolveDirectorySubmitRedirect({
  activeStep,
  locale,
  itemId,
  itemOwnerId,
  itemStatus,
  currentUserId,
  completionPlan,
}: {
  activeStep: number;
  locale: string;
  itemId?: string;
  itemOwnerId?: string | null;
  itemStatus?: DirectorySubmitItemStatus | null;
  currentUserId: string;
  completionPlan?: DirectorySubmitCompletionPlan | null;
}) {
  const isOwnedItem = !!itemId && !!itemOwnerId && itemOwnerId === currentUserId;

  if (activeStep === 1) {
    return null;
  }

  if (!isOwnedItem) {
    return getDirectorySubmitStepUrl({ locale, step: 1 });
  }

  if (itemStatus === 'rejected' && !completionPlan) {
    return getDirectorySubmitStepUrl({ locale, step: 1 });
  }

  if (activeStep === 2 && completionPlan) {
    return getDirectorySubmitStepUrl({
      locale,
      step: 3,
      itemId,
      plan: completionPlan,
    });
  }

  if (activeStep === 3 && !completionPlan) {
    return getDirectorySubmitStepUrl({ locale, step: 2, itemId });
  }

  return null;
}

export function isNavItemReviewable(status: string) {
  return status === 'pending_review';
}

export function getNextDirectorySubmitStatus(status: string) {
  if (status === 'draft') {
    return 'pending_review' as const;
  }

  if (status === 'pending_review' || status === 'live') {
    return status;
  }

  return null;
}

export function getDirectorySubmitPaidItemUpdate(status: string) {
  if (status === 'draft') {
    return {
      isFeatured: true,
      status: 'pending_review' as const,
    };
  }

  if (status === 'pending_review' || status === 'live') {
    return {
      isFeatured: true,
      status,
    };
  }

  return null;
}
