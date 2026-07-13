import test from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './helpers/dom.js';
import {
  appendWelcomeDoor,
  createWelcomeDoor,
} from '../js/welcomeDoor.js';

test.beforeEach(() => {
  setupDom('<article id="article"></article>');
});

test('createWelcomeDoor renders link with localized label', () => {
  const door = {
    url: 'https://ko-fi.com/andreykapas',
    labelRu: 'Добро пожаловать',
    labelEn: 'Welcome aboard',
  };

  const ru = createWelcomeDoor(door, 'ru');
  assert.equal(ru.className, 'bereg-door');
  assert.equal(ru.querySelector('.bereg-door__link').textContent, 'Добро пожаловать');
  assert.equal(
    ru.querySelector('.bereg-door__link').getAttribute('href'),
    'https://ko-fi.com/andreykapas',
  );

  const en = createWelcomeDoor(door, 'en');
  assert.equal(en.querySelector('.bereg-door__link').textContent, 'Welcome aboard');
});

test('createWelcomeDoor returns null without url', () => {
  assert.equal(createWelcomeDoor({ labelRu: 'Добро пожаловать' }, 'ru'), null);
});

test('appendWelcomeDoor adds door after last paragraph', async () => {
  setupDom('<article id="article"></article>');
  const article = document.getElementById('article');
  const p = document.createElement('p');
  p.textContent = 'Last paragraph';
  article.append(p);

  global.fetch = async (url) => {
    if (url !== 'content/social.json') {
      throw new Error(`Unexpected fetch: ${url}`);
    }
    return {
      ok: true,
      json: async () => ({
        welcomeDoor: {
          url: 'https://ko-fi.com/andreykapas',
          labelRu: 'Добро пожаловать',
          labelEn: 'Welcome aboard',
        },
      }),
    };
  };

  await appendWelcomeDoor(article, 'ru');

  assert.equal(article.children.length, 2);
  assert.equal(article.children[0].tagName, 'P');
  assert.equal(article.children[1].className, 'bereg-door');
});
