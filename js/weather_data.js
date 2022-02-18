'use strict'
//A Key for the Weather API
const key = 'aeeb6bc394d495acdd9b6b0eb06f5e40';
//Setting up the map that is used by our web page
const map = L.map('map').setView([60.31181787547431, 25.030374526977543], 13);

const infoja = document.querySelector('article');

const kartta = document.querySelector('#map');
//Sets up the map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom: 3,
    setZoom: 18,
    latLngBounds: [
        //south west
        [40.712, -74.227],
        //north east
        [40.774, -74.125]
    ],
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYXR0ZWFzaSIsImEiOiJja3pwbmpjYncwMGlwMm9vOTY1MTA0azZ3In0.wHV0EGo-SSYYuE30yNTkAg'
}).addTo(map);

//Displays the coordinates from where you click
map.on('click', function (click) {
    const cord = {
        long: click.latlng.lng.toString(),
        lat: click.latlng.lat.toString()
    }
    haeSaaTiedot(cord);
});

//Function that fetches the Current Weather Data from the OpenWeatherMap API
function haeSaaTiedot(cord) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${cord.lat}&lon=${cord.long}&appid=${key}&lang=fi&units=metric`
    fetch(url)
        .then(function (rsp) {
            return rsp.json();
        }).then(function (tiedot) {
        console.log(tiedot);
        listaaSaaTietoja(tiedot);
    });
}

//Logs the weather info into console
function listaaSaaTietoja(info) {
    kartta.style.width = '70%';
    infoja.classList.replace('hidden', 'visible');
    document.getElementById('kaupunki').innerHTML = info.name;
    document.getElementById('lampo').innerHTML = `Lämpötila: ${info.main.temp}C°`;
    document.getElementById('desc').innerHTML = `Tämän hetken säätilanne: ${info.weather[0].description}`




    //The Country you Clicked on
    console.log(info.sys.country);
    //The City you Clicked on
    console.log(info.name);
    //The Temperature from where you Clicked on
    console.log(`Lämpötila: ${info.main.temp}C°`);
    //What the Temperature Feels Like
    console.log(`Lämpötila tuntuu: ${info.main.feels_like}C°`);
    //Wind Speed
    console.log(`Tuulen nopeus: ${info.wind.speed}m/s`);
    //The Current Weather Condition
    console.log(info.weather[0].description);
    map.flyTo([info.coord.lat, info.coord.lon], 11);
}

document.getElementById('nappi').addEventListener('click', function (){
   kartta.style.width = '100%';
   infoja.classList.replace('visible', 'hidden');

});