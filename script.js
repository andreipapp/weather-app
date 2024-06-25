const api_key = 'a0dcff29dce840aba5c80555242506';
const baseURL = 'https://api.weatherapi.com/v1'
let city = 'london';

const search = document.querySelector('button');
const input = document.getElementById('city');
const container = document.querySelector('.container');
const upper = document.querySelector('.upper');
const lower = document.querySelector('.lower');


async function getWeather(city) {
    try {
        const response = await fetch(`${baseURL}/forecast.json?key=${api_key}&q=${city}`);
        const data = await response.json();
        return processData(data);
    } catch (e) {
        console.error('Error fetching data: ', e);
    }

}


function processData(data) {
    return {
        location: data.location.name,
        condition: data.current.condition.text,
        celsius: data.current.temp_c,
        fahrenheit: data.current.temp_f,
        localtime: data.location.localtime,
        forecast: data.forecast.forecastday[0].hour,
        icon: data.current.condition.icon
    }
}
(async () => {
    const place = await getWeather('bucharest');
    loadWeather(place);
})();

search.addEventListener('click', async (e) => {
    e.preventDefault();
    if (input.value.trim() !== '') {
        const city = await getWeather(input.value.trim());
        console.log(city);
        loadWeather(city)
        input.value = '';
    } else {
        alert('please enter a city!!');
    }

})

function loadWeather(data) {
    upper.innerHTML = '';
    lower.innerHTML = ''; // Clear previous forecast cards

    const icon = document.createElement('img');
    icon.classList.add('bigImg');
    const temperature = document.createElement('div');
    temperature.classList.add('upper-temperature');
    const cityName = document.createElement('div');
    cityName.classList.add('name');

    const date = document.createElement('div');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    date.textContent = `${hours}:${minutes}`;

    icon.src = data.icon;
    temperature.textContent = `${data.celsius.toPrecision(2)}°C`;
    cityName.textContent = data.location;
    cityName.appendChild(date);

    upper.appendChild(icon);
    upper.appendChild(temperature);
    upper.appendChild(cityName);

    const currentHour = new Date().getHours();

    data.forecast.forEach((forecast) => {
        const time = new Date(forecast.time);
        const forecastHour = time.getHours();

        if (forecastHour >= currentHour) {
            const card = document.createElement('div');
            card.classList.add('card');
            const hour = document.createElement('span');
            const icon = document.createElement('img');
            const temperature = document.createElement('div');

            hour.textContent = forecastHour.toString().padStart(2, '0');
            icon.src = forecast.condition.icon;
            temperature.textContent = `${forecast.temp_c.toPrecision(2)}°C`;

            card.appendChild(hour);
            card.appendChild(icon);
            card.appendChild(temperature);
            lower.appendChild(card);
        }
    });

    container.appendChild(upper);
    container.appendChild(lower);
}
