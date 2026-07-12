import { fetchContentJson } from './fetchContent.js';

export function createWelcomeDoor(door, lang) {
  if (!door?.url) return null;

  const aside = document.createElement('aside');
  aside.className = 'bereg-door';
  aside.setAttribute('aria-label', lang === 'en' ? 'Gangway' : 'Комингс');

  const link = document.createElement('a');
  link.href = door.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'bereg-door__link';
  link.textContent = lang === 'en' ? door.labelEn : door.labelRu;

  aside.append(link);
  return aside;
}

export async function appendWelcomeDoor(article, lang) {
  const data = await fetchContentJson('content/social.json');
  const door = createWelcomeDoor(data.welcomeDoor, lang);
  if (!door) return;

  article.append(door);
}
