export function createPageReader({ contentId, pagerId }) {
  let currentFile = null;

  async function load(file) {
    try {
      const lang = document.documentElement.lang;

      const response = await fetch(`content/${lang}/${file}`);
      const data = await response.json();

      const content = document.getElementById(contentId);
      if (!content) return;
      content.innerHTML = '';

      const article = document.createElement('article');

      data.paragraphs.forEach((paragraph) => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        article.appendChild(p);
      });

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
