import test from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './helpers/dom.js';
import {
  appendLinkPreviewAfterFirstParagraph,
  createLinkPreview,
} from '../js/linkPreview.js';

test.beforeEach(() => {
  setupDom('<article id="article"></article>');
});

test('createLinkPreview renders card when preview.image is set', () => {
  const el = createLinkPreview({
    url: 'https://ogloszenia.trojmiasto.pl/listing.html',
    urlLabel: 'Fallback label',
    preview: {
      site: 'trojmiasto.pl',
      title: 'Żaglówka - duża dzielność morska',
      description: 'rok prod. 1991',
      image: 'https://example.com/boat.jpg',
    },
  });

  assert.equal(el.tagName, 'A');
  assert.equal(el.href, 'https://ogloszenia.trojmiasto.pl/listing.html');
  assert.equal(el.target, '_blank');
  assert.match(el.querySelector('.content-preview__site').textContent, /trojmiasto/);
  assert.match(el.querySelector('.content-preview__title').textContent, /Żaglówka/);
  assert.match(el.querySelector('.content-preview__desc').textContent, /1991/);
  assert.equal(el.querySelector('img').src, 'https://example.com/boat.jpg');
});

test('createLinkPreview falls back to urlLabel without preview block', () => {
  const el = createLinkPreview({
    url: 'https://example.com/page',
    urlLabel: 'Plain link label',
  });

  assert.equal(el.textContent, 'Plain link label');
  assert.equal(el.querySelector('img'), null);
});

test('appendLinkPreviewAfterFirstParagraph inserts after first paragraph', () => {
  const article = document.getElementById('article');
  const p = document.createElement('p');
  p.textContent = 'Intro paragraph';
  article.append(p);

  appendLinkPreviewAfterFirstParagraph(article, {
    url: 'https://example.com/page',
    preview: {
      title: 'Card title',
      image: 'https://example.com/thumb.jpg',
    },
  });

  assert.equal(article.children.length, 2);
  assert.equal(article.children[0].tagName, 'P');
  assert.equal(article.children[1].className, 'content-preview');
});
