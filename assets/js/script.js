var dateCards = $("day");
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

function getCurrent(element) {
    $("#current-" + element).text(data.current.element);
}
function getData(city, state) {
    // var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + "&appid=58770277917bab6f2c2cefdcd33dfcbf"
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=58770277917bab6f2c2cefdcd33dfcbf"
    console.log(apiURL);
    fetch(apiURL)
    // .then(res => res.json())
    // .then(data => obj = data)
    // .then(() => console.log(obj))
    // .then(console.log(obj.main));

    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        printData(data.coord);
        
        fetch("https://api.openweathermap.org/data/2.5/onecall?" + "lat=" +
            data.coord.lat + "&lon=" + data.coord.lon + "&&units=imperial&appid=58770277917bab6f2c2cefdcd33dfcbf")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                $("#city").text(city+", " +$("#input-state option:selected").text());
                $("#current-temp").text(data.current.temp);
                $("#current-humidity").text(data.current.humidity);
                $("#current-UV").text(data.current.uvi);
                $("#current-icon").attr("src","http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
                $("#current-wind").text(data.current.wind_gust);
                $("#current-date").text(moment.unix(data.current.dt).format("ddd, MMM DD, YYY"));
                // $("#current-").text(data.current.);
                dateCards.each(function (i, element) {
                    // populateCards(i, element);
                    var j = i + 1;
                    console.log(data.daily[j].pop+ "%");
                    element.getElementsByClassName("high")[0].innerHTML = Math.round(data.daily[j].temp.day);
                    element.getElementsByClassName("low")[0].innerHTML = Math.round(data.daily[j].temp.night);
                    // console.log("http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
                    element.getElementsByClassName("icon")[0].src = "http://openweathermap.org/img/wn/" + data.daily[j].weather[0].icon + "@2x.png";
                    element.getElementsByClassName("humidity")[0].innerHTML = Math.round(data.daily[j].humidity) +"%";
                    element.getElementsByClassName("card-header")[0].innerHTML = moment.unix(data.daily[j].dt).format("ddd, MMM, DD");
                    element.getElementsByClassName("rain")[0].style.width = data.daily[j].pop * 100 + "%";
                    element.getElementsByClassName("rain")[0].innerHTML = data.daily[j].pop * 100 + "%";
                    
                });
                if (priorSearches.indexOf(City) === -1) {
                    priorSearches.push(City);
                    localStorage.setItem("WeatherSearches", JSON.stringify(priorSearches));
                };
                // $("#1").text(data.daily[0].temp.day);
                // $("#2").text(data.daily[1].temp.day);
                // $("#3").text(data.daily[2].temp.day);
                return data;
        })
    })
};

function printData(data) {
    console.log(data);
}
// var apiCity = "Durham";
// var apiState = "NC";
// var apiCountry = "US";
// getData(apiCity);


btnSearch.on("click", function (event) {
    var apiCity = $("#input-city").val().toLowerCase();
    // var apiState = $("#input-state").val();
    console.log(apiCity);
    // console.log(apiState);
    // getData(apiCity, apiState)
    getData(apiCity);
});

function init() {
    var storedSearches = JSON.parse(localStorage.getItem("WeatherSearches"));
    if (storedSearches) {
        priorSearches = storedSearches;
        for (var i = 0; i < priorSearches.length; i++){
            $("ul").append($("<button class=' text-center my-1 w-100 btn btn-secondary' id='prior-city'>").text(priorSearches[i]));
        }
    } else {
        priorSearches = [];
    }
    // console.log(storedSearches);
    // console.log(priorSearches);
    $("#input-city").autocomplete({
        source: priorSearches
    })
}
$("ul").on("click", "button", function (e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    var savedSearch = e.target;
    console.log("prior search");
    console.log(savedSearch.textContent);
    getData(savedSearch.textContent);
});
init();