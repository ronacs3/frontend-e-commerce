import test from 'node:test';
import assert from 'node:assert/strict';
import { API_BASE_URL, apiFetch } from '../src/lib/api.mjs';

test('defaults to the NestJS backend', () => {
  assert.equal(API_BASE_URL, 'https://ecommerce-backend-nestjs-liard.vercel.app/api');
});

test('normalizes NestJS validation messages and preserves HTTP status', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({message: ['name is required', 'password too short']}), {status: 400}));
  const response = await apiFetch(`${API_BASE_URL}/users`);
  assert.equal(response.status, 400);
  assert.equal((await response.json()).message, 'name is required; password too short');
});

test('passes successful responses and multipart headers through unchanged', async (t) => {
  const response = new Response('stream');
  const body = new FormData();
  body.append('image', new Blob(['image']), 'image.png');
  const options = {method: 'POST', headers: {Authorization: 'Bearer token'}, body};
  const mock = t.mock.method(globalThis, 'fetch', async () => response);
  assert.equal(await apiFetch(`${API_BASE_URL}/upload`, options), response);
  assert.equal(mock.mock.calls[0].arguments[1], options);
});
