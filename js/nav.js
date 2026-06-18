export function initNavigation() {
  const navLinksContainer = document.getElementById('site-nav');
  if (!navLinksContainer) return;

  navLinksContainer.addEventListener('click', function (e) {
    const link = e.target.closest('[data-section]');

    if (!link) return;

    e.preventDefault();

    const targetSectionId = link.dataset.section;

    document.querySelectorAll('.section').forEach((section) => {
      section.hidden = section.id !== targetSectionId;
    });

    document.getElementById('nav-toggle').checked = false;

    navLinksContainer.querySelectorAll('a').forEach((a) => {
      a.classList.toggle('active', a === link);
    });
  });
}
