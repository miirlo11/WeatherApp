const API_KEY = 'your_api_key_here';

export async function fetchWeather(latitude, longitude) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
  );

  const data = await response.json();

  if (response.ok) {
    return { weather: data, country: data.sys.country };
  } else {
    throw new Error(data.message);
  }
}
