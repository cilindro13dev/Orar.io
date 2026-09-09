import RenderSchedule, {
  openLectureForm,
  exportData,
  importData,
} from "./data.js";

const pageButtons = document.querySelectorAll(".pages button");
let currentPage = 0;

// Кнопка экспорта (data-icon="archive-up")
const exportBtn = document.querySelector(
  '.header-button[data-icon="archive-up"]',
);
if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    exportData();
  });
}

// Кнопка импорта (data-icon="archive-down")
const importBtn = document.querySelector(
  '.header-button[data-icon="archive-down"]',
);
if (importBtn) {
  importBtn.addEventListener("click", () => {
    importData(currentPage);
  });
}

const attachEditButtons = () => {
  const anchors = document.querySelectorAll(".lecture");

  for (let index = 0; index < anchors.length; index++) {
    const anchor = anchors[index];
    const parentRow = anchor.parentElement;

    if (parentRow.querySelector(".lecedit")) continue;

    const dayIndex = Math.floor(index / 8);
    const lessonIndex = index % 8;

    const editBtn = document.createElement("button");
    editBtn.className = "lecedit";
    editBtn.type = "button";
    editBtn.setAttribute("data-icon", "pencil");

    editBtn.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      openLectureForm(currentPage, dayIndex, lessonIndex);
    };

    parentRow.appendChild(editBtn);
  }
};

for (let i = 0; i < pageButtons.length; i++) {
  const button = pageButtons[i];

  button.addEventListener("click", () => {
    for (let a = 0; a < pageButtons.length; a++) {
      pageButtons[a].classList.remove("active");
    }
    button.classList.add("active");

    currentPage = i;
    RenderSchedule(currentPage);
  });
}

attachEditButtons();
