// Точка входа Ulysses. Отсюда начнётся твой JS. Палуба твоя, Капитан.
import { initNavigation } from './nav.js';
import { initLangSwitch, loadUI } from './i18n.js';
import { getPoem } from './content.js';

await loadUI('ru');
await getPoem('content/ru/baltika-zhdet.json', 'home');
initNavigation();
initLangSwitch();
