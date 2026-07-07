export async function loadUI(lang) {
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

    const socialNav = document.querySelector('.site-social');
    if (socialNav && ui.socialAriaLabel) {
      socialNav.setAttribute('aria-label', ui.socialAriaLabel);
    }

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

export function initLangSwitch(onLangChange) {
  const langSwitch = document.querySelector('.lang-switch');
  const langSwitchButtons = langSwitch.querySelectorAll('button');

  langSwitchButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const lang = button.dataset.lang;
      await onLangChange(lang);
      langSwitchButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
}
