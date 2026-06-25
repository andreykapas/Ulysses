let indexPromise;
export function getIndex() {
  if (!indexPromise) {
    indexPromise = fetch('content/index.json')
      .then((r) => r.json())
      .catch((error) => {
        indexPromise = undefined;
        throw error;
      });
  }
  return indexPromise;
}
