import test from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, mockFetch } from './helpers/dom.js';
import { createPageReader } from '../js/pageReader.js';

const FIXTURES = {
  'content/ru/loki/tale-01.json': {
    page: 1,
    pages: 2,
    prev: null,
    next: 'loki/tale-02.json',
    paragraphs: ['Deck one'],
  },
  'content/ru/loki/tale-02.json': {
    page: 2,
    pages: 2,
    prev: 'loki/tale-01.json',
    next: null,
    paragraphs: ['Deck two'],
  },
};

test.beforeEach(() => {
  setupDom(`
    <div id="loki-content"></div>
    <div id="loki-pager"></div>
  `);
  document.documentElement.lang = 'ru';
  global.fetch = mockFetch(FIXTURES);
});

test('pageReader navigates between pages', async () => {
  const reader = createPageReader({
    contentId: 'loki-content',
    pagerId: 'loki-pager',
  });

  await reader.load('loki/tale-01.json');

  const pager = document.getElementById('loki-pager');
  assert.equal(pager.querySelectorAll('button').length, 1);
  assert.match(document.getElementById('loki-content').textContent, /Deck one/);

  await reader.load('loki/tale-02.json');

  assert.match(document.getElementById('loki-content').textContent, /Deck two/);
  assert.equal(reader.getCurrentFile(), 'loki/tale-02.json');
});

test('pageReader reset clears current file', async () => {
  const reader = createPageReader({
    contentId: 'loki-content',
    pagerId: 'loki-pager',
  });

  await reader.load('loki/tale-01.json');
  reader.reset();

  assert.equal(reader.getCurrentFile(), null);
});
