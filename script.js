const apiKey = "3811de17c98d9d47a56e1f2e4f0808e3";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const textInput = document.getElementById("text-input");
const searchWeather = document.getElementById("search-weather");

searchWeather.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!textInput.value.trim()) {
    alert("Mohon dimasukan nama kota!");
    return;
  }

  result.innerHTML = "<p>Loading...</p>";

  
  try {
    const response = await fetch(`${baseUrl}?q=${textInput.value}&appid=${apiKey}&units=metric`);
    
    if (!response.ok) {
      throw new Error(`Kota tidak ditemukan (Status: ${response.status})`);
    }
    const data = await response.json();
    console.log("Data Weather: ", data);

    let result = document.getElementById("result");

    result.innerHTML = `
              <h2>${data.name}, ${data.sys.country}</h2>
              <h3><span>${Math.round(data.main.temp)}°С</span> <span>${data.weather[0].description}</span></h3>
              <p>Temperature from ${Math.round(data.main.temp_min)}°С to ${Math.round(data.main.temp_max)}°С</p>
              <h5>Wind Speed: ${data.wind.speed} m/s</h5>
              <h5>Clouds: ${data.clouds.all}%</h5>
              <h4>Geo Coordinates: [${data.coord.lat}, ${data.coord.lon}]</h4>

    `;
  } catch (error) {
    if(error.message.includes("Failed to fetch")) {
      alert("Gagal terhubung ke server. Periksa koneksi internet kamu.");
    }
    alert(error.message);
  }
});

textInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchWeather.click();
  }
});
