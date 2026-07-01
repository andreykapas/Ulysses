import { getContent } from './content.js';

export async function loadBereg(lang) {
  try {
    const bereg = document.getElementById('bereg-content');
    if (!bereg) return;

    bereg.querySelectorAll('article').forEach((article) => article.remove());

    await getContent(`content/${lang}/about/o-sebe.json`, 'bereg-content');
  } catch (error) {
    console.error('something wrong with Bereg...', error);
  }
}
