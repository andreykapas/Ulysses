const ICONS = {
  youtube: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.7 15.5V8.5L15.8 12l-6.1 3.5z"/>
  </svg>`,
  telegram: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M9.9 15.6 9.7 19c.4 0 .6-.2.8-.4l2-1.9 4.1 3c.8.4 1.3.2 1.5-.7l2.7-12.7c.3-1.2-.4-1.7-1.2-1.4L2.6 9.8c-1.1.4-1.1 1 0 1.3l4.5 1.4L18.5 7c.6-.4 1.1-.2.7.2"/>
  </svg>`,
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M12 2.2c2.7 0 3 0 4.1.1 1 0 1.5.2 1.9.3.5.2.8.4 1.2.8.4.4.6.7.8 1.2.1.4.3.9.3 1.9.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1-.2 1.5-.3 1.9-.2.5-.4.8-.8 1.2-.4.4-.7.6-1.2.8-.4.1-.9.3-1.9.3-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.5-.2-1.9-.3-.5-.2-.8-.4-1.2-.8-.4-.4-.6-.7-.8-1.2-.1-.4-.3-.9-.3-1.9-.1-1.1-.1-1.4-.1-4.1s0-3 .1-4.1c0-1 .2-1.5.3-1.9.2-.5.4-.8.8-1.2.4-.4.7-.6 1.2-.8.4-.1.9-.3 1.9-.3C9 2.2 9.3 2.2 12 2.2zm0 1.8c-2.6 0-2.9 0-4 .1-.9 0-1.4.2-1.7.3-.4.2-.7.3-1 .6-.3.3-.5.6-.6 1-.1.3-.3.8-.3 1.7-.1 1.1-.1 1.4-.1 4s0 2.9.1 4c0 .9.2 1.4.3 1.7.2.4.3.7.6 1 .3.3.6.5 1 .6.3.1.8.3 1.7.3 1.1.1 1.4.1 4 .1s2.9 0 4-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.3 1-.6.3-.3.5-.6.6-1 .1-.3.3-.8.3-1.7.1-1.1.1-1.4.1-4s0-2.9-.1-4c0-.9-.2-1.4-.3-1.7-.2-.4-.3-.7-.6-1-.3-.3-.6-.5-1-.6-.3-.1-.8-.3-1.7-.3-1.1-.1-1.4-.1-4-.1zm0 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm0 1.8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.9-3.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z"/>
  </svg>`,
  spotify: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.32a.757.757 0 0 1-1.035.272 7.68 7.68 0 0 0-8.342 0 .757.757 0 0 1-.763-1.307 9.194 9.194 0 0 1 9.868 0 .757.757 0 0 1 .272 1.035zm1.876-4.152a.946.946 0 0 1-1.297.326 9.608 9.608 0 0 0-11.138 0 .946.946 0 0 1-1.297-.326.946.946 0 0 1 .326-1.297 11.5 11.5 0 0 1 13.08 0 .946.946 0 0 1 .326 1.297zm2.033-4.303a1.135 1.135 0 0 1-1.553.39 13.773 13.773 0 0 0-14.832 0 1.135 1.135 0 0 1-1.553-.39 1.135 1.135 0 0 1 .39-1.553 16.043 16.043 0 0 1 16.158 0 1.135 1.135 0 0 1 .39 1.553z"/>
  </svg>`,
  x: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M18.9 2.2h3.4l-7.5 8.6L23.8 22h-6.9l-5.4-7.1-6.2 7.1H1.9l8-9.2L.2 2.2h7.1l4.9 6.5 6.7-6.5zm-1.2 17.8h1.9L7.1 4.1H5.1l12.6 15.9z"/>
  </svg>`,
  linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M20.4 2.2H3.6C2.7 2.2 2 2.9 2 3.8v16.4c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6V3.8c0-.9-.7-1.6-1.6-1.6zM7.2 18.4H4.6V9.5h2.6v8.9zM5.9 8.1c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm12.5 10.3h-2.6v-4.3c0-1-.4-1.7-1.3-1.7-1 0-1.4.7-1.4 1.7v4.3H10.5V9.5h2.5v1.2c.4-.8 1.3-1.4 2.6-1.4 1.9 0 3.3 1.2 3.3 3.8v5.3z"/>
  </svg>`,
};
let socialData = null;

async function loadSocialData() {
  if (socialData) return socialData;

  const response = await fetch('content/social.json', { cache: 'no-store' });
  socialData = await response.json();
  return socialData;
}

export async function renderSocialLinks(lang = document.documentElement.lang) {
  const container = document.querySelector('.site-social');
  if (!container) return;

  const data = await loadSocialData();
  container.innerHTML = '';

  data.links.forEach((link) => {
    const icon = ICONS[link.id];
    if (!icon) return;

    const a = document.createElement('a');
    a.href = link.url;
    a.className = 'site-social__link';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute(
      'aria-label',
      lang === 'en' ? link.labelEn || link.labelRu : link.labelRu,
    );
    a.innerHTML = icon;
    container.append(a);
  });
}
