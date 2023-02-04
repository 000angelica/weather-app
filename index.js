let now = new Date();

let currentDate = document.querySelector("#current-date-id");

let date = now.getDate();
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

let months = [
  "Jan.",
  "Feb.",
  "March.",
  "April",
  "May",
  "June",
  "July",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec.",
];
let month = months[now.getMonth()];

currentDate.innerHTML = `${day} ${month} ${date}, ${hours}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  console.log("forecast: ", forecast);
  let forecastElement = document.querySelector("#forecast-id");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 4) {
      forecastHTML =
        forecastHTML +
        `
            <div class="col-2">
              <div class="weather-forecast-day">${formatDay(
                forecastDay.time
              )}</div>
              <img 
                src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                  forecast[0].condition.icon
                }.png" alt="" width="40" 
              />
              <div class="weather-forecast-temp">
                <span class="weather-forecast-temp-max"> ${Math.round(
                  forecastDay.temperature.maximum
                )}
                  ° H  
                </span>
                <span class="weather-forecast-temp-min"> ${Math.round(
                  forecastDay.temperature.minimum
                )}
                  ° L
                </span>
              </div>
            </div>
          `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
//
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "4368ot5e9149d5a5bd05b09133f063bf";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  console.log(response.data);

  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.temperature.current
  );
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.condition.description;

  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.temperature;

  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  iconElement.setAttribute("alt", response.data.condition.icon);
  getForecast(response.data.coordinates);
}

function searchCity(city) {
  let apiKey = "4368ot5e9149d5a5bd05b09133f063bf";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input");
  searchCity(city.value);
}

let searchForm = document.querySelector("#search-form-id");
searchForm.addEventListener("submit", handleSubmit);

searchCity("Minneapolis");
