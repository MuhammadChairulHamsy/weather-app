import { fetchWeather, fetchForecast } from "./api.js";
import { addHistory } from "./history.js";

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

export async function showWeather(city) {
  const result = document.getElementById("result");
  result.innerHTML = "<p>Loading...</p>";

  try {
    const data = await fetchWeather(city);
    const forecastData = await fetchForecast(city);

    result.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <h3><span>${Math.round(data.main.temp)}°С</span> <span>${data.weather[0].description}</span></h3>
      <p>Temperature from ${Math.round(data.main.temp_min)}°С to ${Math.round(data.main.temp_max)}°С</p>
      <h5>Wind Speed: ${data.wind.speed} m/s</h5>
      <h5>Clouds: ${data.clouds.all}%</h5>
      <h4>Geo Coordinates: [${data.coord.lat}, ${data.coord.lon}]</h4>
    `;
    displayForecast(forecastData);
    addHistory(data.name);
  } catch (err) {
    result.innerHTML = "";
    alert(err.message);
  }
}

function displayForecast(data) {
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
  document.getElementById("forecast-card").style.display = "block";
}
