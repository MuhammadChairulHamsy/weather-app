export const apiKey = "3811de17c98d9d47a56e1f2e4f0808e3";
export const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
export const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

export async function fetchWeather(city) {
  const res = await fetch(`${baseUrl}?q=${city}&appid=${apiKey}&units=metric`);
  if (!res.ok) throw new Error("Kota tidak ditemukan");
  return await res.json();
}

export async function fetchForecast(city) {
  const res = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`);
  if (!res.ok) throw new Error("Data forecast tidak ditemukan");
  return await res.json();
}
