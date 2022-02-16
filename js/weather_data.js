'use strict'
//A Key for the Weather API
const key = 'aeeb6bc394d495acdd9b6b0eb06f5e40';

var map = L.map('map').setView([60.31181787547431, 25.030374526977543], 13);

//Sets up the map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYXR0ZWFzaSIsImEiOiJja3pwbmpjYncwMGlwMm9vOTY1MTA0azZ3In0.wHV0EGo-SSYYuE30yNTkAg'
}).addTo(map);

//Displays the coordinates from where you click
map.on('click', function (click) {
    const cord = {
        long: click.latlng.lng,
        lat: click.latlng.lat
    }
    haeSaaTiedot(cord);
});

function haeSaaTiedot(cord) {
    const url = `api.openweathermap.org/data/2.5/weather?lat=${cord.lat}&lon=${cord.long}&appid=${key}`
    console.log(url);
    fetch(url)
        .then(function (rsp) {
            return rsp.json();
        }).then(function (tiedot) {
            console.log(tiedot);
    });
}