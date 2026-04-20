const sampleWeather = {
  London: {
    description: 'Light rain',
    temperature: 16,
    humidity: 74,
    windSpeed: 11,
  },
  'New York': {
    description: 'Mostly cloudy',
    temperature: 21,
    humidity: 66,
    windSpeed: 9,
  },
  Tokyo: {
    description: 'Clear sky',
    temperature: 24,
    humidity: 55,
    windSpeed: 6,
  },
  Sydney: {
    description: 'Sunny',
    temperature: 28,
    humidity: 48,
    windSpeed: 12,
  },
  Mumbai: {
    description: 'Humid and warm',
    temperature: 31,
    humidity: 78,
    windSpeed: 14,
  },
  Paris: {
    description: 'Foggy morning',
    temperature: 14,
    humidity: 82,
    windSpeed: 7,
  },
};

const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherCard = document.getElementById('weather-card');
const cityName = document.getElementById('city-name');
const weatherDescription = document.getElementById('weather-description');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const message = document.getElementById('message');

function showWeather(city) {
  const weather = sampleWeather[city];

  if (!weather) {
    weatherCard.classList.add('hidden');
    message.textContent = `No weather data found for "${city}". Try London, New York, Tokyo, Sydney, Mumbai, or Paris.`;
    message.style.color = '#ef4444';
    return;
  }

  cityName.textContent = city;
  weatherDescription.textContent = weather.description;
  temperature.textContent = `${weather.temperature}°C`;
  humidity.textContent = `${weather.humidity}%`;
  windSpeed.textContent = `${weather.windSpeed} km/h`;
  weatherCard.classList.remove('hidden');
  message.textContent = 'Weather data is shown from the app sample dataset.';
  message.style.color = '#6b7c93';
}

function handleSearch() {
  const query = cityInput.value.trim();

  if (!query) {
    message.textContent = 'Please enter a city name to see the weather.';
    message.style.color = '#ef4444';
    return;
  }

  const normalizedCity = Object.keys(sampleWeather).find(
    (city) => city.toLowerCase() === query.toLowerCase()
  );

  showWeather(normalizedCity || query);
}

searchButton.addEventListener('click', handleSearch);
cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
});
