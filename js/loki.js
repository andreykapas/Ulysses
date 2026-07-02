import { createPageReader } from './pageReader.js';

const LOKI_ENTRY = 'loki/mara-diva-01.json';

const reader = createPageReader({
  contentId: 'loki-content',
  pagerId: 'loki-pager',
});

export function initLoki() {
  const kayuta = document.getElementById('kayuta-content');
  if (!kayuta) return;

  kayuta.addEventListener('mouseup', tryOpenFromSelection);
  kayuta.addEventListener('touchend', tryOpenFromSelection);
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
  const text = window.getSelection()?.toString().toLowerCase();
  if (!text) return;

  if (text.includes('мара')) {
    openLoki();
  }
}
