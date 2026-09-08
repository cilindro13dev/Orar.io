// theme.js

// Вектор фавиконки (внутри стоит fill="currentColor")
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor"><path d="M71.74,26h-5V24a4,4,0,1,0-8,0v2h-18V24a4,4,0,0,0-8,0v2h-5a6,6,0,0,0-6,6v2a2,2,0,0,0,2,2h52a2,2,0,0,0,2-2V32A6,6,0,0,0,71.74,26Zm4,16a2,2,0,0,1,2,2h0V74a6,6,0,0,1-6,6h-44a6,6,0,0,1-6-6h0V44a2,2,0,0,1,2-2h52ZM62.24,69.32H50.5a1.17,1.17,0,0,0-1.17,1.16h0V73.8A1.18,1.18,0,0,0,50.5,75H62.24A1.17,1.17,0,0,0,63.4,73.8h0V70.48a1.16,1.16,0,0,0-1.16-1.16Zm0-13.49H36.66A1.17,1.17,0,0,0,35.5,57h0v7.9a1.16,1.16,0,0,0,1.16,1.16H62.24A1.16,1.16,0,0,0,63.4,64.9h0V57a1.17,1.17,0,0,0-1.16-1.17ZM48.4,47H36.66a1.16,1.16,0,0,0-1.16,1.16h0v3.32a1.17,1.17,0,0,0,1.16,1.16H48.4a1.18,1.18,0,0,0,1.17-1.16h0V48.16A1.17,1.17,0,0,0,48.4,47Z"/></svg>`;

function updateFavicon() {
  // 1. Считываем активный --color-accent из CSS текущей темы
  const accentColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-accent")
    .trim();

  // 2. Вшиваем цвет прямо в SVG через encodeURIComponent (чтобы HEX-решетка # не ломала URL)
  const coloredSvg = faviconSvg.replace(
    "currentColor",
    encodeURIComponent(accentColor),
  );
  const faviconDataUrl = `data:image/svg+xml,${coloredSvg}`;

  // 3. Ищем или создаем link фавиконки в head
  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    document.head.appendChild(link);
  }

  link.href = faviconDataUrl;
}

export default function setTheme(theme) {
  const themes = [`dark-green`, `dark-pink`, `dark-red`, `dark-purple`];
  // Вешаем тему на <html>
  document.documentElement.setAttribute("data-theme", themes[theme]);

  // Перекрашиваем фавиконку
  updateFavicon();
}

// По умолчанию ставим базовую тему при старте
setTheme(1);
