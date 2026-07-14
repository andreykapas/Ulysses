import { appendLinkPreviewAfterFirstParagraph } from './linkPreview.js';
import { fetchContentJson } from './fetchContent.js';
import { formatParagraph } from './formatParagraph.js';
import { appendWelcomeDoor } from './welcomeDoor.js';

export async function getContent(path, element) {
  try {
    const container = document.getElementById(element);
    if (!container) return;

    const data = await fetchContentJson(path);

    const article = document.createElement('article');

    if (data.paragraphs) {
      data.paragraphs.forEach((paragraph) => {
        const p = document.createElement('p');
        p.textContent = formatParagraph(paragraph);
        article.appendChild(p);
      });

      appendLinkPreviewAfterFirstParagraph(article, data);

      if (data.welcomeDoor) {
        const lang = document.documentElement.lang || 'ru';
        await appendWelcomeDoor(article, lang);
      }
    } else if (data.text) {
      data.text.forEach((stanza) => {
        const p = document.createElement('p');
        p.innerHTML = stanza.join('<br>');
        article.appendChild(p);
      });

      appendLinkPreviewAfterFirstParagraph(article, data);
    } else {
      console.warn('There are no content found...');
      return;
    }

    container.appendChild(article);
  } catch (error) {
    console.error('something went wrong...', error);
  }
}
