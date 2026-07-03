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
      id: 'code-note',
      title: 'Code note',
      section: 'tech-code',
      file: 'tech/code/note.json',
    },
    {
      id: 'marine-note',
      title: 'Marine note',
      section: 'tech-marine',
      file: 'tech/marine/note.json',
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
  'content/ru/tech/code/note.json': {
    paragraphs: ['Code deck text'],
  },
  'content/ru/tech/marine/note.json': {
    paragraphs: ['Marine deck text'],
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
    ruSections: ['lyrics', 'tech-marine'],
    subNav: {
      navSelector: '.kayuta-tech-nav',
      dataAttr: 'kayuta-tech',
      parentSection: 'tech',
      defaultSection: 'tech-code',
    },
  });
}

function makeKayutaBrowserPlain() {
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
      <a href="#" data-kayuta="tech">Tech</a>
      <a href="#" data-kayuta="philosophy">Philosophy</a>
    </nav>
    <nav class="kayuta-tech-nav" hidden>
      <a href="#" data-kayuta-tech="tech-code">Coders</a>
      <a href="#" data-kayuta-tech="tech-marine">Mechanics</a>
    </nav>
    <div id="kayuta-content"></div>
    <div id="kayuta-pager"></div>
    <div id="rubka-content"></div>
  `);
  global.fetch = mockFetch(FIXTURES);
});

test('switching lyrics replaces the previous poem', async () => {
  const browser = makeKayutaBrowserPlain();

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
  const browser = makeKayutaBrowserPlain();
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
  const browser = makeKayutaBrowserPlain();

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

test('tech subnav opens coders by default and shows subnav', async () => {
  const browser = makeKayutaBrowser();
  browser.init();

  document.querySelector('[data-kayuta="tech"]').click();
  await new Promise((resolve) => setTimeout(resolve, 0));

  const subNav = document.querySelector('.kayuta-tech-nav');
  const content = document.getElementById('kayuta-content');

  assert.equal(subNav.hidden, false);
  assert.match(content.textContent, /Code note/);
  assert.doesNotMatch(content.textContent, /Marine note/);
});

test('tech subnav switches to mechanics list', async () => {
  const browser = makeKayutaBrowser();
  browser.init();

  document.querySelector('[data-kayuta-tech="tech-marine"]').click();
  await new Promise((resolve) => setTimeout(resolve, 0));

  const content = document.getElementById('kayuta-content');

  assert.match(content.textContent, /Marine note/);
  assert.doesNotMatch(content.textContent, /Code note/);
});

test('leaving tech hides subnav', async () => {
  const browser = makeKayutaBrowser();
  browser.init();

  document.querySelector('[data-kayuta="tech"]').click();
  await new Promise((resolve) => setTimeout(resolve, 0));
  document.querySelector('[data-kayuta="lyrics"]').click();
  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(document.querySelector('.kayuta-tech-nav').hidden, true);
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
