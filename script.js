"use strict";

const imgResult = document.querySelector(".results-img");
const output = document.querySelector("output");
const resultsImg = document.querySelector(".results-img");
const results = document.querySelector(".results");
const temperatureCheckbox = document.querySelector("#temperature-cb");
const humidityCheckbox = document.querySelector("#humidity-cb");
const windSpeedCheckbox = document.querySelector("#wind-speed-cb");
const cityInput = document.querySelector("#city");
const stateInput = document.querySelector("#state");
const countryInput = document.querySelector("#country");
const getAirQualityBtn = document.querySelector(".get-aq-btn");
const form = document.querySelector("form");

const API_KEY = "16e25f43-45a1-41ab-95a6-183b9accb4c5";

form.addEventListener("submit", fetchAirQuality);

function fetchAirQuality(e) {
    e.preventDefault();
 
    const city = cityInput.value;
    const state = stateInput.value;
    const country = countryInput.value;

    let url = `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${API_KEY}`;

    const isTemperatureBoxChecked = temperatureCheckbox.checked;
    const isHumidityBoxChecked = humidityCheckbox.checked;
    const isWindSpeedBoxChecked = windSpeedCheckbox.checked;

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
          clearDisplay();

          const airQuality = document.createElement("div");
          airQuality.textContent = `Air Quality (US AQI): ${json.data.current.pollution.aqius}`;
          results.appendChild(airQuality);

          updateImage(json.data.current.pollution.aqius);

          if (temperatureCheckbox.checked) {
            const temperature = document.createElement("div");
            temperature.textContent = `Temperature: ${convertToFahrenheit(json.data.current.weather.tp)}°F`;
            results.appendChild(temperature);
          }

          if (humidityCheckbox.checked) {
            const humidityPercentage = document.createElement("div");
            humidityPercentage.textContent = `Humidity: ${json.data.current.weather.hu}%`;
            results.appendChild(humidityPercentage);
          }

          if (windSpeedCheckbox.checked) {
            const windSpeed = document.createElement("div");
            windSpeed.textContent = `Wind speed: ${convertToMPH(json.data.current.weather.ws)}mph`;
            results.appendChild(windSpeed);
          }
      })
      .catch((error) => {
        clearDisplay();

        const failed = document.createElement("p");
        failed.textContent = `Re-enter input.`;

        results.appendChild(failed);
      });
}

function updateImage(airQuality) {
  if (airQuality >= 0 && airQuality <= 50) {
    resultsImg.style.backgroundImage = "url(./images/verygood.png)";
  } else if (airQuality > 50 && airQuality <= 100) {
    resultsImg.style.backgroundImage = "url(./images/ok.png)";
  } else {
    resultsImg.style.backgroundImage = "url(./images/nobueno.png)";
  }
}

function convertToMPH(metersPerSecond) {
  return (metersPerSecond / 0.44704).toFixed(1);
}

function convertToFahrenheit(celsius) {
  return Math.round((celsius * (9/5.0)) + 32);
}

function clearDisplay() {
  while (results.firstChild) {
    results.firstChild.remove();
  }
}