// Точка входа Ulysses. Отсюда начнётся твой JS. Палуба твоя, Капитан.
import { initNavigation } from './nav.js';

async function getPoem(path, element) {
  try {
    const container = document.getElementById(element);
    if (!container) return;

    const response = await fetch(path);
    const data = await response.json();

    const article = document.createElement('article');

    data.text.forEach((stanza) => {
      const p = document.createElement('p');
      p.innerHTML = stanza.join('<br>');
      article.appendChild(p);
    });
    container.appendChild(article);
  } catch (error) {
    console.error('something went wrong...', error);
  }
}

function initLangSwitch() {
  const langSwitch = document.querySelector('.lang-switch');
  const langSwitchButtons = langSwitch.querySelectorAll('button');

  langSwitchButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const lang = button.dataset.lang;
      await loadUI(lang);
      langSwitchButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

async function loadUI(lang) {
  try {
    document.documentElement.lang = lang;

    const response = await fetch(`content/${lang}/ui.json`);
    const ui = await response.json();

    document.title = ui.siteTitle;
    document.querySelector('meta[name="description"]').content =
      ui.metaDescription;
    document
      .getElementById('site-nav')
      .setAttribute('aria-label', ui.navAriaLabel);
    document
      .getElementById('nav-burger')
      .setAttribute('aria-label', ui.navBurgerLabel);

    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach((element) => {
      const key = element.getAttribute('data-i18n');

      if (ui[key]) {
        element.textContent = ui[key];
      } else {
        console.warn(`Key "${key}" does not exist.`);
      }
    });
  } catch (error) {
    console.error('Something wrong with translating...', error);
  }
}

await loadUI('ru');
await getPoem('content/ru/baltika-zhdet.json', 'home');
initLangSwitch();
initNavigation();
