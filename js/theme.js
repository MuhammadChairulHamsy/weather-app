export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const icon = document.querySelector("#theme-toggle .theme-icon");
  const text = document.querySelector("#theme-toggle span:not(.theme-icon)");

  if (theme === "dark") {
    icon.textContent = "☀️";
    if (text) text.textContent = "Light Mode";
  } else {
    icon.textContent = "🌙";
    if (text) text.textContent = "Dark Mode";
  }
}

export function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const hour = new Date().getHours();
    const prefersDark = hour >= 18 || hour < 6;
    setTheme(prefersDark ? "dark" : "light");
  }
}

export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  setTheme(currentTheme === "dark" ? "light" : "dark");
}
