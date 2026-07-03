import { createSectionBrowser } from './sectionBrowser.js';

const kayuta = createSectionBrowser({
  navSelector: '.kayuta-nav',
  contentId: 'kayuta-content',
  pagerId: 'kayuta-pager',
  dataAttr: 'kayuta',
  defaultSection: 'lyrics',
  ruSections: ['lyrics'],
  subNav: {
    navSelector: '.kayuta-tech-nav',
    dataAttr: 'kayuta-tech',
    parentSection: 'tech',
    defaultSection: 'tech-code',
  },
});

export const initKayuta = kayuta.init;
export const reloadKayuta = kayuta.reload;
