// variable declaration
var searchCity = $('#search-city');
var searchButton = $('#search-button');
var clearButton = $('#clear-history');
var currentCity = $('#current-city');
var currentTemperature = $('#temperature');
var currentHumidty = $('#humidity');
var currentWSpeed = $('#wind-speed');
var currentUvindex = $('#uv-index');
var storeCity = [];
var apiKey = 'bc2194bf2b678d6ec02f05146c48236e';

function getCityElement() {
	var city = searchCity.val().trim();

	if (city) {
		$('#search-city').val('');
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
				// console.log(response);
				response.json().then(function (data) {
					// console.log(data);
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

					if (data.cod == 200) {
						storeCity = JSON.parse(localStorage.getItem('cityname'));
						// console.log(storeCity);
						if (storeCity === null) {
							storeCity = [];
							storeCity.push(city.toUpperCase());
							localStorage.setItem('cityname', JSON.stringify(storeCity));
							addToList(city);
						} else {
							if (find(city) > 0) {
								storeCity.push(city.toUpperCase());
								localStorage.setItem('cityname', JSON.stringify(storeCity));
								addToList(city);
							}
						}
					}
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
				// console.log(response);
				response.json().then(function (data) {
					// console.log(data);
					var uvIndex = data.value;
					// test to change bg color for ux-index
					// uvIndex = 2;
					// console.log(uvIndex);
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
				// console.log(response);
				response.json().then(function (data) {
					// console.log(data);
					// generates dates for UI
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
						// get wind from list and conver it to mph
						var windSpeed = data.list[findInList].wind.speed;
						var windSpeedMph = (windSpeed * 2.237).toFixed(1);

						$('#forcastDate' + i).html(date);
						$('#forcastImg' + i).html('<img src=' + iconurl + '>');
						$('#forcastTemp' + i).html(tempToFahrenheit + ' &#8457');
						$('#forcastWind' + i).html(windSpeedMph + ' MPH');
						$('#forcastHumidity' + i).html(humidity + ' %');
					}
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

function find(city) {
	for (var i = 0; i < storeCity.length; i++) {
		if (city.toUpperCase() == storeCity[i]) {
			return -1;
		}
	}
	return 1;
}

function addToList(city) {
	var listEl = $('<li>' + city.toUpperCase() + '</li>');
	$(listEl).attr('class', 'list-group-item');
	$(listEl).attr('data-value', city.toUpperCase());
	$('#searchedCitylist').append(listEl);
}

function invokePastSearch(event) {
	var liEl = event.target;
	if (event.target.matches('li')) {
		city = liEl.textContent.trim();
		getWeatherRepos(city);
	}
}

function loadSearchedCity() {
	$('#searchedCitylist').empty();
	var storedCity = JSON.parse(localStorage.getItem('cityname'));
	if (storedCity !== null) {
		storedCity = JSON.parse(localStorage.getItem('cityname'));
		for (i = 0; i < storedCity.length; i++) {
			addToList(storedCity[i]);
		}
		var city = storedCity[i - 1];
		getWeatherRepos(city);
	}
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
	} else if (uv > 2 && uv <= 5) {
		removeClassName(currentUvindex);
		$(currentUvindex).addClass('yellow');
		$(currentUvindex).addClass('text-dark');
	} else if (uv > 5 && uv <= 7) {
		removeClassName(currentUvindex);
		$(currentUvindex).addClass('orange');
		$(currentUvindex).addClass('text-light');
	} else {
		removeClassName(currentUvindex);
		$(currentUvindex).addClass('red');
		$(currentUvindex).addClass('text-light');
	}
}

function clearCityHistory(event) {
	storeCity = [];
	localStorage.removeItem('cityname');
	document.location.reload();
}

// click Handlers
searchButton.on('click', getCityElement);
$('#clear-history').on('click', clearCityHistory);
$(document).on('click', invokePastSearch);
$(window).on('load', loadSearchedCity);
