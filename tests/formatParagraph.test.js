import test from 'node:test';
import assert from 'node:assert/strict';
import { formatParagraph } from '../js/formatParagraph.js';

test('formatParagraph collapses blank lines', () => {
  assert.equal(
    formatParagraph('Композер:\nПервая мысль.\n\nВторая мысль.'),
    'Композер:\nПервая мысль.\nВторая мысль.',
  );
});

test('formatParagraph trims outer whitespace', () => {
  assert.equal(formatParagraph('\n\nТекст.\n\n'), 'Текст.');
});
