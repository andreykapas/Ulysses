import { getContent } from './content.js';

export async function loadHomeFromIndex() {
  try {
    const response = await fetch(`content/index.json`);
    const index = await response.json();
    const set = index.home.sets.find((item) => item.id === index.home.current);

    if (!set) {
      console.error('set not found');
      return;
    }

    await getContent(`content/ru/${set.poem}`, 'home');
    await getContent(`content/ru/${set.manifest}`, 'home');
  } catch (error) {
    console.error('something wrong with HOME...', error);
  }
}
