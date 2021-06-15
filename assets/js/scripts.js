// variable declaration
var searchCity = $('#search-city');
var searchButton = $('#search-button');
var clearButton = $('#clear-history');
var currentCity = $('#current-city');
var currentTemperature = $('#temperature');
var currentHumidty = $('#humidity');
var currentWSpeed = $('#wind-speed');
var currentUvindex = $('#uv-index');
var sCity = [];
var apiKey = 'bc2194bf2b678d6ec02f05146c48236e';

function getCityElement() {
	var city = searchCity.val().trim();

	if (city) {
		getWeatherRepos(city);
	} else {
		alert('Please enter a city');
	}
}

// Here we create the AJAX call
function getWeatherRepos(city) {
	// Here we build the URL so we can get a data from server side.
	var apiUrl =
		'https://api.openweathermap.org/data/2.5/weather?q=' +
		city +
		'&appid=' +
		apiKey;

	fetch(apiUrl)
		.then(function (response) {
			if (response.ok) {
				console.log(response);
				response.json().then(function (data) {
					console.log(data);
					var weathericon = data.weather[0].icon;
					var iconurl =
						'https://openweathermap.org/img/wn/' + weathericon + '@2x.png';

					var date = new Date(data.dt * 1000).toLocaleDateString();
					$(currentCity).html(
						data.name + '(' + date + ')' + '<img src=' + iconurl + '>'
					);
					var tempInFahrenheit = (data.main.temp - 273.15) * 1.8 + 32;
					$(currentTemperature).html(tempInFahrenheit.toFixed(2) + '&#8457');
					// Display the Humidity
					$(currentHumidty).html(data.main.humidity + '%');
					//Display Wind speed and convert to MPH
					var windSpeed = data.wind.speed;
					var windSpeedMph = (windSpeed * 2.237).toFixed(1);
					$(currentWSpeed).html(windSpeedMph + 'MPH');
					getUVIndexRepo(data.coord.lon, data.coord.lat);
					console.log(weathericon);
					console.log(iconurl);
					console.log(date);
				});
			} else {
				alert('Error: ' + response.statusText);
			}
		})
		.catch(function (error) {
			alert('Unable to connect to API');
		});
}

function getUVIndexRepo(lon, lat) {
	var apiUrl =
		'https://api.openweathermap.org/data/2.5/uvi?appid=' +
		apiKey +
		'&lat=' +
		lat +
		'&lon=' +
		lon;

	fetch(apiUrl)
		.then(function (response) {
			if (response.ok) {
				console.log(response);
				response.json().then(function (data) {
					console.log(data);
					uvIndex = data.value;
					// uvIndex = 5;
					$(currentUvindex).html(uvIndex);

					changeUVIndexColor(uvIndex);
				});
			} else {
				alert('Error: ' + response.statusText);
			}
		})
		.catch(function (error) {
			alert('Unable to connect to API');
		});
}

function changeUVIndexColor(uv) {
	if (uv >= 0 && uv <= 2) {
		$(currentUvindex).removeClass('yellow');
		$(currentUvindex).removeClass('orange');
		$(currentUvindex).removeClass('red');
		$(currentUvindex).removeClass('text-dark');
		$(currentUvindex).addClass('green');
		$(currentUvindex).addClass('text-light');
	} else if (uv >= 3 && uv <= 5) {
		$(currentUvindex).removeClass('green');
		$(currentUvindex).removeClass('orange');
		$(currentUvindex).removeClass('red');
		$(currentUvindex).removeClass('text-light');
		$(currentUvindex).addClass('yellow');
		$(currentUvindex).addClass('text-dark');
	} else if (uv >= 6 && uv <= 7) {
		$(currentUvindex).removeClass('green');
		$(currentUvindex).removeClass('yellow');
		$(currentUvindex).removeClass('red');
		$(currentUvindex).removeClass('text-dark');
		$(currentUvindex).addClass('orange');
		$(currentUvindex).addClass('text-light');
	} else {
		$(currentUvindex).removeClass('green');
		$(currentUvindex).removeClass('yellow');
		$(currentUvindex).removeClass('orange');
		$(currentUvindex).removeClass('text-dark');
		$(currentUvindex).addClass('red');
		$(currentUvindex).addClass('text-light');
	}
}

//Click Handlers
searchButton.on('click', getCityElement);
