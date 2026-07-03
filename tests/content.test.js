import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setupDom } from './helpers/dom.js';
import { getContent } from '../js/content.js';

test('getContent renders link preview card for marine listing', async () => {
  setupDom('<div id="kayuta-content"></div>');

  const path = 'content/ru/tech/marine/sparkman-stephens-zaglavka.json';
  global.fetch = async (url) => ({
    ok: true,
    json: async () => JSON.parse(readFileSync(url, 'utf8')),
  });

  await getContent(path, 'kayuta-content');

  const container = document.getElementById('kayuta-content');
  const preview = container.querySelector('.content-preview');

  assert.ok(preview);
  assert.equal(preview.tagName, 'A');
  assert.ok(preview.querySelector('.content-preview__site'));
  assert.ok(preview.querySelector('.content-preview__title'));
  assert.ok(preview.querySelector('img'));
  assert.doesNotMatch(preview.textContent, /Заглавка, duża dzielność morska — Trojmiasto.pl/);
});
