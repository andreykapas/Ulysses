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

test('getContent appends welcome door at end of about chapter', async () => {
  setupDom('<div id="bereg-content"></div>');
  document.documentElement.lang = 'ru';

  global.fetch = async (url) => {
    const data = JSON.parse(readFileSync(url, 'utf8'));
    if (url === 'content/social.json') {
      return {
        ok: true,
        json: async () => ({
          ...data,
          welcomeDoor: {
            ...data.welcomeDoor,
            url: 'https://www.patreon.com/andreykapas',
          },
        }),
      };
    }
    return {
      ok: true,
      json: async () => data,
    };
  };

  await getContent('content/ru/about/o-sebe.json', 'bereg-content');

  const article = document.getElementById('bereg-content').querySelector('article');
  const paragraphs = article.querySelectorAll('p');
  const door = article.querySelector('.bereg-door');

  assert.ok(paragraphs.length > 0);
  assert.equal(article.lastElementChild.className, 'bereg-door');
  assert.equal(door.querySelector('.bereg-door__link').textContent, 'Добро пожаловать');
});
