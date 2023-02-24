const container = document.querySelector(`.container`);
const form = document.querySelector(`form`);
const search = document.querySelector(`input[type="search"]`);
const zipPattern = `[0-9]{5}`;
const cityPattern = `[A-Za-z]{1,}`;
const statePattern = /[,\s]\s*[A-Za-z]{2}/;
const submit = document.querySelector(`button[type="submit"]`);
const results = document.querySelector(`.results`);
const currentCity = document.querySelector(`#current-city`);
const currentTime = document.querySelector(`#current-time`);
const currentTemp = document.querySelector(`#current-temp`);
const feelsLike = document.querySelector(`#feels-like`);
const currentType = document.querySelector(`#current-type`);
const weatherConditions = ["Clear sky", "Clouds", "Rain", "Thundershowers", "Snow"];
const periodsOfDay = ["Dawn", "Morning", "Afternoon", "Evening", "Dusk", "Night"];
// `api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid=d209e24ecb543c083e0ec02a080a29f3`;

const apiObject = (json) => {
  const apiObj = {
    base: json.base,
    main: {
      temp: json.main.temp,
      feels_like: json.main["feels_like"],
      temp_min: json.main["temp_min"],
      temp_max: json.main["temp_max"],
      pressure: json.main.pressure,
      humidity: json.main.humidity,
    },
    visibility: json.visibility,
    wind: {
      speed: json.wind.speed,
      deg: json.wind.deg,
      gust: json.wind.gust,
    },
    clouds: {
      all: json.clouds.all,
    },
    dt: json.dt,
    sys: {
      type: json.sys.type,
      id: json.sys.id,
      country: json.sys.country,
      sunrise: json.sys.sunrise,
      sunset: json.sys.sunset,
    },
    timezone: json.timezone,
    id: json.id,
    name: json.name,
    cod: json.cod,
  };
  return apiObj;
};

const createWeatherObject = (jsonData) => {
  const fahrenheit = (kelvin) => kelvin * 1.8 - 459.67;
  let kelvinTemp = jsonData.main.temp;
  let fahrenheitTemp = fahrenheit(kelvinTemp);
  let kelvinFeelsLike = jsonData.main["feels_like"];
  let fahrenheitFeelsLike = fahrenheit(kelvinFeelsLike);
  let kelvinMin = jsonData.main["temp_min"];
  let fahrenheitMin = fahrenheit(kelvinMin);
  let kelvinMax = jsonData.main["temp_max"];
  let fahrenheitMax = fahrenheit(kelvinMax);
  let weatherObject = {
    city: jsonData.name,
    currentTime: new Date().toLocaleTimeString("en-US"),
    weatherType: jsonData.weather[0].main,
    weatherDescription: jsonData.weather[0].description,
    temperature: `${fahrenheitTemp.toFixed(2)}℉`,
    tempFeelsLike: `${fahrenheitFeelsLike.toFixed(2)}℉`,
    humidity: `${jsonData.main.humidity}%`,
  };
  return weatherObject;
};

const fillWeatherFields = (weatherObj) => {
  currentCity.textContent = weatherObj.city;
  currentTime.textContent = weatherObj.currentTime;
  currentTemp.textContent = weatherObj.temperature;
  currentType.textContent = weatherObj.weatherType;
  feelsLike.textContent = `Feels like ${weatherObj.tempFeelsLike}`;
};

const searchZipcode = () => {
  let searchValue = search.value;
  return fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=${searchValue}&appid=d209e24ecb543c083e0ec02a080a29f3`, {
    mode: "cors",
  })
    .then((response) => response.json())
    .then((location) =>
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location["lat"]}&lon=${location["lon"]}&appid=d209e24ecb543c083e0ec02a080a29f3`
      ).then((weatherResponse) => weatherResponse.json())
    )
    .then((json) => {
      let weatherObject = createWeatherObject(json);
      fillWeatherFields(weatherObject);
    });
};

const searchCity = () => {
  let searchValue = search.value;
  let city = searchValue.match(cityPattern);
  let stateCode = searchValue.match(statePattern);
  return fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}${stateCode},us&limit=1&appid=d209e24ecb543c083e0ec02a080a29f3`,
    {
      mode: "cors",
    }
  )
    .then((response) => response.json())
    .then((location) =>
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location[0]["lat"]}&lon=${location[0]["lon"]}&appid=d209e24ecb543c083e0ec02a080a29f3`
      ).then((weatherResponse) => weatherResponse.json())
    )
    .then((json) => {
      let weatherObject = createWeatherObject(json);
      fillWeatherFields(weatherObject);
    });
};

http: submit.addEventListener("click", (e) => {
  e.preventDefault();
  let searchValue = search.value;
  if (searchValue.match(zipPattern)) {
    searchZipcode();
  } else searchCity();
});
