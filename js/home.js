import { getContent } from './content.js';
import { getIndex } from './catalog.js';
import { randomizePage } from './randomizePage.js';

const HOME_SET_KEY = 'ulysses-home-set';
const HOME_CONTENT_ID = 'home-content';

let activeSetId = null;

function visibleSets(sets) {
  return sets.filter((set) => !set.hidden);
}

function renderHomePager(sets, currentId, lang) {
  const pager = document.getElementById('home-pager');
  if (!pager) return;

  pager.innerHTML = '';

  if (sets.length <= 1) return;

  const index = sets.findIndex((set) => set.id === currentId);
  if (index < 0) return;

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.textContent = '←';
  prevBtn.addEventListener('click', () => {
    const prevIndex = (index - 1 + sets.length) % sets.length;
    loadHomeSet(sets[prevIndex].id, lang);
  });

  const label = document.createElement('span');
  label.textContent = `${index + 1} / ${sets.length}`;

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.textContent = '→';
  nextBtn.addEventListener('click', () => {
    const nextIndex = (index + 1) % sets.length;
    loadHomeSet(sets[nextIndex].id, lang);
  });

  pager.append(prevBtn, label, nextBtn);
}

export async function loadHomeSet(setId, lang) {
  const index = await getIndex();
  if (!index) return;

  const sets = visibleSets(index.home.sets);
  const set = sets.find((item) => item.id === setId);

  if (!set) {
    console.error('set not found');
    return;
  }

  activeSetId = setId;
  sessionStorage.setItem(HOME_SET_KEY, setId);

  const container = document.getElementById(HOME_CONTENT_ID);
  if (!container) return;

  container.querySelectorAll('article').forEach((article) => article.remove());

  await getContent(`content/ru/${set.poem}`, HOME_CONTENT_ID);
  await getContent(`content/${lang}/${set.manifest}`, HOME_CONTENT_ID);

  renderHomePager(sets, setId, lang);
}

export async function loadHomeFromIndex(lang) {
  try {
    const index = await getIndex();
    if (!index) return;

    const sets = visibleSets(index.home.sets);
    if (!sets.length) return;

    let setId = activeSetId;

    if (!setId || !sets.some((set) => set.id === setId)) {
      setId = randomizePage({
        key: HOME_SET_KEY,
        mode: index.home.mode,
        fixedId: index.home.current,
        items: sets,
      });
    }

    await loadHomeSet(setId, lang);
  } catch (error) {
    console.error('something wrong with HOME...', error);
  }
}
