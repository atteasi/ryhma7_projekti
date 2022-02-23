//Function that fetches the Current Weather Data from the OpenWeatherMap API
function haePaivanTiedot(cord) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${cord.lat}&lon=${cord.long}&appid=${key}&lang=fi&units=metric`
    fetch(url)
        .then(function (rsp) {
            return rsp.json();
        }).then(function (tiedot) {
        listaaPaivanTietoja(tiedot);
    });
}

//Displays the weather info from the clicked spot for today
function listaaPaivanTietoja(info) {
    //Makes the map a little smaller and makes the area where the
    kartta.style.width = '70%';
    infoja.classList.replace('hidden', 'visible');
    document.getElementById('kaupunki').innerHTML = info.name;
    document.getElementById('lampo').innerHTML = `Lämpötila: ${info.main.temp}C°`;
    document.getElementById('tuntuu').innerHTML = `Tuntuu: ${info.main.feels_like}C°`;
    const tilanne = info.weather[0].description;
    document.getElementById('desc').innerHTML = `Tämän hetken säätilanne: ${tilanne.charAt(0).toUpperCase() + tilanne.slice(1)}`;
    const img = document.getElementById('img');
    img.src = `http://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png`;
    map.flyTo([info.coord.lat, info.coord.lon], 11);
}

document.getElementById('nappi').addEventListener('click', function (){
   kartta.style.width = '100%';
   infoja.classList.replace('visible', 'hidden');

});
//Function that fetches the Weather data for the next week from the OpenWeatherMap API
function haeViikonTiedot (cord){
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${cord.lat}&lon=${cord.long}&units=metric&appid=${key}`;
    fetch(url)
        .then(function (rsp) {
            return rsp.json();
        }).then(function (tiedot) {
        console.log(tiedot);
    });
}