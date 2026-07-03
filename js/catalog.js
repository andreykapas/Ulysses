let indexPromise;

export function resetIndexCache() {
  indexPromise = undefined;
}

export function getIndex() {
  if (!indexPromise) {
    indexPromise = fetch('content/index.json', { cache: 'no-store' })
      .then((r) => r.json())
      .catch((error) => {
        indexPromise = undefined;
        throw error;
      });
  }
  return indexPromise;
}
