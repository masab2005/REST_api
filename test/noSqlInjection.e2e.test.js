import test from 'node:test';
import assert from 'node:assert';
import {BASE_URL} from '../util/testUtils.js'

test('should block NoSQL injection in login', async () => {
  const maliciousPayload = {
    username: 'admin',
    password: { "$ne": null }
  };

  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(maliciousPayload)
  });

  const body = await res.json();

  assert.strictEqual(res.status, 400);
});
