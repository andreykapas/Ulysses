import { appendLinkPreviewAfterFirstParagraph } from './linkPreview.js';
import { fetchContentJson } from './fetchContent.js';
import { formatParagraph } from './formatParagraph.js';

export function createPageReader({ contentId, pagerId }) {
  let currentFile = null;

  async function load(file) {
    try {
      const lang = document.documentElement.lang;

      const data = await fetchContentJson(`content/${lang}/${file}`);

      const content = document.getElementById(contentId);
      if (!content) return;
      content.innerHTML = '';

      const article = document.createElement('article');

      data.paragraphs.forEach((paragraph) => {
        const p = document.createElement('p');
        p.textContent = formatParagraph(paragraph);
        article.appendChild(p);
      });

      appendLinkPreviewAfterFirstParagraph(article, data);

      content.appendChild(article);

      currentFile = file;

      const pager = document.getElementById(pagerId);
      if (!pager) return;
      pager.innerHTML = '';

      if (!data.prev && !data.next) return;

      if (data.prev) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = '←';
        btn.addEventListener('click', () => load(data.prev));
        pager.appendChild(btn);
      }

      if (data.page && data.pages) {
        const label = document.createElement('span');
        label.textContent = `${data.page} / ${data.pages}`;
        pager.appendChild(label);
      }

      if (data.next) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = '→';
        btn.addEventListener('click', () => load(data.next));
        pager.appendChild(btn);
      }
    } catch (error) {
      console.error('Something wrong with paged content...', error);
    }
  }

  async function reload() {
    if (!currentFile) return;
    await load(currentFile);
  }

  function getCurrentFile() {
    return currentFile;
  }

  function reset() {
    currentFile = null;
  }

  return { load, reload, getCurrentFile, reset };
}
