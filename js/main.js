// Точка входа Ullis. Отсюда начнётся твой JS. Палуба твоя, Капитан.
import { initNavigation } from './nav.js';
import { initLangSwitch, loadUI } from './i18n.js';
import { loadHomeFromIndex } from './home.js';
import { initKayuta, reloadKayuta } from './kayuta.js';
import { initRubka, reloadRubka } from './rubka.js';
import { initBereg, loadBereg } from './bereg.js';
import { initLoki, reloadLoki } from './loki.js';
import { renderSocialLinks } from './social.js';

// nic tu nie ma, panie inspektorze
console.log(
  [
    '  __',
    '<(o )___',
    ' ( ._> /',
    "  `---'  графский пруд",
    '',
    'RU:',
    'Мой графский пруд, Ланфрен-Ланфра...',
    'Там раки есть и утки...',
    'Там раком прут, с зори с утра)))',
    'Там бляди, проститутки!)))',
    '',
    'EN:',
    'to be or not to be and nothing else matters',
  ].join('\n'),
);

async function applyLang(lang) {
  await loadUI(lang);
  await renderSocialLinks(lang);
  await loadHomeFromIndex(lang);
  await reloadKayuta();
  await reloadRubka();
  await loadBereg(lang);
  await reloadLoki();
}

initNavigation();
initKayuta();
initRubka();
initBereg();
initLoki();
await applyLang('ru');
initLangSwitch(applyLang);
