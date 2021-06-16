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
		console.warn('Please enter a city');
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
				console.warn(response.statusText);
			}
		})
		.catch(function (error) {
			console.warn('Unable to connect to API');
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
					var uvIndex = data.value;
					// test to change bg color for ux-index
					// uvIndex = 2;
					console.log(uvIndex);
					changeUVIndexColor(uvIndex);
					$(currentUvindex).html(uvIndex);
				});
			} else {
				console.warn(response.statusText);
			}
		})
		.catch(function (error) {
			console.warn('Unable to connect to API');
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
					// generates dates for UI (maybe make into a function)
					for (i = 0; i < 5; i++) {
						var findInList = (i + 1) * 8 - 1;
						var date = new Date(
							data.list[findInList].dt * 1000
						).toLocaleDateString();
						var iconcode = data.list[findInList].weather[0].icon;
						var iconurl =
							'https://openweathermap.org/img/wn/' + iconcode + '.png';
						// get temp from main list
						var temp = data.list[findInList].main.temp;
						// convert to fahrenheit
						var tempToFahrenheit = ((temp - 273.5) * 1.8 + 32).toFixed(2);
						// get humidity from list
						var humidity = data.list[findInList].main.humidity;

						$('#forcastDate' + i).html(date);
						$('#forcastImg' + i).html('<img src=' + iconurl + '>');
						$('#forcastTemp' + i).html(tempToFahrenheit + ' &#8457');
						$('#forcastHumidity' + i).html(humidity + ' %');
					}

					// loop over 40 item array and get average temp for each date then append to page
				});
			} else {
				// console.warn or console.error :)
				console.warn(response.statusText);
			}
		})
		.catch(function (error) {
			console.warn('Unable to connect to API');
		});
}

function removeClassName(el) {
	$(el).removeClass('yellow');
	$(el).removeClass('orange');
	$(el).removeClass('red');
	$(el).removeClass('text-dark');
	$(el).removeClass('green');
	$(el).removeClass('text-light');
}

function changeUVIndexColor(uv) {
	if (uv >= 0 && uv <= 2) {
		removeClassName(currentUvindex);
		$(currentUvindex).addClass('green');
		$(currentUvindex).addClass('text-light');
	} else if (uv >= 2 && uv <= 5) {
		removeClassName(currentUvindex);
		$(currentUvindex).addClass('yellow');
		$(currentUvindex).addClass('text-dark');
	} else if (uv >= 5 && uv <= 7) {
		removeClassName(currentUvindex);
		$(currentUvindex).addClass('orange');
		$(currentUvindex).addClass('text-light');
	} else {
		removeClassName(currentUvindex);
		$(currentUvindex).addClass('red');
		$(currentUvindex).addClass('text-light');
	}
}

//Click Handlers
searchButton.on('click', getCityElement);
