import { getContent } from './content.js';
import { getIndex } from './catalog.js';

export function createSectionBrowser({
  navSelector,
  contentId,
  dataAttr,
  defaultSection,
  ruSections = [],
}) {
  let activeSection = defaultSection;
  let activeEntry = null;

  function contentLangFor(section) {
    return ruSections.includes(section) ? 'ru' : document.documentElement.lang;
  }

  async function showList(section) {
    try {
      const index = await getIndex();
      if (!index) return;

      const filtered = index.entries.filter((item) => item.section === section);

      const container = document.getElementById(contentId);
      if (!container) return;

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
      console.error('Something wrong with list...', error);
    }
  }

  function createLink(e, attr) {
    const link = e.target.closest(`[data-${attr}]`);
    if (!link) return;

    e.preventDefault();

    return link;
  }

  function init() {
    const nav = document.querySelector(navSelector);
    if (!nav) return;

    nav.addEventListener('click', async (e) => {
      const link = createLink(e, dataAttr);
      if (!link) return;

      nav.querySelectorAll('a').forEach((a) => {
        a.classList.toggle('active', a === link);
      });

      activeSection = link.dataset[dataAttr];
      activeEntry = null;
      await showList(activeSection);
    });

    const content = document.getElementById(contentId);
    if (!content) return;

    content.addEventListener('click', async (e) => {
      const link = createLink(e, 'file');
      if (!link) return;

      content.querySelectorAll('article').forEach((a) => a.remove());
      activeEntry = {
        file: link.dataset.file,
        section: link.dataset.section,
      };

      const lang = contentLangFor(link.dataset.section);
      await getContent(`content/${lang}/${link.dataset.file}`, contentId);
    });

    const defaultTab = nav.querySelector(
      `[data-${dataAttr}="${defaultSection}"]`,
    );
    if (defaultTab) {
      defaultTab.classList.add('active');
    }
  }

  async function reload() {
    const open = activeEntry;
    await showList(activeSection);
    if (!open) return;

    const lang = contentLangFor(open.section);
    await getContent(`content/${lang}/${open.file}`, contentId);
  }

  return { init, reload };
}
