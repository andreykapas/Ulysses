// Точка входа Ulysses. Отсюда начнётся твой JS. Палуба твоя, Капитан.
async function getPoem(path) {
  try {
    const response = await fetch(path);
    const data = await response.json();
    console.log(data.text);
  } catch (error) {
    console.error("something went wrong...", error);
  }
}

await getPoem("content/ru/baltika-zhdet.json");
