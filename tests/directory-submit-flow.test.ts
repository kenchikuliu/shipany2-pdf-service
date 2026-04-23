import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getDirectorySubmitPaidItemUpdate,
  getDirectorySubmitStepUrl,
  getNextDirectorySubmitStatus,
  isNavItemReviewable,
  resolveDirectorySubmitRedirect,
} from '../src/app/[locale]/(directory)/submit/flow';

test('getDirectorySubmitStepUrl builds expected submit URLs', () => {
  assert.equal(
    getDirectorySubmitStepUrl({ locale: 'en', step: 1 }),
    '/en/submit?step=1'
  );
  assert.equal(
    getDirectorySubmitStepUrl({
      locale: 'zh',
      step: 3,
      itemId: 'item_1',
      plan: 'pro',
    }),
    '/zh/submit?step=3&id=item_1&plan=pro'
  );
});

test('resolveDirectorySubmitRedirect rejects step 2 access without owned item', () => {
  assert.equal(
    resolveDirectorySubmitRedirect({
      activeStep: 2,
      locale: 'en',
      itemId: 'item_1',
      itemOwnerId: 'user_b',
      currentUserId: 'user_a',
    }),
    '/en/submit?step=1'
  );
});

test('resolveDirectorySubmitRedirect rejects step 3 access without completion', () => {
  assert.equal(
    resolveDirectorySubmitRedirect({
      activeStep: 3,
      locale: 'en',
      itemId: 'item_1',
      itemOwnerId: 'user_a',
      currentUserId: 'user_a',
      completionPlan: null,
    }),
    '/en/submit?step=2&id=item_1'
  );
});

test('resolveDirectorySubmitRedirect rejects rejected items before completion', () => {
  assert.equal(
    resolveDirectorySubmitRedirect({
      activeStep: 2,
      locale: 'en',
      itemId: 'item_1',
      itemOwnerId: 'user_a',
      itemStatus: 'rejected',
      currentUserId: 'user_a',
    }),
    '/en/submit?step=1'
  );
});

test('resolveDirectorySubmitRedirect upgrades completed step 2 visits to step 3', () => {
  assert.equal(
    resolveDirectorySubmitRedirect({
      activeStep: 2,
      locale: 'en',
      itemId: 'item_1',
      itemOwnerId: 'user_a',
      currentUserId: 'user_a',
      completionPlan: 'free',
    }),
    '/en/submit?step=3&id=item_1&plan=free'
  );
});

test('resolveDirectorySubmitRedirect allows owned in-progress step 2 and completed step 3', () => {
  assert.equal(
    resolveDirectorySubmitRedirect({
      activeStep: 2,
      locale: 'en',
      itemId: 'item_1',
      itemOwnerId: 'user_a',
      currentUserId: 'user_a',
    }),
    null
  );
  assert.equal(
    resolveDirectorySubmitRedirect({
      activeStep: 3,
      locale: 'en',
      itemId: 'item_1',
      itemOwnerId: 'user_a',
      currentUserId: 'user_a',
      completionPlan: 'pro',
    }),
    null
  );
});

test('isNavItemReviewable only accepts pending review status', () => {
  assert.equal(isNavItemReviewable('pending_review'), true);
  assert.equal(isNavItemReviewable('live'), false);
  assert.equal(isNavItemReviewable('rejected'), false);
});

test('getNextDirectorySubmitStatus only allows resumable submit states', () => {
  assert.equal(getNextDirectorySubmitStatus('draft'), 'pending_review');
  assert.equal(getNextDirectorySubmitStatus('pending_review'), 'pending_review');
  assert.equal(getNextDirectorySubmitStatus('live'), 'live');
  assert.equal(getNextDirectorySubmitStatus('rejected'), null);
});

test('getDirectorySubmitPaidItemUpdate blocks rejected items and preserves valid states', () => {
  assert.deepEqual(getDirectorySubmitPaidItemUpdate('draft'), {
    isFeatured: true,
    status: 'pending_review',
  });
  assert.deepEqual(getDirectorySubmitPaidItemUpdate('live'), {
    isFeatured: true,
    status: 'live',
  });
  assert.equal(getDirectorySubmitPaidItemUpdate('rejected'), null);
});
