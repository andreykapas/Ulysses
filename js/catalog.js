const indexCache = new Map();

export async function getIndex() {
  try {
    if (indexCache.size) {
      return indexCache.get('first');
    } else {
      const response = await fetch('content/index.json');
      const data = await response.json();
      indexCache.set('first', data);
      return data;
    }
  } catch (error) {
    console.error('Something went wrong with getIndex()...', error);
  }
}
