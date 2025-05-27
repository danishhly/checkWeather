const weatherForm = document.querySelector(".weatherForm");
const locationButton = document.getElementById("locationButton");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "3c9df5f39d5f85a4ef0824adff71ab7b";

locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const weatherData = await getWeatherDataByCoords(lat, lon);
                displayWeatherInfo(weatherData);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                displayError("Could not fetch weather for your location.");
            }
        }, error => {
            displayError("Permission denied or location unavailable.");
        });
    } else {
        displayError("Geolocation not supported by your browser.");
    }
});
async function getWeatherDataByCoords(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Weather data fetch error");
    }
    return await response.json();
}

weatherForm.addEventListener("submit", async event => {
event.preventDefault();
const city = cityInput.value;

if (city) {
    try {
        const weatherData = await getWeatherData(city);
        displayWeatherInfo(weatherData);
    } 
    catch(error) {
        console.error('Error fetching weather data:', error);
        displayError(error);
    }
}
else {
    displayError("Please enter a city name.");
}
    }); 

async function getWeatherData(city) {
 const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Enter The Correct City Name`);

    }
    return await response.json();
}

function displayWeatherInfo(data) {

     const { name: city,
         main: { temp, humidity },
         weather: [{ description, id }] } = data;

         card.textContent = "";
         card.style.display = "flex";
         // Clear old content and styles
card.textContent = "";
card.className = "card"; // reset all weather-related classes

// Determine weather class
let weatherClass = "";
if (id >= 200 && id < 300) weatherClass = "thunderstorm";
else if (id >= 300 && id < 600) weatherClass = "rainy";
else if (id >= 600 && id < 700) weatherClass = "snowy";
else if (id >= 700 && id < 800) weatherClass = "misty";
else if (id === 800) weatherClass = "sunny";
else if (id > 800) weatherClass = "cloudy";

// Apply the style
card.classList.add(weatherClass);


        const cityDisplay = document.createElement("h2");
        const tempDisplay = document.createElement("p");
        const humidityDisplay = document.createElement("p");
        const descDisplay = document.createElement("p");
        const weatherEmoji = document.createElement("p");

        cityDisplay.textContent = `Weather in ${city}`;
        tempDisplay.textContent = `Temperature: ${temp}°C`;
        humidityDisplay.textContent = `Humidity: ${humidity}%`;
        descDisplay.textContent = `Description: ${description}`;
        weatherEmoji.textContent = getWeatherEmoji(id);

        cityDisplay.classList.add('cityDisplay');
        tempDisplay.classList.add('tempDisplay');
        humidityDisplay.classList.add('humidityDisplay');
        descDisplay.classList.add('descDisplay');


        card.appendChild(cityDisplay);
        card.appendChild(tempDisplay);
        card.appendChild(humidityDisplay);
        card.appendChild(descDisplay);
        card.appendChild(weatherEmoji);


     }


function getWeatherEmoji(weatherId){

    if (weatherId >= 200 && weatherId < 300) {
        return "🌩️"; // Thunderstorm
    } else if (weatherId >= 300 && weatherId < 400) {
        return "⛈️"; // Drizzle
    } else if (weatherId >= 500 && weatherId < 600) {
        return "🌧️"; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
        return "❄️"; // Snow
    } else if (weatherId >= 700 && weatherId < 800) {
        return "🌫️"; // Atmosphere
    } else if (weatherId === 800) {
        return "☀️"; // Clear
    } else if (weatherId > 800) {
        return "🌤️ "; // Clouds
    }
    return "?"; // Default case  
}

function displayError(message) {

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add('errorDisplay');
   

    card.textContent = "";
    card.style.display = 'flex';
     card.appendChild(errorDisplay);

}
