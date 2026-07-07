import test from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './helpers/dom.js';
import { renderSocialLinks } from '../js/social.js';

test('renderSocialLinks adds all configured social links', async () => {
  setupDom(`
    <footer class="site-footer">
      <nav class="site-social" aria-label=""></nav>
      <p>footer</p>
    </footer>
  `);
  document.documentElement.lang = 'ru';

  global.fetch = async (url) => {
    if (url !== 'content/social.json') {
      throw new Error(`Unexpected fetch: ${url}`);
    }
    return {
      ok: true,
      json: async () => ({
        links: [
          {
            id: 'youtube',
            url: 'https://www.youtube.com/@andreypristavko',
            labelRu: 'YouTube',
            labelEn: 'YouTube',
          },
          {
            id: 'spotify',
            url: 'https://open.spotify.com/artist/1BhI80I595pQNeFad1sIGj',
            labelRu: 'Spotify',
            labelEn: 'Spotify',
          },
        ],
      }),
    };
  };

  await renderSocialLinks('ru');

  const links = document.querySelectorAll('.site-social__link');
  assert.equal(links.length, 2);
  assert.equal(links[0].href, 'https://www.youtube.com/@andreypristavko');
  assert.equal(links[1].href, 'https://open.spotify.com/artist/1BhI80I595pQNeFad1sIGj');
});
