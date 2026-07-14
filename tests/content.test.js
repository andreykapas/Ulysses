import test from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './helpers/dom.js';
import { readRepoJson } from './helpers/repo.js';
import { getContent } from '../js/content.js';

test('getContent renders link preview card for marine listing', async () => {
  setupDom('<div id="kayuta-content"></div>');

  const path = 'content/ru/tech/marine/sparkman-stephens-zaglavka.json';
  global.fetch = async (url) => ({
    ok: true,
    json: async () => readRepoJson(url),
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

test('getContent renders link preview for lyrics poem with media', async () => {
  setupDom('<div id="kayuta-content"></div>');

  global.fetch = async (url) => ({
    ok: true,
    json: async () => readRepoJson(url),
  });

  await getContent('content/ru/lyrics/bora-bora.json', 'kayuta-content');

  const article = document.getElementById('kayuta-content').querySelector('article');
  const preview = article.querySelector('.content-preview');

  assert.equal(article.children[0].tagName, 'P');
  assert.equal(article.children[1].className, 'content-preview');
  assert.equal(preview.href, 'https://www.youtube.com/shorts/m7vhqalqSDI');
  assert.match(preview.querySelector('.content-preview__title').textContent, /Бора-Бора/);
  assert.match(preview.querySelector('img').src, /m7vhqalqSDI/);
});

test('getContent appends welcome door at end of about chapter', async () => {
  setupDom('<div id="bereg-content"></div>');
  document.documentElement.lang = 'ru';

  global.fetch = async (url) => {
    const data = readRepoJson(url);
    if (url === 'content/social.json') {
      return {
        ok: true,
        json: async () => ({
          ...data,
          welcomeDoor: {
            ...data.welcomeDoor,
            url: 'https://ko-fi.com/andreykapas',
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
