import test from 'node:test';
import assert from 'node:assert/strict';
import { isPagedEntry } from '../js/sectionBrowser.js';

test('isPagedEntry detects multi-page philosophy entries', () => {
  assert.equal(
    isPagedEntry({
      page: 1,
      pages: 6,
      prev: null,
      next: 'philosophy/otkrytaya-ladon-02.json',
      paragraphs: ['a'],
    }),
    true,
  );
});

test('isPagedEntry ignores plain lyrics poems', () => {
  assert.equal(
    isPagedEntry({
      title: 'Я вода',
      text: [['line one']],
    }),
    false,
  );
});
