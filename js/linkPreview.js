function siteFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function createLinkPreview(data) {
  if (!data.url) return null;

  const link = document.createElement('a');
  link.href = data.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'content-preview';

  const preview = data.preview;
  if (preview?.image) {
    const site = document.createElement('span');
    site.className = 'content-preview__site';
    site.textContent = preview.site || siteFromUrl(data.url);

    const title = document.createElement('strong');
    title.className = 'content-preview__title';
    title.textContent = preview.title || data.urlLabel || data.url;

    link.append(site, title);

    if (preview.description) {
      const desc = document.createElement('span');
      desc.className = 'content-preview__desc';
      desc.textContent = preview.description;
      link.append(desc);
    }

    const img = document.createElement('img');
    img.src = preview.image;
    img.alt = preview.title || data.urlLabel || '';
    img.loading = 'lazy';
    link.append(img);
  } else {
    link.textContent = data.urlLabel || data.url;
  }

  return link;
}

export function appendLinkPreviewAfterFirstParagraph(article, data) {
  const preview = createLinkPreview(data);
  if (!preview) return;

  const firstParagraph = article.querySelector('p');
  if (firstParagraph) {
    firstParagraph.insertAdjacentElement('afterend', preview);
  } else {
    article.append(preview);
  }
}
