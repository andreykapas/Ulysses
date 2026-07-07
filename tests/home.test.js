import test from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, mockFetch } from './helpers/dom.js';
import { resetIndexCache } from '../js/catalog.js';
import { loadHomeFromIndex, loadHomeSet } from '../js/home.js';

const INDEX = {
  home: {
    mode: 'fixed',
    current: 'set-1',
    sets: [
      {
        id: 'set-1',
        poem: 'lyrics/poem-a.json',
        manifest: 'home/manifest-a.json',
      },
      {
        id: 'set-2',
        poem: 'lyrics/poem-b.json',
        manifest: 'home/manifest-b.json',
      },
      {
        id: 'set-secret',
        poem: 'lyrics/secret.json',
        manifest: 'home/secret.json',
        hidden: true,
      },
    ],
  },
  entries: [],
};

const FIXTURES = {
  'content/index.json': INDEX,
  'content/ru/lyrics/poem-a.json': { text: [['First home poem']] },
  'content/ru/lyrics/poem-b.json': { text: [['Second home poem']] },
  'content/ru/lyrics/secret.json': { text: [['Secret poem']] },
  'content/ru/home/manifest-a.json': { paragraphs: ['Manifest A'] },
  'content/ru/home/manifest-b.json': { paragraphs: ['Manifest B'] },
  'content/ru/home/secret.json': { paragraphs: ['Secret manifest'] },
};

test.beforeEach(() => {
  resetIndexCache();
  global.sessionStorage = {
    store: {},
    getItem(key) {
      return this.store[key] ?? null;
    },
    setItem(key, value) {
      this.store[key] = value;
    },
  };
  setupDom(`
    <section id="home">
      <div id="home-content"></div>
      <div id="home-pager" class="page-pager"></div>
    </section>
  `);
  global.fetch = mockFetch(FIXTURES);
});

test('home pager skips hidden sets', async () => {
  await loadHomeFromIndex('ru');

  const pager = document.getElementById('home-pager');
  assert.match(pager.textContent, /1 \/ 2/);
  assert.doesNotMatch(document.getElementById('home-content').textContent, /Secret/);
});

test('home pager arrow loads the next public set', async () => {
  await loadHomeFromIndex('ru');

  document.querySelector('#home-pager button:last-child').click();
  await new Promise((resolve) => setTimeout(resolve, 0));

  const content = document.getElementById('home-content');
  assert.match(content.textContent, /Second home poem/);
  assert.match(content.textContent, /Manifest B/);
  assert.match(document.getElementById('home-pager').textContent, /2 \/ 2/);
});

test('loadHomeSet keeps the chosen set on reload', async () => {
  await loadHomeSet('set-2', 'ru');
  await loadHomeFromIndex('ru');

  assert.match(
    document.getElementById('home-content').textContent,
    /Second home poem/,
  );
});
