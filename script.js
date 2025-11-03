const apiKey = "3811de17c98d9d47a56e1f2e4f0808e3";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

const textInput = document.getElementById("text-input");
const searchWeather = document.getElementById("search-weather");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");
const themeToggle = document.getElementById("theme-toggle");
const currentWeatherCard = document.getElementById("current-weather-card");
const forecastCard = document.getElementById("forecast-card");

  // Weather icons mapping
    const weatherIcons = {
      "01d": "☀️", "01n": "🌙",
      "02d": "⛅", "02n": "☁️",
      "03d": "☁️", "03n": "☁️",
      "04d": "☁️", "04n": "☁️",
      "09d": "🌧️", "09n": "🌧️",
      "10d": "🌦️", "10n": "🌧️",
      "11d": "⛈️", "11n": "⛈️",
      "13d": "❄️", "13n": "❄️",
      "50d": "🌫️", "50n": "🌫️"
    };

// Theme Management
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const icon = themeToggle.querySelector(".theme-icon");
  const text = themeToggle.querySelector("span:not(.theme-icon)");

  if(theme === "dark") {
    icon.textContent = '☀️';
    if(text) text.textContent = "Light Mode";
  } else {
    icon.textContent = '🌙';
    if(text) text.textContent = "Dark Mode";
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");

  if(savedTheme) {
    setTheme(savedTheme);
  } else {
    const hour = new Date().getHours();
    const prefersDark = hour >= 18 || hour < 6;
    setTheme(prefersDark ? "dark" : "light");
  }
}

// Theme toggle manual
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
});

searchWeather.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!textInput.value.trim()) {
    alert("Mohon dimasukan nama kota!");
    return;
  }
  
  let result = document.getElementById("result");  
  result.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `${baseUrl}?q=${textInput.value}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Kota tidak ditemukan (Status: ${response.status})`);
    }
    const data = await response.json();

     // Fetch 5-day forecast
      const forecastResponse = await fetch(`${forecastUrl}?q=${textInput.value}&appid=${apiKey}&units=metric`);

      const forecastData = await forecastResponse.json();
    result.innerHTML = `
              <h2>${data.name}, ${data.sys.country}</h2>
              <h3><span>${Math.round(data.main.temp)}°С</span> <span>${data.weather[0].description}</span></h3>
              <p>Temperature from ${Math.round( data.main.temp_min)}°С to ${Math.round(data.main.temp_max)}°С</p>
              <h5>Wind Speed: ${data.wind.speed} m/s</h5>
              <h5>Clouds: ${data.clouds.all}%</h5>
              <h4>Geo Coordinates: [${data.coord.lat}, ${data.coord.lon}]</h4>
    `;
    // Display results
    displayForecast(forecastData);
    addHistory(data.name);

  } catch (error) {
    result.innerHTML = "";
    if (error.message.includes("Failed to fetch")) {
      alert("Gagal terhubung ke server. Periksa koneksi internet kamu.");
    }
    alert(error.message);
  }
});

function displayForecast(data) {
      // Get one forecast per day (around noon)
      const dailyForecasts = data.list.filter(item => 
        item.dt_txt.includes("12:00:00")
      ).slice(0, 5);

      const html = dailyForecasts.map(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
        const icon = weatherIcons[forecast.weather[0].icon] || "🌤️";

        return `
          <div class="forecast-item">
            <div class="forecast-date">${dayName}</div>
            <div class="forecast-weather">
              <div class="forecast-icon">${icon}</div>
              <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            </div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
          </div>
        `;
      }).join('');

      document.getElementById("forecast-grid").innerHTML = html;
      forecastCard.style.display = "block";
}

textInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchWeather.click();
  }
});

function addHistory(city) {
  let history = JSON.parse(localStorage.getItem("Weather History")) || [];

  if (!history.includes(city)) {
    history.unshift(city);
    if (history.length > 10) history.pop();
    localStorage.setItem("Weather History", JSON.stringify(history));
  }
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("Weather History")) || [];

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML =
      '<div class="empty-state">Belum ada riwayat pencarian</div>';
    clearHistoryBtn.style.display = "none";
    return;
  }

  clearHistoryBtn.style.display = "block";

  history.forEach((city, index) => {
    const li = document.createElement("li");
    li.classList = "history-item";
    li.style.cursor = "pointer";

    const cityName = city.split(',')[0];

    li.innerHTML = `
              <div class="history-item-content">
                <span class="history-city-name">${city}</span>
              </div>
              <button class="delete-btn" onclick="deleteHistoryItem(${index}); event.stopPropagation();">×</button>
    `;

    li.onclick = (e) => {
      if(!e.target.classList.contains("delete-btn")) {
        textInput.value = cityName;
        searchWeather.click();
      }
    };
    historyList.appendChild(li);
  });
}

function deleteHistoryItem(index) {
  let history = JSON.parse(localStorage.getItem("Weather History")) || [];
  history.splice(index, 1);
  localStorage.setItem("Weather History", JSON.stringify(history));
  renderHistory()
} 

// Event listener untuk clear history button
clearHistoryBtn.addEventListener("click", () => {
  if(confirm("Apakah Anda yakin ingin menghapus semua riwayat?")) {
    localStorage.removeItem("Weather History");
    renderHistory();
  }
});


initTheme();
renderHistory();
