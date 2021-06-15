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

// get the fetch call from the openweathermap
function getWeatherRepos(city) {
	// build the URL to get a data from server side.
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
					// object from server side Api for icon property.
					var weathericon = data.weather[0].icon;
					var iconurl =
						'https://openweathermap.org/img/wn/' + weathericon + '@2x.png';
					// The date format method is taken from the
					// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
					var date = new Date(data.dt * 1000).toLocaleDateString();
					// display city name, date, and weather icon
					$(currentCity).html(
						data.name + '(' + date + ')' + '<img src=' + iconurl + '>'
					);
					// convert temp to fahrenheit and display the fahrenheit
					var tempInFahrenheit = (data.main.temp - 273.15) * 1.8 + 32;
					$(currentTemperature).html(tempInFahrenheit.toFixed(2) + ' &#8457');
					// display the humidity
					$(currentHumidty).html(data.main.humidity + ' %');
					// convert wind to MPH and display wind speed
					var windSpeed = data.wind.speed;
					var windSpeedMph = (windSpeed * 2.237).toFixed(1);
					$(currentWSpeed).html(windSpeedMph + ' MPH');
					// call getUVIndexRepo and pass in lon and lat
					getUVIndexRepo(data.coord.lon, data.coord.lat);
					// call getForecastRepo and pass in id
					getForecastRepo(data.id);
					// console.log(weathericon);
					// console.log(iconurl);
					// console.log(date);
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
	// build the URL to get a data from server side.
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
					// test to change bg color for ux-index
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

function getForecastRepo(cityId) {
	// build the URL to get a data from server side.
	var apiUrl =
		'https://api.openweathermap.org/data/2.5/forecast?id=' +
		cityId +
		'&appid=' +
		apiKey;

	fetch(apiUrl)
		.then(function (response) {
			if (response.ok) {
				console.log(response);
				response.json().then(function (data) {
					console.log(data);
					for (i = 0; i < 5; i++) {
						var date = new Date(
							data.list[(i + 1) * 8 - 1].dt * 1000
						).toLocaleDateString();
						var iconcode = data.list[(i + 1) * 8 - 1].weather[0].icon;
						var iconurl =
							'https://openweathermap.org/img/wn/' + iconcode + '.png';
						var tempK = data.list[(i + 1) * 8 - 1].main.temp;
						var tempF = ((tempK - 273.5) * 1.8 + 32).toFixed(2);
						var humidity = data.list[(i + 1) * 8 - 1].main.humidity;

						$('#fDate' + i).html(date);
						$('#fImg' + i).html('<img src=' + iconurl + '>');
						$('#fTemp' + i).html(tempF + ' &#8457');
						$('#fHumidity' + i).html(humidity + ' %');
					}
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
