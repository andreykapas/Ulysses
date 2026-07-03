import { createPageReader } from './pageReader.js';

const LOKI_ENTRY = 'loki/mara-diva-01.json';
const SELECTION_DEBOUNCE_MS = 500;

const reader = createPageReader({
  contentId: 'loki-content',
  pagerId: 'loki-pager',
});

let selectionTimer;

export function initLoki() {
  document.addEventListener('selectionchange', () => {
    clearTimeout(selectionTimer);
    selectionTimer = setTimeout(tryOpenFromSelection, SELECTION_DEBOUNCE_MS);
  });
}

export async function openLoki(file = LOKI_ENTRY) {
  document.querySelectorAll('.section').forEach((section) => {
    section.hidden = section.id !== 'loki';
  });

  document.querySelectorAll('#site-nav a').forEach((link) => {
    link.classList.remove('active');
  });

  document.body.classList.add('loki-open');

  await reader.load(file);
}

export async function reloadLoki() {
  const loki = document.getElementById('loki');
  if (loki.hidden) return;

  await reader.reload();
}

function tryOpenFromSelection() {
  const kayuta = document.getElementById('kayuta-content');
  const kayutaSection = document.getElementById('kayuta');
  const loki = document.getElementById('loki');

  if (!kayuta || !kayutaSection || kayutaSection.hidden || !loki?.hidden) return;
  if (!kayuta.querySelector('article')) return;
  if (!selectionInKayuta(kayuta)) return;

  const text = window.getSelection()?.toString().toLowerCase();
  if (!text?.includes('мара')) return;

  openLoki();
}

function selectionInKayuta(kayuta) {
  const sel = window.getSelection();
  if (!sel?.rangeCount) return false;

  const node = sel.anchorNode;
  return Boolean(node && kayuta.contains(node));
}
