import setTheme from "./theme.js";

let data = {
  theme: 0,
  bells: [],
  schedule: [[], [], []],
};

const fillLorem = () => {
  // Пара для звонков (начало и конец)
  const createBellPair = () => ({ start: "XX : XX", end: "XX : XX" });

  // Пара для расписания (текст и ссылка)
  const createSchedulePair = () => ({ text: "------------", url: "" });

  // 1 день расписания: 6 уроков по 8 объектов
  const createDay = () =>
    Array.from({ length: 6 }, () =>
      Array.from({ length: 8 }, createSchedulePair),
    );

  return {
    theme: 0,
    // 6 пар времени звонков { start, end }
    bells: Array.from({ length: 6 }, createBellPair),
    // 3 блока по 6 дней расписания { text, url }
    schedule: Array.from({ length: 3 }, createDay),
  };
};

data = fillLorem();
console.log(data);

const RenderSchedule = (page) => {
  const anchors = Array.from(document.querySelectorAll(".lecture"));
  const chunkSize = 8;
  const result = [];

  for (let i = 0; i < anchors.length; i += chunkSize) {
    result.push(anchors.slice(i, i + chunkSize));
  }

  const currentSchedule = data.schedule[page];
  if (!currentSchedule) return;

  for (let dayIndex = 0; dayIndex < currentSchedule.length; dayIndex++) {
    const day = currentSchedule[dayIndex];

    for (let lessonIndex = 0; lessonIndex < day.length; lessonIndex++) {
      const lesson = day[lessonIndex];
      const anchorElement = result[dayIndex]?.[lessonIndex];

      if (anchorElement) {
        const lessonNumber = lessonIndex + 1;

        anchorElement.textContent = lesson.text
          ? `${lessonNumber}. ${lesson.text}`
          : `${lessonNumber}.`;

        anchorElement.href = lesson.url || "#";
      }
    }
  }
};

const HellsBells = () => {
  const bells = document.querySelectorAll(".bell");

  for (let index = 0; index < data.bells.length; index++) {
    const bell = data.bells[index];
    const bellElement = bells[index];

    if (bellElement) {
      const bellNumber = index + 1;
      bellElement.textContent = `${bellNumber}) ${bell.start} - ${bell.end}`;
    }
  }
};

const RenderData = () => {
  console.log(`Applying theme №${data.theme}...`);
  setTheme(data.theme);

  console.log(`Rendering the call schedule...`);
  HellsBells();

  console.log(`Rendering the lecture schedule...`);
  RenderSchedule(0);
};

RenderData();
