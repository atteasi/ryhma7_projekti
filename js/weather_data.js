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
    document.getElementById('tuntuu').innerHTML = `Tuntuu: ${info.main.feels_like}C°`;
    const tilanne = info.weather[0].description;
    document.getElementById('desc').innerHTML = `Tämän hetken säätilanne: ${tilanne.charAt(0).toUpperCase() + tilanne.slice(1)}`;
    const img = document.getElementById('img');
    img.src = `http://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png`;
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