import { createSectionBrowser } from './sectionBrowser.js';

const kayuta = createSectionBrowser({
  navSelector: '.kayuta-nav',
  contentId: 'kayuta-content',
  pagerId: 'kayuta-pager',
  dataAttr: 'kayuta',
  defaultSection: 'lyrics',
  ruSections: ['lyrics'],
});

export const initKayuta = kayuta.init;
export const reloadKayuta = kayuta.reload;
