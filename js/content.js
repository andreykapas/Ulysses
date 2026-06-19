export async function getPoem(path, element) {
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
