import { getContent } from './content.js';
import { getIndex } from './catalog.js';
import { createPageReader } from './pageReader.js';

export function createSectionBrowser({
  navSelector,
  contentId,
  dataAttr,
  defaultSection,
  ruSections = [],
  pagerId = null,
}) {
  let activeSection = defaultSection;
  let activeEntry = null;

  const pageReader = pagerId
    ? createPageReader({ contentId, pagerId })
    : null;

  function contentLangFor(section) {
    return ruSections.includes(section) ? 'ru' : document.documentElement.lang;
  }

  function clearPager() {
    if (!pagerId) return;
    const pager = document.getElementById(pagerId);
    if (pager) pager.innerHTML = '';
  }

  async function loadEntry({ file, section }) {
    const lang = contentLangFor(section);
    const path = `content/${lang}/${file}`;

    if (!pageReader) {
      await getContent(path, contentId);
      return;
    }

    try {
      const response = await fetch(path);
      const data = await response.json();

      if (data.page || data.prev || data.next) {
        await pageReader.load(file);
        return;
      }

      clearPager();
      await getContent(path, contentId);
    } catch (error) {
      console.error('Something wrong with entry...', error);
    }
  }

  async function showList(section) {
    try {
      const index = await getIndex();
      if (!index) return;

      const filtered = index.entries.filter((item) => item.section === section);

      const container = document.getElementById(contentId);
      if (!container) return;

      container.innerHTML = '';
      clearPager();

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

      activeEntry = {
        file: link.dataset.file,
        section: link.dataset.section,
      };

      await loadEntry(activeEntry);
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

    const file = pageReader?.getCurrentFile() ?? open.file;
    await loadEntry({ file, section: open.section });
  }

  return { init, reload };
}
