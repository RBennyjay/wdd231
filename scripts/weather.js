//  HTML elements 
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// API key
const apiKey = "dfad8b8e26d4e7aa1726ad4b6c57b365"; 
const lat = 49.75;  
const lon = 6.64;   
const units = "imperial"; 

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

// Async fetch function
async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // For testing
      displayResults(data);
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
}

function displayResults(data) {
    currentTemp.innerHTML = `${data.main.temp.toFixed(1)}&deg;F`; 
    const icon = data.weather[0].icon;
    const desc = data.weather[0].description;
  
  

    const iconsrc = `https://openweathermap.org/img/w/${icon}.png`;

    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    captionDesc.textContent = desc.charAt(0).toUpperCase() + desc.slice(1); 
  }
  

apiFetch();
