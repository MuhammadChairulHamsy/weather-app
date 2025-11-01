const apiKey = "3811de17c98d9d47a56e1f2e4f0808e3";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const textInput = document.getElementById("text-input");
const searchWeather = document.getElementById("search-weather");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");
const themeToggle = document.getElementById("theme-toggle");

// ============ THEME MANAGEMENT ============
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  const icon = themeToggle.querySelector('.theme-icon');
  const text = themeToggle.querySelector('span:not(.theme-icon)');
  
  if (theme === 'dark') {
    icon.textContent = '☀️';
    if (text) text.textContent = 'Light Mode';
  } else {
    icon.textContent = '🌙';
    if (text) text.textContent = 'Dark Mode';
  }
}

function initTheme() {
  // Cek saved preference dulu
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Auto-detect berdasarkan waktu
    const hour = new Date().getHours();
    const prefersDark = hour >= 18 || hour < 6;
    setTheme(prefersDark ? 'dark' : 'light');
  }
}

// Toggle theme manual
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// ============ WEATHER SEARCH ============
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
    console.log("Data Weather: ", data);

    result.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <h3><span>${Math.round(data.main.temp)}°С</span> <span>${data.weather[0].description}</span></h3>
      <p>Temperature from ${Math.round(data.main.temp_min)}°С to ${Math.round(data.main.temp_max)}°С</p>
      <h5>Wind Speed: ${data.wind.speed} m/s</h5>
      <h5>Clouds: ${data.clouds.all}%</h5>
      <h4>Geo Coordinates: [${data.coord.lat}, ${data.coord.lon}]</h4>
    `;
    
    addHistory(data.name, data.sys.country);

  } catch (error) {
    result.innerHTML = "";
    
    if (error.message.includes("Failed to fetch")) {
      alert("Gagal terhubung ke server. Periksa koneksi internet kamu.");
    } else {
      alert(error.message);
    }
  }
});

// Enter key support
textInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchWeather.click();
  }
});

// ============ HISTORY MANAGEMENT ============
function addHistory(city, country) {
  let history = JSON.parse(localStorage.getItem("Weather History")) || [];
  
  const cityWithCountry = `${city}, ${country}`;

  // Hapus entry lama jika ada (untuk avoid duplikat)
  history = history.filter(item => item !== city && item !== cityWithCountry);
  
  // Tambah di awal
  history.unshift(cityWithCountry);
  
  // Batasi maksimal 10 history
  if (history.length > 10) history.pop();
  
  localStorage.setItem("Weather History", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("Weather History")) || [];

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = '<div class="empty-state">Belum ada riwayat pencarian</div>';
    clearHistoryBtn.style.display = "none";
    return;
  }

  clearHistoryBtn.style.display = "block";

  history.forEach((city, index) => {
    const li = document.createElement("li");
    li.className = "history-item";
    li.style.cursor = "pointer";
    
    // Split city name (remove country code for display)
    const cityName = city.split(',')[0];
    
    li.innerHTML = `
      <div class="history-item-content">
        <span class="history-city-name">${city}</span>
      </div>
      <button class="delete-btn" onclick="deleteHistoryItem(${index}); event.stopPropagation();">×</button>
    `;
    
    li.onclick = (e) => {
      if (!e.target.classList.contains('delete-btn')) {
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
  renderHistory();
}

// Clear all history
clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Apakah Anda yakin ingin menghapus semua riwayat?")) {
    localStorage.removeItem("Weather History");
    renderHistory();
  }
});

// ============ INITIALIZATION ============
initTheme();
renderHistory();