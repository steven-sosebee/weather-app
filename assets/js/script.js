var apiKey = "58770277917bab6f2c2cefdcd33dfcbf";
var apiBase = "https://api.openweathermap.org/data/2.5/onecall"
var btnSearch = $("#search-btn");
var apiParams = {
    lat: 0,
    lon: 0,
    units: "imperial",
    appid: "58770277917bab6f2c2cefdcd33dfcbf"
};
var apiCityBase = "https://api.openweathermap.org/data/2.5/weather"
var apiCityParams = {
    q: "",
    appid: "58770277917bab6f2c2cefdcd33dfcbf"
};
priorSearches =[];
var dateWeather = {
    date: 0,
    high: 0,
    low: 0,
    humidity: 0,
    clouds: 0,
    precipitation: 0,
    icon: 0,
    iconURL: "http://openweathermap.org/img/wn/"
};
var priorSearchBtn = $("ul #prior-city");
// function populateCards (i, element) {
//     console.log(element);
//     console.log(data.daily[i].temp.day);
//     element.getElementsByClassName("high")[0].innerHTML =Math.round(data.daily[i].temp.day);
// };

function capitalize(word) {
    return word.replace(/\b[a-z]/g, function(capLetter) {
        return capLetter.toUpperCase();
    });
};
function addCurrent() {
    $(".current-day").remove();
    $("column").prepend(
        "<div class= 'current-day card col-6 align-self-center p-0'>\
        <div id='current-date' class='card-header text-center'></div>\
                <current class = 'bg-info container-fluid align-items-start' id='current-weather'>\
                    <row class='row'>\
                <div class= 'col-sm d-flex-column container-fluid'>\
                            <h5 class='bold'>Current Temp: <span id='current-temp'></span></h5>\
                            <div class='width-auto'>\
                                <h5>UV Index: <span id='current-UV'></span></h5 >\
                                <div class ='w-25 bg-dark' id='UV-icon'><i id='uvi' class='fas fa-signal'></i></div>\
                            </div class='container'>\
                            <h5><span id='current-wind'></span> mph</h5>\
                            <h5><i class='fas fa-tint'></i> <span id='current-humidity'></span>%</h5>\
                            <h5><i class='fas fa-cloud-rain'></i> <span id='current-rain'></span>%</h5>\
                        </div>\
                        <img class ='col align-self-center' src='' alt='' id='current-icon'>\
                    </row>\
                </current>\
            </div>");
};

function UV(UVi) {
    if (UVi > 8) {
        return "text-danger";
    } else {
        if (UVi > 3) {
            return "text-warning";
        } else {
            return "text-success";
        };
    };
};
function addDay(int) {
    $("calendar").append("<day class = ' card my-1 ' id='" + int + "'>\
        <div class= 'card-header bg-light'></div >\
        <row class='card-bg bg-info p-2'>\
            <img class='icon' src=''/>\
        </row>\
        <div class = 'day card-body bg-info p-1'>\
            <row class = 'card-body p-1'>\
                <div>High: <span class='high card-body p-1'></div>\
            </row>\
            <row class='card-body p-1'>\
                <div>Humidity: <span class='humidity card-body p-1'></span></div>\
            </row>\
            <row class='card-body p-1'>\
                <div><i class='fas fa-cloud-rain'></i> <span class='rain'></span></div>\
            </div>\
        </div>\
        <div class='night bg-dark card-body p-2'>\
            <row class='card-body'>\
                <div>Low: <span class='low'></span></div>\
            </row>\
            <row class='card-body'><i class='fas fa-moon'></i>\
            <div>Moon Rise: <span class='moonrise'></span></div>\
            <div>Moon Phase: <span class='moonphase'></span></div>\
        </row>\
        </div>\
    </day>")
}

function getData(city) {
    city = city.toLowerCase();
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=58770277917bab6f2c2cefdcd33dfcbf"
    console.log(apiURL);
    fetch(apiURL)

    .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        console.log(data);        
        fetch("https://api.openweathermap.org/data/2.5/onecall?" + "lat=" +
            data.coord.lat + "&lon=" + data.coord.lon + "&&units=imperial&appid=58770277917bab6f2c2cefdcd33dfcbf")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                // populate the current weather card
                $("#city").text(city);
                $("#current-temp").text(Math.round(data.current.temp));
                $("#current-humidity").text(data.current.humidity);
                $("#current-UV").text(data.current.uvi);
                $("#current-icon").attr("src","http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
                $("#current-wind").text(data.current.wind_speed);
                $("#current-rain").text(Math.round(data.daily[0].pop *100));
                $("#current-date").text(moment.unix(data.current.dt).format("dddd MMM DD, YYYY"));
                $("#UV-icon").addClass(UV(data.current.uvi));
                // select the dynamically created date cards and populate them
                var dateCards = $(document.querySelectorAll("day"));
                dateCards.each(function (i, element) {
                
                    var j = i + 1;
                    console.log(data.daily[j].pop+ "%");
                    element.getElementsByClassName("high")[0].innerHTML = Math.round(data.daily[j].temp.day);
                    element.getElementsByClassName("low")[0].innerHTML = Math.round(data.daily[j].temp.night);
                    element.getElementsByClassName("moonphase")[0].innerHTML = data.daily[j].moon_phase;
                    element.getElementsByClassName("moonrise")[0].innerHTML = moment.unix(data.daily[j].moonrise).format("HH:MM");
                    element.getElementsByClassName("icon")[0].src = "http://openweathermap.org/img/wn/" + data.daily[j].weather[0].icon + "@2x.png";
                    element.getElementsByClassName("humidity")[0].innerHTML = Math.round(data.daily[j].humidity) +"%";
                    element.getElementsByClassName("card-header")[0].innerHTML = moment.unix(data.daily[j].dt).format("ddd, MMM, DD");
                    // element.getElementsByClassName("rain")[0].style.width = data.daily[j].pop * 100 + "%";
                    element.getElementsByClassName("rain")[0].innerHTML = Math.round(data.daily[j].pop) * 100 + "%";
                });
                if (priorSearches.indexOf(city) === -1) {
                    priorSearches.push(city);
                    localStorage.setItem("WeatherSearches", JSON.stringify(priorSearches));
                };
                return data;
            })
            
    })
};

function printData(data) {
    console.log(data);
}

btnSearch.on("click", function (event) {
    var apiCity = $("#input-city").val().toLowerCase();
    $("day").remove();
    addCurrent();
    for (i = 1; i < 8; i++){
        addDay(i);
    }
    getData(apiCity);
});

function init() {
    var storedSearches = JSON.parse(localStorage.getItem("WeatherSearches"));
    if (storedSearches) {
        priorSearches = storedSearches;
        for (var i = 0; i < priorSearches.length; i++){
            var capCity = capitalize(priorSearches[i]);
            $("ul").append($("<button class='city-name text-center my-1 w-100 btn btn-secondary' id='prior-city'>").text(capCity));
        }
    } else {
        priorSearches = [];
    }
    $("#input-city").autocomplete({
        source: priorSearches
    })
}
$("ul").on("click", "button", function (e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    $("day").remove()
    addCurrent();
    for (i = 1; i < 8; i++){
        addDay(i);
    }
    var savedSearch = e.target;
    getData(savedSearch.textContent);
});
init();