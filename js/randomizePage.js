export function randomizePage({ key, mode, fixedId, items }) {
  if (mode !== 'random' || !items.length) return fixedId;

  const savedId = sessionStorage.getItem(key);

  if (items.some((item) => item.id === savedId)) return savedId;

  const picked = items[Math.floor(Math.random() * items.length)];

  sessionStorage.setItem(key, picked.id);

  return picked.id;
}
