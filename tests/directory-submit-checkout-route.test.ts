import test from 'node:test';
import assert from 'node:assert/strict';

import { OrderStatus } from '../src/shared/models/order';
import { resolveDirectorySubmitCheckoutTarget } from '../src/app/[locale]/(directory)/submit/order-helpers';

test('resolveDirectorySubmitCheckoutTarget reuses success page when already completed', () => {
  assert.deepEqual(
    resolveDirectorySubmitCheckoutTarget({
      callbackUrl: '/en/submit?step=3&id=item_1',
      completionPlan: 'pro',
    }),
    {
      checkoutUrl: '/en/submit?step=3&id=item_1',
      reused: true,
    }
  );
});

test('resolveDirectorySubmitCheckoutTarget reuses existing created checkout url', () => {
  assert.deepEqual(
    resolveDirectorySubmitCheckoutTarget({
      callbackUrl: '/en/submit?step=3&id=item_1',
      activeOrderCheckoutUrl: 'https://pay.example/checkout/123',
      activeOrderStatus: OrderStatus.CREATED,
    }),
    {
      checkoutUrl: 'https://pay.example/checkout/123',
      reused: true,
    }
  );
});

test('resolveDirectorySubmitCheckoutTarget blocks duplicate pending checkout', () => {
  assert.deepEqual(
    resolveDirectorySubmitCheckoutTarget({
      callbackUrl: '/en/submit?step=3&id=item_1',
      activeOrderStatus: OrderStatus.PENDING,
    }),
    {
      error: 'checkout_in_progress',
    }
  );
});

test('resolveDirectorySubmitCheckoutTarget allows fresh checkout when no prior state exists', () => {
  assert.equal(
    resolveDirectorySubmitCheckoutTarget({
      callbackUrl: '/en/submit?step=3&id=item_1',
    }),
    null
  );
});
