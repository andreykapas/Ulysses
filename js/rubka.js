import { createSectionBrowser } from './sectionBrowser.js';

const rubka = createSectionBrowser({
  navSelector: '.rubka-nav',
  contentId: 'rubka-content',
  dataAttr: 'rubka',
  defaultSection: 'log',
});

export const initRubka = rubka.init;
export const reloadRubka = rubka.reload;
