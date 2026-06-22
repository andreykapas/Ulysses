// Точка входа Ulysses. Отсюда начнётся твой JS. Палуба твоя, Капитан.
import { initNavigation } from './nav.js';
import { initLangSwitch, loadUI } from './i18n.js';
import { loadHomeFromIndex } from './home.js';

await loadUI('ru');
await loadHomeFromIndex();
initNavigation();
initLangSwitch();
