import { initTheme, toggleTheme } from "./theme.js";
import { renderHistory, clearHistory  } from "./history.js";
import { showWeather } from "./forecast.js";


const searchBtn = document.getElementById("search-weather");
const textInput = document.getElementById("text-input");
const clearHistoryBtn = document.getElementById("clear-history");
const themeToggle = document.getElementById("theme-toggle");

searchBtn.addEventListener("click", () => {
  if (!textInput.value.trim()) {
    alert("Masukkan nama kota terlebih dahulu!");
    return;
  }
  showWeather(textInput.value.trim());
});

textInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

clearHistoryBtn.addEventListener("click", clearHistory);
themeToggle.addEventListener("click", toggleTheme);

initTheme();
renderHistory();
