const apiKey = "4c7239a9d9ea4062e74be572ed97dd8b";
const searchBtn = document.getElementById("cityBtn");
const cityList = document.getElementById("city-list");
const cities = [];
const cityDateEl = document.getElementById("city-date");
const iconEl = document.getElementById("cur-icon");
const tempEl = document.getElementById("cur-temp");
const windEl = document.getElementById("cur-wind");
const humidityEl = document.getElementById("cur-humidity");
const uvEl = document.getElementById("uv");
const forecastEl = $("#forecast");

function citySearch() {
  const searchInput = document.getElementById("city-input").value;

  if (!searchInput) {
    console.error("You need a search input value!");
    return;
  }

  const url =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    searchInput +
    "&appid=" +
    apiKey +
    "&limit=1";

  cities.unshift(searchInput);
  grabGeoData(url);
  renderCities();
}

function grabGeoData(url) {
  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const lat = data[0].lat;
      const lon = data[0].lon;
      const cityName = data[0].name;

      const dataUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=minutely,hourly,alerts&units=imperial" +
        "&appid=" +
        apiKey;
      grabWeatherData(dataUrl, cityName);
    });
}

function grabWeatherData(url, cityName) {
  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderCurrent(data, cityName);
      render5Day(data);
    });
}

function renderCurrent(data, cityName) {
  const curCity = cityName;
  const curDate = moment
    .unix(data.current.dt + data.timezone_offset)
    .format("[(]MM[/]DD[/]YYYY[)]");
  const curIconCode = data.current.weather[0].icon;
  const curIcon = "http://openweathermap.org/img/wn/" + curIconCode + "@2x.png";
  const curIconDesc = data.current.weather[0].description;
  const curTemp = data.current.temp;
  const curWind = data.current.wind_speed;
  const curHumidity = data.current.humidity;
  const curUv = data.current.uvi;

  cityDateEl.textContent = curCity + curDate;
  $("#cur-icon").attr({ src: curIcon, alt: curIconDesc });
  tempEl.textContent = "Temp: " + curTemp + "°F";
  windEl.textContent = "Wind: " + curWind + " MPH";
  humidityEl.textContent = "Humidity: " + curHumidity + " %";
  uvEl.textContent = curUv;
  if (curUv <= 2.99) {
    uvEl.className = "favorable";
  } else if (curUv >= 8) {
    uvEl.className = "severe";
  } else {
    uvEl.className = "moderate";
  }
}

function render5Day(data) {
  console.log(data);
  forecastEl.empty();
  for (let i = 1; i < 6; i++) {
    const date = moment
      .unix(data.daily[i].dt + data.timezone_offset)
      .format("MM[/]DD[/]YYYY");
    const iconCode = data.daily[i].weather[0].icon;
    const icon = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    const iconDesc = data.daily[i].weather[0].description;
    const wind = data.daily[i].wind_speed;
    const humidity = data.daily[i].humidity;
    const temp = data.daily[i].temp.day;

    const divEl = $("<div>").addClass("col five-day");
    const dateEl = $("<h2>").text(date);
    const iconEl = $("<img>").attr({ src: icon, alt: iconDesc });
    const tempEl = $("<p>").text("Temp: " + temp + " °F");
    const windEl = $("<p>").text("Wind: " + wind + "MPH");
    const humidityEl = $("<p>").text("Humidity: " + humidity + " %");

    divEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
    forecastEl.append(divEl);
  }
}

function renderCities() {
  cityList.innerHTML = "";
  for (i = 0; i < cities.length; i++) {
    const cityButton = document.createElement("button");
    cityButton.classList.add(
      "col-12",
      "btn",
      "btn-primary",
      "btn-block",
      "recent-city"
    );
    cityButton.textContent = cities[i];

    cityList.append(cityButton);
  }
}
renderCities();
searchBtn.addEventListener("click", citySearch);
