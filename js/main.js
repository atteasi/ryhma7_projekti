'use strict'
//A Key for the Weather API
const key = 'aeeb6bc394d495acdd9b6b0eb06f5e40';
//A key for the Week Forecast
const map = L.map('map').setView([60.31181787547431, 25.030374526977543], 13);

const infoja = document.querySelector('article');

const kartta = document.querySelector('#map');


//Sets up the map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom: 3,
    setZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYXR0ZWFzaSIsImEiOiJja3pwbmpjYncwMGlwMm9vOTY1MTA0azZ3In0.wHV0EGo-SSYYuE30yNTkAg'
}).addTo(map);
//Gets the coordinates from where you clicked on the map
map.on('click', function (click) {
    const cord = {
        long: click.latlng.lng.toString(),
        lat: click.latlng.lat.toString()
    }
    haePaivanTiedot(cord);
    haeViikonTiedot(cord);
});