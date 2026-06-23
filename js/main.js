// Точка входа Ulysses. Отсюда начнётся твой JS. Палуба твоя, Капитан.
import { initNavigation } from './nav.js';
import { initLangSwitch, loadUI } from './i18n.js';
import { loadHomeFromIndex } from './home.js';

async function applyLang(lang) {
  await loadUI(lang);
  await loadHomeFromIndex(lang);
}

await applyLang('ru');
initNavigation();
initLangSwitch(applyLang);
