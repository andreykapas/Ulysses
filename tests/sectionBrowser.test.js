import test from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, mockFetch } from './helpers/dom.js';
import { createSectionBrowser } from '../js/sectionBrowser.js';
import { resetIndexCache } from '../js/catalog.js';

const INDEX = {
  entries: [
    {
      id: 'poem-a',
      title: 'Poem A',
      section: 'lyrics',
      file: 'lyrics/poem-a.json',
    },
    {
      id: 'poem-b',
      title: 'Poem B',
      section: 'lyrics',
      file: 'lyrics/poem-b.json',
    },
    {
      id: 'dialogue',
      title: 'Dialogue',
      section: 'philosophy',
      file: 'philosophy/dialogue-01.json',
    },
  ],
};

const FIXTURES = {
  'content/index.json': INDEX,
  'content/ru/lyrics/poem-a.json': {
    text: [['First poem line']],
  },
  'content/ru/lyrics/poem-b.json': {
    text: [['Second poem line']],
  },
  'content/ru/philosophy/dialogue-01.json': {
    page: 1,
    pages: 2,
    prev: null,
    next: 'philosophy/dialogue-02.json',
    paragraphs: ['Page one text'],
  },
  'content/ru/philosophy/dialogue-02.json': {
    page: 2,
    pages: 2,
    prev: 'philosophy/dialogue-01.json',
    next: null,
    paragraphs: ['Page two text'],
  },
};

function makeKayutaBrowser() {
  return createSectionBrowser({
    navSelector: '.kayuta-nav',
    contentId: 'kayuta-content',
    pagerId: 'kayuta-pager',
    dataAttr: 'kayuta',
    defaultSection: 'lyrics',
    ruSections: ['lyrics'],
  });
}

function makeRubkaBrowser() {
  return createSectionBrowser({
    navSelector: '.rubka-nav',
    contentId: 'rubka-content',
    dataAttr: 'rubka',
    defaultSection: 'log',
  });
}

test.beforeEach(() => {
  resetIndexCache();
  setupDom(`
    <nav class="kayuta-nav">
      <a href="#" data-kayuta="lyrics">Lyrics</a>
      <a href="#" data-kayuta="philosophy">Philosophy</a>
    </nav>
    <div id="kayuta-content"></div>
    <div id="kayuta-pager"></div>
    <div id="rubka-content"></div>
  `);
  global.fetch = mockFetch(FIXTURES);
});

test('switching lyrics replaces the previous poem', async () => {
  const browser = makeKayutaBrowser();

  await browser.loadEntry({
    file: 'lyrics/poem-a.json',
    section: 'lyrics',
  });
  await browser.loadEntry({
    file: 'lyrics/poem-b.json',
    section: 'lyrics',
  });

  const content = document.getElementById('kayuta-content');
  const articles = content.querySelectorAll('article');

  assert.equal(articles.length, 1);
  assert.match(articles[0].textContent, /Second poem line/);
  assert.doesNotMatch(articles[0].textContent, /First poem line/);
});

test('paged philosophy clears the list and renders pager', async () => {
  const browser = makeKayutaBrowser();
  await browser.showList('lyrics');

  await browser.loadEntry({
    file: 'philosophy/dialogue-01.json',
    section: 'philosophy',
  });

  const content = document.getElementById('kayuta-content');
  const pager = document.getElementById('kayuta-pager');

  assert.equal(content.querySelector('ul'), null);
  assert.match(content.textContent, /Page one text/);
  assert.match(pager.textContent, /1 \/ 2/);
  assert.equal(pager.querySelectorAll('button').length, 1);
});

test('switching from philosophy back to a poem resets pager state', async () => {
  const browser = makeKayutaBrowser();

  await browser.loadEntry({
    file: 'philosophy/dialogue-01.json',
    section: 'philosophy',
  });
  await browser.loadEntry({
    file: 'lyrics/poem-a.json',
    section: 'lyrics',
  });

  const pager = document.getElementById('kayuta-pager');
  assert.equal(pager.innerHTML, '');
  assert.match(
    document.getElementById('kayuta-content').textContent,
    /First poem line/,
  );
});

test('rubka without pager still replaces articles between entries', async () => {
  const browser = makeRubkaBrowser();

  await browser.loadEntry({
    file: 'lyrics/poem-a.json',
    section: 'lyrics',
  });
  await browser.loadEntry({
    file: 'lyrics/poem-b.json',
    section: 'lyrics',
  });

  const articles = document.getElementById('rubka-content').querySelectorAll(
    'article',
  );

  assert.equal(articles.length, 1);
  assert.match(articles[0].textContent, /Second poem line/);
});
