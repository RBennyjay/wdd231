document.addEventListener('DOMContentLoaded', () => {
    // OPENWEATHERMAP_API_KEY' 
    const API_KEY = 'dfad8b8e26d4e7aa1726ad4b6c57b365'; 
    const LATITUDE = 6.60; 
    const LONGITUDE = 3.35;

    // --- Utility function to map OpenWeatherMap icon codes/conditions to Font Awesome icons ---
    function getFontAwesomeIcon(weatherCode) {
        
        switch (true) {
            // Thunderstorm
            case weatherCode >= 200 && weatherCode <= 232: return 'fas fa-bolt';
            // Drizzle
            case weatherCode >= 300 && weatherCode <= 321: return 'fas fa-cloud-drizzle';
            // Rain
            case weatherCode >= 500 && weatherCode <= 531: return 'fas fa-cloud-showers-heavy';
            // Snow
            case weatherCode >= 600 && weatherCode <= 622: return 'fas fa-snowflake';
            // Atmosphere (Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, Tornado)
            case weatherCode >= 701 && weatherCode <= 781: return 'fas fa-smog';
            // Clear
            case weatherCode === 800: return 'fas fa-sun'; // Clear sky
            // Clouds
            case weatherCode === 801: return 'fas fa-cloud-sun'; // Few clouds
            case weatherCode === 802: return 'fas fa-cloud'; // Scattered clouds
            case weatherCode === 803: return 'fas fa-cloud'; // Broken clouds
            case weatherCode === 804: return 'fas fa-cloud-meatball'; // Overcast clouds 
            // Default (if no match)
            default: return 'fas fa-question-circle'; // Unknown or generic icon
        }
    }

    // --- Utility function to format time (e.g., 7:50 AM) ---
    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'
        const mins = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${mins}${ampm}`;
    }

    // --- Function to fetch and display current weather ---
    async function getCurrentWeather() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${API_KEY}&units=metric`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            
            document.getElementById('current-temp').textContent = Math.round(data.main.temp);
            document.getElementById('current-condition').textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1); // Capitalize first letter
            document.getElementById('current-humidity').textContent = data.main.humidity;
            document.getElementById('current-wind-speed').textContent = (data.wind.speed * 3.6).toFixed(1); // Convert m/s to km/h, 1 decimal place

            // Convert wind degrees to cardinal direction (simplified)
            const windDeg = data.wind.deg;
            let windDirection = '';
            if (windDeg > 337.5 || windDeg <= 22.5) windDirection = 'N';
            else if (windDeg > 22.5 && windDeg <= 67.5) windDirection = 'NE';
            else if (windDeg > 67.5 && windDeg <= 112.5) windDirection = 'E';
            else if (windDeg > 112.5 && windDeg <= 157.5) windDirection = 'SE';
            else if (windDeg > 157.5 && windDeg <= 202.5) windDirection = 'S';
            else if (windDeg > 202.5 && windDeg <= 247.5) windDirection = 'SW';
            else if (windDeg > 247.5 && windDeg <= 292.5) windDirection = 'W';
            else if (windDeg > 292.5 && windDeg <= 337.5) windDirection = 'NW';
            document.getElementById('current-wind-direction').textContent = windDirection;

            // Sunrise and Sunset
            document.getElementById('current-sunrise').textContent = formatTime(data.sys.sunrise);
            document.getElementById('current-sunset').textContent = formatTime(data.sys.sunset);

            // Update Font Awesome icon
            const weatherIconElement = document.getElementById('current-weather-icon');
            weatherIconElement.className = getFontAwesomeIcon(data.weather[0].id); // Use weather ID for mapping
        } catch (error) {
            console.error('Error fetching current weather:', error);
            // Display fallback content
            document.getElementById('current-temp').textContent = '--';
            document.getElementById('current-condition').textContent = 'Failed to load';
            document.getElementById('current-humidity').textContent = '--';
            document.getElementById('current-wind-speed').textContent = '--';
            document.getElementById('current-wind-direction').textContent = '--';
            document.getElementById('current-sunrise').textContent = '--';
            document.getElementById('current-sunset').textContent = '--';
            document.getElementById('current-weather-icon').className = 'fas fa-exclamation-triangle'; // Error icon
        }
    }

    // --- Function to fetch and display 3-day forecast weather ---
    async function getForecastWeather() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${API_KEY}&units=metric`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            
            const forecastList = data.list;
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today to start of day

            // an array to hold forecast data for the next 3 days
            const dailyForecasts = [];
            const processedDates = new Set(); // To ensure we only get one entry per day 

            
            for (let i = 0; i < forecastList.length; i++) {
                const item = forecastList[i];
                const itemDate = new Date(item.dt * 1000);
                const forecastDayKey = itemDate.toLocaleDateString(); // "MM/DD/YYYY"
                
                
                if (itemDate.getTime() > today.getTime() && !processedDates.has(forecastDayKey) && item.dt_txt.includes('12:00:00')) {
                    dailyForecasts.push({
                        date: itemDate,
                        temp: item.main.temp,
                        description: item.weather[0].description,
                        iconId: item.weather[0].id
                    });
                    processedDates.add(forecastDayKey);
                }
                // Stop if we have enough days
                if (dailyForecasts.length === 3) break;
            }

            
            for (let i = 0; i < 3; i++) {
                const dayIndex = i + 1; // Corresponds to day1, day2, day3
                const forecastData = dailyForecasts[i];

                if (forecastData) {
                    const dayLabel = forecastData.date.toLocaleDateString('en-US', { weekday: 'long' });
                    document.getElementById(`forecast-day${dayIndex}-label`).textContent = dayLabel;
                    document.getElementById(`forecast-day${dayIndex}-temp`).textContent = Math.round(forecastData.temp);
                    document.getElementById(`forecast-day${dayIndex}-condition`).textContent = forecastData.description.charAt(0).toUpperCase() + forecastData.description.slice(1);
                    document.getElementById(`forecast-day${dayIndex}-icon`).className = getFontAwesomeIcon(forecastData.iconId);
                } else {
                    // Fallback if data for a day isn't available (e.g., API doesn't provide enough future data points)
                    document.getElementById(`forecast-day${dayIndex}-label`).textContent = `Day ${dayIndex}`; // "Day 1", "Day 2", "Day 3"
                    document.getElementById(`forecast-day${dayIndex}-temp`).textContent = '--';
                    document.getElementById(`forecast-day${dayIndex}-condition`).textContent = 'N/A';
                    document.getElementById(`forecast-day${dayIndex}-icon`).className = 'fas fa-exclamation-triangle';
                }
            }

        } catch (error) {
            console.error('Error fetching forecast weather:', error);
            // Display fallback content for all forecast days
            for (let i = 1; i <= 3; i++) {
                document.getElementById(`forecast-day${i}-label`).textContent = `Day ${i}`;
                document.getElementById(`forecast-day${i}-temp`).textContent = '--';
                document.getElementById(`forecast-day${i}-condition`).textContent = 'Failed to load';
                document.getElementById(`forecast-day${i}-icon`).className = 'fas fa-exclamation-triangle';
            }
        }
    }

    // functions to fetch weather data when the page loads
    getCurrentWeather();
    getForecastWeather();
});