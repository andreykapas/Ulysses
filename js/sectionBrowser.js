import { getContent } from './content.js';
import { fetchContentJson } from './fetchContent.js';
import { getIndex } from './catalog.js';
import { createPageReader } from './pageReader.js';

export function isPagedEntry(data) {
  return !!(data.page || data.prev || data.next);
}

function clearArticles(container) {
  container?.querySelectorAll('article').forEach((a) => a.remove());
}

function linkData(link, attr) {
  return link.getAttribute(`data-${attr}`);
}

export function createSectionBrowser({
  navSelector,
  contentId,
  dataAttr,
  defaultSection,
  ruSections = [],
  randomSections = [],
  pagerId = null,
  subNav = null,
}) {
  let activeSection = defaultSection;
  let activeEntry = null;
  let subNavEl = null;

  const pageReader = pagerId
    ? createPageReader({ contentId, pagerId })
    : null;

  function contentLangFor(section) {
    return ruSections.includes(section) ? 'ru' : document.documentElement.lang;
  }

  function isUnderSubNav(section) {
    return subNav && section.startsWith(`${subNav.parentSection}-`);
  }

  function setSubNavVisible(visible) {
    if (!subNavEl) return;
    subNavEl.hidden = !visible;
  }

  function setMainNavActive(section) {
    const nav = document.querySelector(navSelector);
    if (!nav) return;

    nav.querySelectorAll('a').forEach((a) => {
      const value = linkData(a, dataAttr);
      const isActive =
        value === section ||
        (subNav &&
          value === subNav.parentSection &&
          isUnderSubNav(section));
      a.classList.toggle('active', isActive);
    });
  }

  function setSubNavActive(section) {
    if (!subNavEl) return;

    subNavEl.querySelectorAll('a').forEach((a) => {
      a.classList.toggle('active', linkData(a, subNav.dataAttr) === section);
    });
  }

  async function pickRandomEntry(section) {
    try {
      const index = await getIndex();
      const entries =
        index?.entries.filter(
          (item) => item.section === section && !item.hidden,
        ) ?? [];
      if (!entries.length) return null;
      return entries[Math.floor(Math.random() * entries.length)];
    } catch {
      return null;
    }
  }

  async function activateSection(section) {
    activeSection = section;
    activeEntry = null;

    if (isUnderSubNav(section)) {
      setSubNavVisible(true);
      setSubNavActive(section);
    } else {
      setSubNavVisible(false);
    }

    setMainNavActive(section);

    if (randomSections.includes(section)) {
      const entry = await pickRandomEntry(section);
      if (entry) {
        activeEntry = { file: entry.file, section: entry.section };
        const container = document.getElementById(contentId);
        if (container) container.innerHTML = '';
        await loadEntry(activeEntry);
        return;
      }
    }

    await showList(section);
  }

  function clearPager() {
    if (!pagerId) return;
    const pager = document.getElementById(pagerId);
    if (pager) pager.innerHTML = '';
  }

  function renderBackButton(container) {
    if (!container || container.querySelector('.content-back')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'content-back';
    btn.textContent =
      document.documentElement.lang === 'en' ? '← to the list' : '← к списку';
    btn.addEventListener('click', async () => {
      activeEntry = null;
      clearPager();
      pageReader?.reset();
      await showList(activeSection);
    });
    container.prepend(btn);
  }

  async function loadEntry({ file, section }) {
    const lang = contentLangFor(section);
    const path = `content/${lang}/${file}`;

    const container = document.getElementById(contentId);
    container?.querySelector('ul')?.remove();

    if (!pageReader) {
      clearArticles(container);
      await getContent(path, contentId);
      renderBackButton(container);
      return;
    }

    try {
      const data = await fetchContentJson(path);

      if (isPagedEntry(data)) {
        await pageReader.load(file);
        renderBackButton(container);
        return;
      }

      clearPager();
      pageReader.reset();
      clearArticles(container);
      await getContent(path, contentId);
      renderBackButton(container);
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

    if (subNav) {
      subNavEl = document.querySelector(subNav.navSelector);
    }

    nav.addEventListener('click', async (e) => {
      const link = createLink(e, dataAttr);
      if (!link) return;

      const section = linkData(link, dataAttr);

      if (subNav && section === subNav.parentSection) {
        await activateSection(subNav.defaultSection);
        return;
      }

      await activateSection(section);
    });

    if (subNavEl) {
      setSubNavVisible(false);

      subNavEl.addEventListener('click', async (e) => {
        const link = createLink(e, subNav.dataAttr);
        if (!link) return;

        await activateSection(linkData(link, subNav.dataAttr));
      });
    }

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

    if (!open && randomSections.includes(activeSection)) {
      await activateSection(activeSection);
      return;
    }

    await showList(activeSection);

    if (isUnderSubNav(activeSection)) {
      setSubNavVisible(true);
      setSubNavActive(activeSection);
      setMainNavActive(activeSection);
    } else {
      setSubNavVisible(false);
      setMainNavActive(activeSection);
    }

    if (!open) return;

    const file = pageReader?.getCurrentFile() ?? open.file;
    await loadEntry({ file, section: open.section });
  }

  return { init, reload, loadEntry, showList };
}
