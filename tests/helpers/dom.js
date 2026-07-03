import { Window } from 'happy-dom';

export function setupDom(html = '') {
  const window = new Window();
  global.window = window;
  global.document = window.document;
  global.Node = window.Node;
  global.Event = window.Event;
  global.CustomEvent = window.CustomEvent;
  document.documentElement.lang = 'ru';
  document.body.innerHTML = html;
  return window;
}

export function mockFetch(fixtures) {
  return async (input) => {
    const url = typeof input === 'string' ? input : input.url;
    const data = fixtures[url];
    if (!data) {
      throw new Error(`Unexpected fetch: ${url}`);
    }
    return {
      ok: true,
      json: async () => structuredClone(data),
    };
  };
}
