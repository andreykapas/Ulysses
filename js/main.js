// Точка входа Ullis. Отсюда начнётся твой JS. Палуба твоя, Капитан.
import { initNavigation } from './nav.js';
import { initLangSwitch, loadUI } from './i18n.js';
import { loadHomeFromIndex } from './home.js';
import { initKayuta, reloadKayuta } from './kayuta.js';
import { initRubka, reloadRubka } from './rubka.js';
import { initBereg, loadBereg } from './bereg.js';
import { initLoki, reloadLoki } from './loki.js';
import { renderSocialLinks } from './social.js';

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
