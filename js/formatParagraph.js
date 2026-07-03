export function formatParagraph(text) {
  return text.replace(/\n{2,}/g, '\n').trim();
}
