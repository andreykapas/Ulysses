import { getContent } from './content.js';
import { getIndex } from './catalog.js';

let activeKayutaSection = 'lyrics';
let activeEntry = null;

export function initKayuta() {
  const kayutaNav = document.querySelector('.kayuta-nav');
  if (!kayutaNav) return;

  kayutaNav.addEventListener('click', async (e) => {
    const link = createLink(e, 'kayuta');
    if (!link) return;

    kayutaNav.querySelectorAll('a').forEach((a) => {
      a.classList.toggle('active', a === link);
    });

    const section = link.dataset.kayuta;
    activeKayutaSection = section;
    activeEntry = null;
    await showKayutaList(section);
  });

  const kayutaContent = document.getElementById('kayuta-content');
  if (!kayutaContent) return;

  kayutaContent.addEventListener('click', async (e) => {
    const link = createLink(e, 'file');
    if (!link) return;

    kayutaContent
      .querySelectorAll('article')
      .forEach((article) => article.remove());

    const contentLang =
      link.dataset.section === 'lyrics' ? 'ru' : document.documentElement.lang;

    activeEntry = {
      file: link.dataset.file,
      section: link.dataset.section,
    };

    await getContent(
      `content/${contentLang}/${link.dataset.file}`,
      'kayuta-content',
    );
  });

  const defaultTab = kayutaNav.querySelector('[data-kayuta="lyrics"]');
  if (defaultTab) {
    defaultTab.classList.add('active');
  }
}

function createLink(e, attr) {
  const link = e.target.closest(`[data-${attr}]`);
  if (!link) return;

  e.preventDefault();

  return link;
}

async function showKayutaList(section) {
  try {
    const index = await getIndex();
    if (!index) return;

    const entries = index.entries;
    const filtered = entries.filter((item) => item.section === section);

    const container = document.getElementById('kayuta-content');
    container.innerHTML = '';

    if (filtered.length === 0) {
      container.textContent = 'Пока пусто';
      return;
    }

    const list = document.createElement('ul');

    const lang = document.documentElement.lang;

    filtered.forEach((entry) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      a.textContent =
        lang === 'en' && entry.titleEn ? entry.titleEn : entry.title;
      a.dataset.file = entry.file;
      a.dataset.section = entry.section;
      li.appendChild(a);
      list.appendChild(li);
    });

    container.appendChild(list);
  } catch (error) {
    console.error('Something wrong with Kayuta list...', error);
  }
}

export async function reloadKayuta() {
  const open = activeEntry;

  await showKayutaList(activeKayutaSection);

  if (!open) return;

  const contentLang =
    open.section === 'lyrics' ? 'ru' : document.documentElement.lang;

  await getContent(`content/${contentLang}/${open.file}`, 'kayuta-content');
}
