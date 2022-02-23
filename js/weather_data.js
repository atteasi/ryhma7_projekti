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
    document.getElementById('lampo').innerHTML = `<strong>Lämpötila:</strong> ${info.main.temp.toFixed(0)}C°`;
    document.getElementById('tuntuu').innerHTML = `<strong>Tuntuu:</strong> ${info.main.feels_like.toFixed(0)}C°`;
    const tilanne = info.weather[0].description;
    document.getElementById('desc').innerHTML = `<strong>Tämän hetken säätilanne:</strong> ${tilanne.charAt(0).toUpperCase() + tilanne.slice(1)}`;
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
        listaaViikonTiedot(tiedot);
    });
}
//Function to Display simple info for the next seven days
function listaaViikonTiedot(info) {
    const paiva = new Date();
    let day = paiva.getDate();
    const month = paiva.getMonth()+1;
    let mmyy = `${paiva.getMonth() + 1}.${(paiva.getFullYear())}`
    const tasan_paivia = [4,9,11];
    const pariton_paivia = [1,3,5,7,8,10,12];
    const lista = document.getElementById('lista');
    if(lista !== null){
        lista.innerHTML = '';
    }
    for(let i = 1;i < info.daily.length;i++){
        day++;
        if(day === 29 && month === 2) {
            day = 1;
            mmyy = `${paiva.getMonth() + 2}.${paiva.getFullYear()}`
        }
        const li = document.createElement('li');
        const date = document.createTextNode(`${day}.${mmyy} \n ${info.daily[i].feels_like.day.toFixed(0).toString()}`);
        li.appendChild(date);
        lista.appendChild(li);
    }
}