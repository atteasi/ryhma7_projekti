'use strict'
//The closest airport to you
let closestAirport;
//The closest airport near your target location
let toAirport;
//The route to your destination from the target airport
let fromAirport;
//The Flight route
let polyline;
//The route to take whilst traveling inside the same country you are in
let driveRoute;
//This changes value based on if the target is in the same country or not. Changes to 0 when in the same country, to 1 when not.
let nearOrFar;
//Popup for your closest airport
let popupClose;
//Popup for the target airport
let popupTargetAirPort;
//The function that starts the progress of printing flight data
lentoTietoNappi.addEventListener('click', function () {
    if(route === 0) {
        route++;
    }
    //Fetches the closest airport from an API
    const url = `https://aerodatabox.p.rapidapi.com/airports/search/location/${toCoords.lat}/${toCoords.lon}/km/1000/1?withFlightInfoOnly=false`;
    fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
            "x-rapidapi-key": "1f5170c87dmshf9141431be88fe0p14e2e2jsn0ca962b33a76"
        }
    })
        .then(function (rsp) {
            return rsp.json();
        }).then(function (tiedot) {
        piirraLento(tiedot);
    })
})
//The function that displays the route to your destination
function piirraLento(info){
    lentoTietoNappi.classList.replace('visible', 'hidden');
    clearRoute.classList.replace('hidden', 'visible');
    //The coordinates of the target airport
    const airportCoords = {
        lat: info.items[0].location.lat,
        lon: info.items[0].location.lon,
        cc: info.items[0].countryCode
    }
    console.log(airportCoords.cc);
    console.log(closestAirport.cc);
    //If the clicked location is in the same country, only print driving instructions. If not, display the flight also.
    if(closestAirport.cc === airportCoords.cc){
        nearOrFar = 0;
        driveRoute = L.Routing.control({
            waypoints: [
                L.latLng(myCoords.lat, myCoords.lon),
                L.latLng(toCoords.lat, toCoords.lon)
            ],
            addWayPoints: false,
        }).addTo(map);
    } else {
        nearOrFar = 1;

        map.setZoom(8);
        //Route to your closest airport
        toAirport = L.Routing.control({
            waypoints: [
                L.latLng(myCoords.lat, myCoords.lon),
                L.latLng(closestAirport.lat, closestAirport.lon)
            ],
            addWayPoints: false,
            fitSelectedRoutes: false,
        }).addTo(map);
        const polyLinePoints =
            [
                [airportCoords.lat, airportCoords.lon],
                [closestAirport.lat, closestAirport.lon]
            ];
        //The Flight route straight from your airport to the target locations closest airport
        polyline = new L.polyline(polyLinePoints).addTo(map);
        //The route to target location from the destination airport
        fromAirport = L.Routing.control({
            waypoints: [
                L.latLng(airportCoords.lat, airportCoords.lon),
                L.latLng(toCoords.lat, toCoords.lon)
            ],
            fitSelectedRoutes: false,
            addWayPoints: false,
        }).addTo(map);
        popupClose = L.popup().setLatLng([closestAirport.lat, closestAirport.lon]).setContent('Sijaintiasi lähin lentökenttä').addTo(map);
        popupTargetAirPort = L.popup().setLatLng([airportCoords.lat, airportCoords.lon]).setContent('Kohteen lähin lentökenttä').addTo(map);
    }
}
//Function to get your closest airports coordinates
function myAirport(){
    const url = `https://aerodatabox.p.rapidapi.com/airports/search/location/${myCoords.lat}/${myCoords.lon}/km/1000/1?withFlightInfoOnly=false`;
    fetch(url, {        "method": "GET",
        "headers": {
            "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
            "x-rapidapi-key": "1f5170c87dmshf9141431be88fe0p14e2e2jsn0ca962b33a76"
        }
    })
        .then(function (rsp) {

            return rsp.json();
        }).then(function (tiedot) {
            //The coordinates of your closest airport
        closestAirport = {
            lat: tiedot.items[0].location.lat,
            lon: tiedot.items[0].location.lon,
            cc: tiedot.items[0].countryCode
        }
    })
}
//Button that clears the route prints from the map
clearRoute.addEventListener('click', function(){
    lentoTietoNappi.classList.replace('hidden', 'visible');
    if (nearOrFar === 0) {
        map.removeControl(driveRoute);
    } else if (nearOrFar === 1) {
        map.removeControl(toAirport);
        map.removeControl(fromAirport);
        polyline.remove(map);
    }
    map.closePopup();
})