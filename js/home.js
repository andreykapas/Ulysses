import { getContent } from './content.js';
import { getIndex } from './catalog.js';
import { randomizePage } from './randomizePage.js';

const HOME_SET_KEY = 'ulysses-home-set';

export async function loadHomeFromIndex(lang) {
  try {
    const home = document.getElementById('home');
    home.querySelectorAll('article').forEach((article) => article.remove());

    const index = await getIndex();
    if (!index) return;

    const set = index.home.sets.find(
      (item) =>
        item.id ===
        randomizePage({
          key: HOME_SET_KEY,
          mode: index.home.mode,
          fixedId: index.home.current,
          items: index.home.sets,
        }),
    );

    if (!set) {
      console.error('set not found');
      return;
    }

    await getContent(`content/ru/${set.poem}`, 'home');
    await getContent(`content/${lang}/${set.manifest}`, 'home');
  } catch (error) {
    console.error('something wrong with HOME...', error);
  }
}
