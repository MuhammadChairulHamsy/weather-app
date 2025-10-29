const textInput = document.getElementById("text-input");
const searchWeather = document.getElementById("search-weather");

searchWeather.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!textInput.value.trim()) {
    alert("Mohon dimasukan nama kota!");
    return;
  }
  try {
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        textInput.value +
        "&appid=2253101b3e89e67c0ec3f1202fbe699e&units=metric"
    );

    if (!response.ok) {
      throw new Error("Kota tidak ditemukan", response.status);
    }
    const data = await response.json();
    console.log("Data Weather: ", data);

    let result = document.getElementById("result");

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
  } catch (error) {
    alert(error.message);
  }
});

textInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchWeather.click();
  }
});
