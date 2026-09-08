const pad = (num) => String(num).padStart(2, "0");

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const getDate = () => {
  const now = new Date();

  const months = [
    `January`,
    `February`,
    `March`,
    `April`,
    `May`,
    `June`,
    `July`,
    `August`,
    `September`,
    `October`,
    `November`,
    `December`,
  ];
  const week = [
    `Sunday`,
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ];

  let snapshot = {
    day: getOrdinal(now.getDate()),
    month: months[now.getMonth()],
    year: now.getFullYear(),
    weekDay: week[now.getDay()],
    hour: pad(now.getHours()),
    minute: pad(now.getMinutes()),
    second: pad(now.getSeconds()),
  };

  return snapshot;
};

const updateClock = () => {
  const clock = {
    hours: document.getElementById("clock"),
    date: document.getElementById("date"),
  };

  let data = getDate();

  clock.hours.textContent = `${data.hour}:${data.minute}:${data.second}`;
  clock.date.textContent = `${data.weekDay}, the ${data.day} of ${data.month}, ${data.year}`;
};

window.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);
});
