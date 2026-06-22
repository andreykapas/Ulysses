import { getPoem } from './content.js';

export async function loadHomeFromIndex() {
  try {
    const response = await fetch(`content/index.json`);
    const index = await response.json();
    const entry = index.entries.find((item) => item.id === index.home.current);

    if (!entry) {
      console.error('entry not found');
      return;
    }

    await getPoem(`content/ru/${entry.file}`, 'home');
  } catch (error) {
    console.error('something wrong with HOME...', error);
  }
}
