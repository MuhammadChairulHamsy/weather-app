// BELUM ADD GITHUB

const apiKey = "3811de17c98d9d47a56e1f2e4f0808e3";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const textInput = document.getElementById("text-input");
const searchWeather = document.getElementById("search-weather");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

searchWeather.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!textInput.value.trim()) {
    alert("Mohon dimasukan nama kota!");
    return;
  }

  // Pindahkan deklarasi result ke atas
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
      <h3><span>${Math.round(data.main.temp)}°С</span> <span>${
      data.weather[0].description
    }</span></h3>
      <p>Temperature from ${Math.round(
        data.main.temp_min
      )}°С to ${Math.round(data.main.temp_max)}°С</p>
      <h5>Wind Speed: ${data.wind.speed} m/s</h5>
      <h5>Clouds: ${data.clouds.all}%</h5>
      <h4>Geo Coordinates: [${data.coord.lat}, ${data.coord.lon}]</h4>
    `;
    addHistory(data.name);
  } catch (error) {
    result.innerHTML = ""; // Clear loading
    if (error.message.includes("Failed to fetch")) {
      alert("Gagal terhubung ke server. Periksa koneksi internet kamu.");
    } else {
      alert(error.message);
    }
  }
});

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
    historyList.innerHTML = '<div class="empty-state">Belum ada riwayat pencarian</div>';
    clearHistoryBtn.style.display = "none"; 
    return;
  }

  clearHistoryBtn.style.display = "block"; // Perbaikan: gunakan .style.display
  
  history.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.className = "history-item"; // Tambahkan class untuk styling
    li.style.cursor = "pointer";
    li.onclick = () => {
      textInput.value = city;
      searchWeather.click();
    };
    historyList.appendChild(li);
  });
}

// Event listener untuk clear history button
clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Apakah Anda yakin ingin menghapus semua riwayat?")) {
    localStorage.removeItem("Weather History");
    renderHistory();
  }
});

renderHistory();