var APIKey = "70eb41e7cb859fabeb6a0e9e73af9f36";
var inputFormEl = document.querySelector("#current-search");
var currentCityEl = document.querySelector("#city");
var recentSearchesEl = document.querySelector("#search-bottom");
var cityIdCounter = 0;
var searchArr = [];

var getCity = function(city) {
    // api for current conditions
    var queryCurrent = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    // api for forecast conditions
    var queryForecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    
    fetch(queryCurrent).then(function(queryCurrent) {
        queryCurrent.json().then(function(queryCurrent) {
            displayCurrent(queryCurrent, city);
        });
    });

    fetch(queryForecast).then(function(queryForecast) {
        queryForecast.json().then(function(queryForecast) {
            displayForecast(queryForecast, city);
        });
    });
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = currentCityEl.value.trim();
    if (searchArr.includes(currentCityEl.value)) {
        return alert("City is a recent search. Please enter another city or click the desired recent search button."); // no duplicate entries
    } else {
        if (city) {
        searchArr.push(currentCityEl.value);
            // max recent search list
            if (searchArr.length > 10) {
                searchArr.shift();
            }
        // local storage
        saveSearches();
        // replicate recent search list when adding to it
        $('#search-bottom').empty();
        for (i=0; i < searchArr.length; i++) {
            var recentCity = document.createElement('BUTTON');
            $(recentCity).addClass("weather-button").val(searchArr[i]).append(searchArr[i]);
            $('#search-bottom').append(recentCity);  
        }
        
        getCity(city);
        currentCityEl.value = "";
    
    // warning if null entry
    } else {
        alert("Please enter a city name");
        };
    };
};

// choose from recent search list
var recentSearchHandler = function(event) {
    city = event.target.value;
    getCity(city);
}


var displayCurrent = function(city) {
    
    //remove prior search from display
    clearCurrent(); 
    
    // show current conditions
    var day0 = document.createElement("p");
    $(day0).addClass("conditions");
    day0.id = "day-0";
    var day0Val = ("(" + new Date((city.dt)*1000).toLocaleString([], {day: '2-digit', month: '2-digit', year: '2-digit'}) + ")");
    $(day0).append(city.name + " ").append(day0Val);
    $( "#operative" ).prepend(day0);
    
    // current weather icon
    var day0Icon = city.weather[0].icon;
    document.getElementById('icon-day0').src="http://openweathermap.org/img/w/"+day0Icon+".png";


    // current day temp
    var day0Temp = document.createElement("p");
    $(day0Temp).addClass("conditions");
    day0Temp.id = "day-0-temp";
    var day0TempVal = (((city.main.temp)-273.15) * 9 / 5 + 32).toFixed(2);
    $(day0Temp).append(" " + day0TempVal + " " + String.fromCharCode(176) + "F");
    $( "#temp" ).append(day0Temp);
    
    // current day wind
    var day0Wind = document.createElement("p");
    $(day0Wind).addClass("conditions");
    day0Wind.id = "day-0-wind";
    var day0WindVal = (city.wind.speed).toFixed(2);
    $(day0Wind).append(" " + day0WindVal + " MPH");
    $( "#wind" ).append(day0Wind); 
    
    // current day humidity
    var day0Humidity = document.createElement("p");
    $(day0Humidity).addClass("conditions");
    day0Humidity.id = "day-0-humidity";
    var day0HumidityVal = city.main.humidity;
    $(day0Humidity).append(" " + day0HumidityVal + " %");
    $( "#humidity" ).append(day0Humidity);

    // current day UV index - requires separate api
    var day0UV = document.createElement("p");
    $(day0UV).addClass("conditions");
    day0UV.id = "day-0-uv";
    var lat = (city.coord.lat);
    var lon = (city.coord.lon);
    var queryCurrentUV = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    fetch(queryCurrentUV).then(function(queryCurrentUV) {
        queryCurrentUV.json().then(function(queryCurrentUV) {  
            var day0UVVal = (queryCurrentUV.current.uvi);
            $(day0UV).append(" " + day0UVVal);
            $( "#uv" ).append(day0UV);
        });
    });
}

var displayForecast = function(city) {
    
    // remove prior search from display
    clearForecast(); 
    
    // constant interval regardless of day app is used
    const forecastDays = [
        {day: city.list[7].dt, icon: city.list[7].weather[0].icon, temp: city.list[7].main.temp, wind: city.list[7].wind.speed, humidity: city.list[7].main.humidity},
        {day: city.list[15].dt, icon: city.list[15].weather[0].icon, temp: city.list[15].main.temp, wind: city.list[15].wind.speed, humidity: city.list[15].main.humidity},
        {day: city.list[23].dt, icon: city.list[23].weather[0].icon, temp: city.list[23].main.temp, wind: city.list[23].wind.speed, humidity: city.list[23].main.humidity},
        {day: city.list[31].dt, icon: city.list[31].weather[0].icon, temp: city.list[31].main.temp, wind: city.list[31].wind.speed, humidity: city.list[31].main.humidity},
        {day: city.list[39].dt, icon: city.list[39].weather[0].icon, temp: city.list[39].main.temp, wind: city.list[39].wind.speed, humidity: city.list[39].main.humidity}
    ]

        // logic for forecast conditions
        for (i = 0; i < forecastDays.length; i++) {
            var forecastDay = new Date(forecastDays[i].day*1000).toLocaleString([], {day: '2-digit', month: '2-digit', year: '2-digit'});
            forecastDay.class = "forecast";

            var forecastIcon = $('<img>').attr('src',"http://openweathermap.org/img/w/"+forecastDays[i].icon+".png");
            forecastIcon.class = "forecast";

            var forecastTemp = "<br>" + "Temp: " + (((forecastDays[i].temp)-273.15) * 9 / 5 + 32).toFixed(2) + String.fromCharCode(176) + "F";
            forecastTemp.class = "forecast";

            var forecastWind = "<br><br>" + "Wind: " + (forecastDays[i].wind).toFixed(2) + " MPH";
            forecastWind.class = "forecast";

            var forecastHumidity = "<br><br>" + "Humidity: " + (forecastDays[i].humidity + " %");
            forecastHumidity.class = "forecast";
            
            jQuery("<div>",{
                class: "day",
                id: "day" + [i],
            }).appendTo("#forecast-cards");
            $('#day' + [i]).append(forecastDay, '<br>', forecastIcon,forecastTemp, forecastWind, forecastHumidity);
        }        
    }

// clear current conditions when new city chosen
var clearCurrent = function() {
    $( "#operative" ).empty();
    $( "#temp" ).empty();
    $( "#wind" ).empty();
    $( "#humidity" ).empty();
    $( "#uv" ).empty();
};

// clear forecasted conditions when new city chosen
var clearForecast = function() {
    $( "#forecast-cards" ).empty();
};

var saveSearches = function() {
    localStorage.setItem("searches",JSON.stringify(searchArr));
}

// recover local storage
var loadSearches = function() {
    var savedSearches = localStorage.getItem("searches");
    console.log(savedSearches);
    if (!savedSearches) {
        return false;
    }
    savedSearches = JSON.parse(savedSearches);

    for (var i = 0; i < savedSearches.length; i++) {
        var recentSearch = document.createElement("BUTTON");
        $(recentSearch).addClass("weather-button").val(savedSearches[i]).append(savedSearches[i]);
        $('#search-bottom').append(recentSearch);
        searchArr.push(savedSearches[i]);
        getCity(savedSearches[i]);
    }
}

// event listeners for recent searches
recentSearchesEl.addEventListener("click", recentSearchHandler);
// event listener for new search
inputFormEl.addEventListener("submit", formSubmitHandler);

loadSearches(); 