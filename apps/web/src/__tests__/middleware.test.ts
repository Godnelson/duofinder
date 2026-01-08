import assert from 'node:assert/strict';
import test from 'node:test';
import { PUBLIC_PATHS, shouldRedirectToLogin } from '../middleware';

test('public routes do not redirect without token', () => {
  for (const path of PUBLIC_PATHS) {
    assert.equal(shouldRedirectToLogin(path, false), false);
  }
});

test('protected routes redirect without token', () => {
  assert.equal(shouldRedirectToLogin('/discover', false), true);
  assert.equal(shouldRedirectToLogin('/matches', false), true);
});

test('protected routes allow access with token', () => {
  assert.equal(shouldRedirectToLogin('/discover', true), false);
  assert.equal(shouldRedirectToLogin('/me', true), false);
});
