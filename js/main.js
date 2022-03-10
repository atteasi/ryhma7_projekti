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
//The buttons used for opening and closing the side panel and to show and hide the route on the map
const but = document.getElementById('avaa');
const nappi = document.getElementById('nappi');
const lentoTietoNappi = document.getElementById('matkatietoja');
const clearRoute = document.getElementById('piilota');
//These Coordinates will be changed to your approximate Coordinates
let myCoords = {
    lat: 0,
    lon: 0
}
//These will change to the coordinates of the place you clicked on
const toCoords = {
    lat: 0,
    lon: 0
}

//The function that is executed if the program is able to get your location
function onnistu(pos) {
    const crd = pos.coords;
    map.setView([crd.latitude, crd.longitude], 11);
    new L.marker([crd.latitude, crd.longitude]).addTo(map);
    myCoords.lat = crd.latitude;
    myCoords.lon = crd.longitude;
    console.log(myCoords);
}

//The function that is executed if the program isn't able to get your location
function virhe(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
}

//Function that gets your location
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
        myAirport();
    }
    //In case the printed route data is still there when you click on a new location, it deletes the route from the map. Only deletes the paths it has printed
    //based on if the place was in the same country as you or not
    if (route > 0) {
        if (nearOrFar === 0) {
            map.removeControl(driveRoute);
        } else if (nearOrFar === 1) {
            map.removeControl(toAirport);
            map.removeControl(fromAirport);
            polyline.remove(map);
        }
    }
    //Shows the "Piilota sivuvalikko" button and hides the "Avaa sivuvalikko" button
    but.classList.replace('visible', 'hidden');
    clearRoute.classList.replace('visible', 'hidden');
    document.getElementById('map').classList.replace('mapBig', 'mapBigOpen');
    //Coordinates of the clicked location
    const cord = {
        long: click.latlng.lng.toString(),
        lat: click.latlng.lat.toString()
    }
    const clicked = click.latlng;
    //Sends the coordinates to the weather data functions
    haePaivanTiedot(cord);
    haeViikonTiedot(cord);
    //Adds a marker on the clicked location
    const marker = new L.marker(clicked).addTo(map);
    marker.addEventListener('click', function () {
        haePaivanTiedot(cord);
        haeViikonTiedot(cord);
        infoja.classList.replace('hidden', 'visible');
        but.classList.replace('visible', 'hidden');
        nappi.classList.replace('hidden', 'visible');
        lentoTietoNappi.classList.replace('hidden', 'visible');
    })
});

//Button to hide the side panel
nappi.addEventListener('click', function () {
    document.getElementById('map').classList.replace('mapBigOpen', 'mapBig');
    infoja.classList.replace('visible', 'hidden');
    but.classList.replace('hidden', 'visible');
    nappi.classList.replace('visible', 'hidden');
    lentoTietoNappi.classList.replace('visible', 'hidden');
});
//Button to open up the side panel
but.addEventListener('click', function () {
    if (clearRoute.classList.contains('hidden')) {
        lentoTietoNappi.classList.replace('hidden', 'visible');
    }
    infoja.classList.replace('hidden', 'visible');
    but.classList.replace('visible', 'hidden');
    nappi.classList.replace('hidden', 'visible');
});
//Deletes the printed route from the map
clearRoute.addEventListener('click', function () {
    clearRoute.classList.replace('visible', 'hidden');
    lentoTietoNappi.classList.replace('hidden', 'visible');
    map.removeControl(route);
})
//The nav-tags links
const ohje = document.getElementById('ohje');
const kuvia = document.getElementById('kuvia');
//Prints the instructions
ohje.addEventListener('click', function () {
    const modal = document.getElementById('modal');
    const content = document.getElementById('content');
    modal.style.display = 'block';
    const html = `
                <h2>Tervetuloa käyttämään Lomaloikoilijoita!</h2>
                <p>Lomaloikoilijat on helppokäyttöinen sään tarkistusohjelma! Onko sattunut tapauksia jolloin olet pukeutunut pakkaseen hieman liian kevyesti?
                Entä tilanteita joissa kesähelteet on otettu vastaan toppatakin kanssa? Lomaloikoilijoiden avulla pystyt katsomaan tarkalleen millaista säätä odottaa!</p>
                <h2><br>Miten Lomaloikoilijoita käytetään?</h2>
                <p>Lomaloikoilijoiden käyttö on helppoa ja tapahtuu hetkessä! Sinun tarvitsee vain maailman kartalta klikata mitä tahansa kohtaa, niin saat esille sen paikan
                sen hetkiset säätiedot, sekä myös seuraavan viikon ajalta tietoja kuten päivämäärän, yleisen säätilanteen (onko pilvistä vai aurinkoista tai jokin muu säätilanne) sekä lämpötilan
                jota varten kannattaa varata vaatetusta. Voit myös avata "Lisätietoja" linkin avulla näkyviin lisää tietoja, esimerkiksi päivän mittaan olevan lämpötilan sekä
                tarkat ajat sille, milloin aurinko nousee sekä laskee, jotta tietää myös kuinka paljon aikaa on nauttia valoisasta ajasta kohteessasi!
                 Lisätietoikkunasta pääset pois vain klikkaamalla ikkunan ulkopuolelle!</p>
                 <h2><br>Miten löydän kohteeseeni perille?</h2>
                 <p>Oli joko halu löytää helppo reitti lomakohteeseesi tai muuten vain nähdä miten päästä haluaamasi kohteeseen, Lomaloikoilijat tarjoaa reititysapua tarpeisiisi!
                 Klikkaamalla ruudun yläreunassa sijaitsevaa "Näytä reitti kohteeseen" painiketta, sovellus piirtää kartalle ajo-ohjeet lähimmälle lentokentällesi, sieltä lennon lähimpänä kohdettasi olevalle lentokentälle
                 ja sitten vielä kohteesi lentokentältä ajo-ohjeet kohteeseesi!</p>       
                 <p><br><br>Siinä on kaikki tarvittava sovelluksen käyttöön! <strong>Sitten vain Lomalle Loikoilemaan!</strong></p>
                
                   
            `
    content.innerHTML = html;
    //Close the window by clicking outside the box
    window.onclick = function (event) {
        if (event.target === modal) {
            document.getElementById('modal').style.display = "none";
        }
    };
})

//The Picture link in the nav
kuvia.addEventListener('click', function () {
    const modal = document.getElementById('modal');
    const content = document.getElementById('content');
    content.style.width = '50%';
    content.style.textAlign = 'center';
    modal.style.display = 'block';
    content.innerHTML = `
        <p>Yleisiä mainoskuvia: <br></p>
        <img src=../images/Kuva.jpg style="max-width: 80%" alt="Mainoskuva">
        <p><br></p>
        <img src=../images/kuuma.jpg style="max-width: 80%" alt="Kuva kuumasta">
        <p><br></p>
        <img src=../images/kylma.jpg style="max-width: 80%" alt="Kuva Kylmästä" >  
`
    window.onclick = function (event) {
        if (event.target === modal) {
            document.getElementById('modal').style.display = "none";
            content.style.textAlign = 'inherit';
            content.style.width = '60%';
        }
    };
})