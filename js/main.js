// Точка входа Ulysses. Отсюда начнётся твой JS. Палуба твоя, Капитан.
import { initNavigation } from './nav.js';
import { initLangSwitch, loadUI } from './i18n.js';
import { loadHomeFromIndex } from './home.js';
import { initKayuta, reloadKayuta } from './kayuta.js';
import { initRubka, reloadRubka } from './rubka.js';
import { loadBereg } from './bereg.js';

async function applyLang(lang) {
  await loadUI(lang);
  await loadHomeFromIndex(lang);
  await reloadKayuta();
  await reloadRubka();
  await loadBereg(lang);
}

initNavigation();
initKayuta();
initRubka();
await applyLang('ru');
initLangSwitch(applyLang);
