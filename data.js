import setTheme from "./theme.js";

const STORAGE_KEY = "app_data";

// Вспомогательные фабрики
const createBellPair = () => ({ start: "XX : XX", end: "XX : XX" });
const createSchedulePair = () => ({ text: "------------", url: "" });

const createDay = () =>
  Array.from({ length: 6 }, () =>
    Array.from({ length: 8 }, createSchedulePair),
  );

const getDefaultData = () => ({
  theme: 0,
  bells: Array.from({ length: 6 }, createBellPair),
  schedule: Array.from({ length: 3 }, createDay),
});

// Глубокое слияние
const mergeData = (saved, template) => {
  if (saved === null || typeof saved !== typeof template) return template;

  if (Array.isArray(template)) {
    if (!Array.isArray(saved)) return template;
    for (let i = 0; i < template.length; i++) {
      saved[i] = mergeData(saved[i], template[i]);
    }
    return saved;
  }

  if (typeof template === "object") {
    for (const key of Object.keys(template)) {
      saved[key] = mergeData(saved[key], template[key]);
    }
    return saved;
  }

  return saved;
};

// Сохранение и загрузка
const saveData = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Ошибка при сохранении в localStorage:", error);
  }
};

const loadData = () => {
  const template = getDefaultData();
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return template;
    return mergeData(JSON.parse(rawData), template);
  } catch (error) {
    console.error("Ошибка загрузки localStorage:", error);
    return template;
  }
};

let data = loadData();
saveData();

// Отрисовка звонков
const renderBells = () => {
  const bellElements = document.querySelectorAll(".bell");

  for (let index = 0; index < data.bells.length; index++) {
    const bell = data.bells[index];
    const el = bellElements[index];

    if (el) {
      el.textContent = `${index + 1}) ${bell.start} - ${bell.end}`;
    }
  }
};

// Отрисовка расписания
const renderSchedule = (page = 0) => {
  const anchors = Array.from(document.querySelectorAll(".lecture"));
  const currentSchedule = data.schedule[page];

  if (!currentSchedule) return;

  let anchorIndex = 0;

  for (const day of currentSchedule) {
    for (let lessonIndex = 0; lessonIndex < day.length; lessonIndex++) {
      const lesson = day[lessonIndex];
      const anchorElement = anchors[anchorIndex++];

      if (anchorElement) {
        anchorElement.textContent = lesson.text || "------------";
        anchorElement.href = lesson.url || "#";
      }
    }
  }
};

// ЭКСПОРТ: Скачивание snapshot.json
export const exportData = () => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "snapshot.json";
  a.click();

  URL.revokeObjectURL(url);
};

// ИМПОРТ: Чтение snapshot.json и перезапись data
export const importData = (currentPage = 0) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);

        // Проверяем и валидируем через merge с дефолтным шаблоном
        data = mergeData(parsed, getDefaultData());

        // Сохраняем в localStorage и перерисовываем всё
        saveData();
        renderData();
        renderSchedule(currentPage);

        console.log("Данные успешно импортированы из snapshot.json");
      } catch (err) {
        console.error("Ошибка при чтении файла snapshot.json:", err);
      }
    };

    reader.readAsText(file);
  };

  input.click();
};

// Открытие и логика формы редактирования
export const openLectureForm = (page, dayIndex, lessonIndex) => {
  const bgCoverer = document.querySelector(".bg-coverer");
  const formLecture = document.querySelector(".form-lecture");
  const nameInput = document.getElementById("name");
  const linkInput = document.getElementById("link");
  const cancelBtn = document.getElementById("cancel");
  const submitBtn = document.getElementById("submit");

  const targetLesson = data.schedule[page]?.[dayIndex]?.[lessonIndex];
  if (!targetLesson) return;

  nameInput.value =
    targetLesson.text !== "------------" ? targetLesson.text : "";
  linkInput.value = targetLesson.url || "";

  bgCoverer.classList.remove("none");
  formLecture.classList.remove("none");

  const closeForm = () => {
    nameInput.value = "";
    linkInput.value = "";
    bgCoverer.classList.add("none");
    formLecture.classList.add("none");

    submitBtn.onclick = null;
    cancelBtn.onclick = null;
  };

  submitBtn.onclick = (e) => {
    e.preventDefault();

    targetLesson.text = nameInput.value.trim() || "------------";
    targetLesson.url = linkInput.value.trim();

    saveData();
    renderSchedule(page);
    closeForm();
  };

  cancelBtn.onclick = (e) => {
    e.preventDefault();
    closeForm();
  };
};

const renderData = () => {
  console.log(`Applying theme №${data.theme}...`);
  setTheme(data.theme);

  console.log(`Rendering the call schedule...`);
  renderBells();

  console.log(`Rendering the lecture schedule...`);
  renderSchedule(0);
};

renderData();

export default renderSchedule;
