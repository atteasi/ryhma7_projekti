'use strict'
//A Key for the Weather API
const key = 'aeeb6bc394d495acdd9b6b0eb06f5e40';
//An access token for the MapBox API
const map = L.map('map', {
    maxBoundsViscosity: 1.0
});
//A let that changes value the first time you open the side menu
let avauksia = 0;
//A let that changes the first time you show a route
let route = 0;
//Bounds for the map so it does not go on infinitely to the left and right
const southWest = L.latLng(-89.98155760646617, -180),
    northEast = L.latLng(89.99346179538875, 180);
const bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);
//Function that makes it impossible to drag the map out of bounds
map.on('drag', function () {
    map.panInsideBounds(bounds, {animate: false});
});
//The side panel with weather info
const infoja = document.querySelector('article');
//The map
const kartta = document.querySelector('#map');
//The buttons used for opening and closing the side panel and to show and hide the route on the map
const but = document.getElementById('avaa');
const nappi = document.getElementById('nappi');
const lentoTietoNappi = document.getElementById('matkatietoja');
const clearRoute = document.getElementById('piilota');

let myCoords = {
    lat: 0,
    lon: 0
}
const toCoords = {
    lat: 0,
    lon: 0
}

function onnistu(pos) {
    const crd = pos.coords;
    map.setView([crd.latitude, crd.longitude], 11);
    new L.marker([crd.latitude, crd.longitude]).addTo(map);
    myCoords.lat = crd.latitude;
    myCoords.lon = crd.longitude;
    myAirport();
    console.log(myCoords);
}

function virhe(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
}

navigator.geolocation.getCurrentPosition(onnistu, virhe);
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

//Gets the coordinates from where you clicked on the map and sends them to functions that display the weather data
map.on('click', function (click) {
    if (avauksia === 0) {
        avauksia++;
    }
    if (route > 0) {
        if (nearOrFar === 0) {
            map.removeControl(driveRoute);
        } else if (nearOrFar === 1) {
            map.removeControl(toAirport);
            map.removeControl(fromAirport);
            polyline.remove(map);
        }
    }
    but.classList.replace('visible', 'hidden');
    clearRoute.classList.replace('visible', 'hidden');
    const cord = {
        long: click.latlng.lng.toString(),
        lat: click.latlng.lat.toString()
    }
    const clicked = click.latlng;
    haePaivanTiedot(cord);
    haeViikonTiedot(cord);
    const marker = new L.marker(clicked).addTo(map);
    marker.addEventListener('click', function () {
        haePaivanTiedot(cord);
        haeViikonTiedot(cord);
        infoja.classList.replace('hidden', 'visible');
        kartta.style.width = '70%';
        but.classList.replace('visible', 'hidden');
        nappi.classList.replace('hidden', 'visible');
        lentoTietoNappi.classList.replace('hidden', 'visible');
    })
});


nappi.addEventListener('click', function () {
    kartta.style.width = '100%';
    infoja.classList.replace('visible', 'hidden');
    but.classList.replace('hidden', 'visible');
    nappi.classList.replace('visible', 'hidden');
    lentoTietoNappi.classList.replace('visible', 'hidden');
});

but.addEventListener('click', function () {
    infoja.classList.replace('hidden', 'visible');
    kartta.style.width = '70%';
    but.classList.replace('visible', 'hidden');
    nappi.classList.replace('hidden', 'visible');
});

clearRoute.addEventListener('click', function () {
    clearRoute.classList.replace('visible', 'hidden');
    lentoTietoNappi.classList.replace('hidden', 'visible');
    map.removeControl(route);
})

const ohje = document.getElementById('ohje');
const kuvia = document.getElementById('kuvia');
const credits = document.getElementById('kreditteja');

ohje.addEventListener('click', function (){
    const modal = document.getElementById('modal');
    const content = document.getElementById('content');
    modal.style.display = 'block';
    const html = `
                <h2>Tervetuloa käyttämään LomaLoikoilijoita!</h2>
                <p>Lomaloikoilijat on helppokäyttöinen sään tarkistusohjelma! Onko sattunut tapauksia jolloin olet pukeutunut pakkaseen hieman liian kevyesti?
                Entä tilanteita joissa kesähelteet on otettu vastaan toppatakin kanssa? Lomaloikoilijoiden avulla pystyt katsomaan tarkalleen millaista säätä odottaa!</p>
                <h2><br>Miten LomaLoikoilijoita käytetään?</h2>
                <p>LomaLoikoilijoiden käyttö on helppoa ja tapahtuu hetkessä! Sinun tarvitsee vain maailman kartalta klikata mitä tahansa kohtaa, niin saat esille sen paikan
                sen hetkiset säätiedot, sekä myös seuraavan viikon ajalta tietoja kuten päivämäärän, yleisen säätilanteen (onko pilvistä vai aurinkoista tai jokin muu säätilanne) sekä lämpötilan
                jota varten kannattaa varata vaatetusta. Voit myös avata "Lisätietoja" linkin avulla näkyviin lisää tietoja, esimerkiksi päivän mittaan olevan lämpötilan sekä
                tarkat ajat sille, milloin aurinko nousee sekä laskee, jotta tietää myös kuinka paljon aikaa on nauttia valoisasta ajasta kohteessasi!
                 Lisätietoikkunasta pääset pois vain klikkaamalla ikkunan ulkopuolelle!</p>
                 <h2><br>Miten löydän kohteeseeni perille?</h2>
                 <p>Oli joko halu löytää helppo reitti lomakohteeseesi tai muuten vain nähdä miten päästä haluaamasi kohteeseen, LomaLoikoilijat tarjoaa reititysapua tarpeisiisi!
                 Klikkaamalla ruudun yläreunassa sijaitsevaa "Näytä reitti kohteeseen" piirtää kartalle ajo-ohjeet lähimmälle lentokentällesi, sieltä lennon lähimpänä kohdettasi olevalle lentokentälle
                 ja sitten vielä kohteesi lentokentältä ajo-ohjeet kohteeseesi!</p>       
                 <p><br><br>Siinä on kaikki tarvittava sovelluksen käyttöön! <strong>Sitten vain Lomalle Loikoilemaan!</strong></p>
                   
            `
    content.innerHTML = html;
    window.onclick = function (event) {
        if (event.target === modal) {
            document.getElementById('modal').style.display = "none";
        }
    };
})

credits.addEventListener('click', function (){

})