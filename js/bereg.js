import { getContent } from './content.js';

const CHAPTERS = {
  'o-sebe': ['about/o-sebe.json'],
  'brat-maksim': ['lyrics/brat-maksim.json', 'about/brat-maksim.json'],
};

let activeChapter = 'o-sebe';

function chapterFiles(chapter) {
  return CHAPTERS[chapter] ?? CHAPTERS['o-sebe'];
}

function contentPath(file, lang) {
  if (file.startsWith('lyrics/')) {
    return `content/ru/${file}`;
  }
  return `content/${lang}/${file}`;
}

function setNavActive(chapter) {
  const nav = document.querySelector('.bereg-nav');
  if (!nav) return;

  nav.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('active', a.dataset.bereg === chapter);
  });
}

export async function loadBereg(lang) {
  try {
    const bereg = document.getElementById('bereg-content');
    if (!bereg) return;

    if (!CHAPTERS[activeChapter]) {
      activeChapter = 'o-sebe';
    }

    bereg.querySelectorAll('article').forEach((article) => article.remove());

    for (const file of chapterFiles(activeChapter)) {
      await getContent(contentPath(file, lang), 'bereg-content');
    }

    setNavActive(activeChapter);
  } catch (error) {
    console.error('something wrong with Bereg...', error);
  }
}

export function initBereg() {
  const nav = document.querySelector('.bereg-nav');
  if (!nav) return;

  nav.addEventListener('click', async (e) => {
    const link = e.target.closest('[data-bereg]');
    if (!link) return;

    e.preventDefault();
    activeChapter = link.dataset.bereg;
    await loadBereg(document.documentElement.lang);
  });

  const defaultTab = nav.querySelector('[data-bereg="o-sebe"]');
  if (defaultTab) {
    defaultTab.classList.add('active');
  }
}
