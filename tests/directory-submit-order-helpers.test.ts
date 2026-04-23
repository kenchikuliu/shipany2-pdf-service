import test from 'node:test';
import assert from 'node:assert/strict';

import {
  escapeSqlLike,
  getDirectoryFreeSubmitOrderNo,
  getDirectoryProSubmitOrderNo,
  getDirectorySubmitCompletionPlan,
  getDirectorySubmitOrderSearchPatterns,
  parseDirectorySubmitItemId,
} from '../src/app/[locale]/(directory)/submit/order-helpers';
import { getSafeExternalUrl, normalizeExternalUrl } from '../src/shared/lib/utils';

const DIRECTORY_SUBMIT_FREE_PRODUCT_ID = 'directory-submit-free';
const DIRECTORY_SUBMIT_PRO_PRODUCT_ID = 'directory-submit-pro';

test('getDirectoryFreeSubmitOrderNo is deterministic by item id', () => {
  assert.equal(
    getDirectoryFreeSubmitOrderNo('item_123'),
    'directory-free-item_123'
  );
  assert.equal(
    getDirectoryFreeSubmitOrderNo('item_123'),
    getDirectoryFreeSubmitOrderNo('item_123')
  );
});

test('getDirectoryProSubmitOrderNo is deterministic by item id', () => {
  assert.equal(
    getDirectoryProSubmitOrderNo('item_123'),
    'directory-pro-item_123'
  );
});

test('parseDirectorySubmitItemId supports absolute and relative callback URLs', () => {
  assert.equal(
    parseDirectorySubmitItemId('https://example.com/submit?step=3&id=item_abs'),
    'item_abs'
  );
  assert.equal(
    parseDirectorySubmitItemId('/submit?step=3&id=item_rel'),
    'item_rel'
  );
  assert.equal(parseDirectorySubmitItemId('/submit?step=3'), null);
});

test('getDirectorySubmitCompletionPlan maps known product ids only', () => {
  assert.equal(
    getDirectorySubmitCompletionPlan(DIRECTORY_SUBMIT_FREE_PRODUCT_ID),
    'free'
  );
  assert.equal(
    getDirectorySubmitCompletionPlan(DIRECTORY_SUBMIT_PRO_PRODUCT_ID),
    'pro'
  );
  assert.equal(getDirectorySubmitCompletionPlan('other-product'), null);
  assert.equal(getDirectorySubmitCompletionPlan(), null);
});

test('escapeSqlLike escapes wildcard characters in item ids', () => {
  assert.equal(escapeSqlLike('item_%_id\\x'), 'item\\_\\%\\_id\\\\x');
});

test('getDirectorySubmitOrderSearchPatterns uses escaped item ids', () => {
  assert.deepEqual(getDirectorySubmitOrderSearchPatterns('item_%'), {
    checkoutInfo: '%"nav_item_id":"item\\_\\%"%',
    paymentResult: '%"nav_item_id":"item\\_\\%"%',
    callbackUrl: '%id=item\\_\\%%',
  });
});

test('directory submit external urls only allow http and https', () => {
  assert.equal(
    getSafeExternalUrl('https://example.com/path#hash'),
    'https://example.com/path'
  );
  assert.equal(getSafeExternalUrl('javascript:alert(1)'), null);
  assert.equal(getSafeExternalUrl('data:text/html,hi'), null);
  assert.equal(normalizeExternalUrl('http://example.com'), 'http://example.com/');
});
