//Function that fetches the Current Weather Data from the OpenWeatherMap API
function haePaivanTiedot(cord) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${cord.lat}&lon=${cord.long}&appid=${key}&lang=fi&units=metric`
    fetch(url)
        .then(function (rsp) {
            return rsp.json();
        }).then(function (tiedot) {
        console.log(tiedot);
        listaaPaivanTietoja(tiedot);
    });
}
//Displays the weather info from the clicked spot for today
function listaaPaivanTietoja(info) {
    //Makes the map a little smaller and makes the area where the
    kartta.style.width = '70%';
    infoja.classList.replace('hidden', 'visible');
    if (avauksia > 0) {
        but.classList.replace('visible', 'hidden');
    }
    lentoTietoNappi.classList.replace('hidden', 'visible');
    nappi.classList.replace('hidden', 'visible');
    document.getElementById('kaupunki').innerHTML = info.name;
    document.getElementById('lampo').innerHTML = `<strong>Lämpötila:</strong> ${info.main.temp.toFixed(0)}C°`;
    document.getElementById('tuntuu').innerHTML = `<strong>Tuntuu:</strong> ${info.main.feels_like.toFixed(0)}C°`;
    const tilanne = info.weather[0].description;
    document.getElementById('desc').innerHTML = `<strong>Tämän hetken säätilanne:</strong> ${tilanne.charAt(0).toUpperCase() + tilanne.slice(1)}<br>`;
    const img = document.getElementById('img');
    img.src = `https://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png`;
    map.flyTo([info.coord.lat, info.coord.lon], 11);
    toCoords.lat = info.coord.lat;
    toCoords.lon = info.coord.lon;
}
//Function that fetches the Weather data for the next week from the OpenWeatherMap API
function haeViikonTiedot(cord) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${cord.lat}&lon=${cord.long}&units=metric&lang=fi&appid=${key}`;
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
    const lista = document.getElementById('lista');
    if (lista !== null) {
        lista.innerHTML = '';
    }
    for (let i = 1; i < info.daily.length; i++) {
        const paiva = `${info.daily[i].dt}000`;
        const paivaString = new Date(parseInt(paiva)).toLocaleDateString('en-GB', {timeZone: `${info.timezone}`})
        const weather = info.daily[i].weather[0].description;
        const li = document.createElement('li');
        const icon = document.createElement('img');
        icon.src = `https://openweathermap.org/img/wn/${info.daily[i].weather[0].icon}@2x.png`;
        icon.alt = 'Pikkukuvake';
        li.appendChild(icon);
        li.appendChild(document.createElement('br'));
        const date = document.createElement('strong');
        const br = document.createElement('br');
        date.appendChild(document.createTextNode(`${paivaString}`));
        li.appendChild(date);
        li.appendChild(br);
        const data = document.createElement('p');
        const strong = document.createElement('strong');
        strong.appendChild(document.createTextNode('Päivän yleistilanne:'));
        data.appendChild(strong);
        data.appendChild(document.createTextNode(` ${weather.charAt(0).toUpperCase() + weather.slice(1)}`));
        li.appendChild(data);
        li.appendChild(br);
        const strong2 = document.createElement('strong');
        strong2.appendChild(document.createTextNode('Lämpötila:'));
        const temp = document.createElement('p');
        temp.appendChild(strong2);
        temp.appendChild(document.createTextNode(` ${info.daily[i].feels_like.day.toFixed(0)} C°`));
        li.appendChild(temp);
        li.appendChild(br);
        const nousu = `${info.daily[i].sunrise.toString()}000`;
        const nousuData = new Date(parseInt(nousu)).toLocaleTimeString('en-GB', {timeZone: `${info.timezone}`});
        console.log(nousuData);
        let lasku = `${info.daily[i].sunset.toString()}000`;
        const laskuData = new Date(parseInt(lasku)).toLocaleTimeString('en-GB', {timeZone: `${info.timezone}`});
        let valoisatunti = parseInt(laskuData) - parseInt(nousuData);
        let valoisamin = parseInt(laskuData.split(':')[1]) - parseInt(nousuData.split(':')[1])
        if (valoisamin < 0) {
            valoisatunti--;
            valoisamin = 60 + valoisamin;
        }
        const aurinkoDataa = {
            sunrise: `${nousuData.split(':')[0]}:${nousuData.split(':')[1]}`,
            sunset: `${laskuData.split(':')[0]}:${laskuData.split(':')[1]}`,
            light: `${valoisatunti} tuntia ${valoisamin} minuuttia`,
        }
        console.log(aurinkoDataa);
        const link = document.createElement('a');
        link.textContent = 'Lisätietoja';
        link.setAttribute('href', '#');
        link.addEventListener('click', function () {
            const modal = document.getElementById('modal');
            const content = document.getElementById('content');
            modal.style.display = 'block';
            const html = `        
            <h1><strong>Päivän tarkemmat tiedot</strong></h1>
            <p><strong>${paivaString}</strong></p>
            <p><strong>Yleistilanne:</strong> ${weather.charAt(0).toUpperCase() + weather.slice(1)}</p>
            <p><strong>Korkein lämpötila:</strong> ${info.daily[i].temp.max.toFixed(0)}C°</p>
            <p><strong>Alhaisin lämpötila:</strong> ${info.daily[i].temp.min.toFixed(0)}C°</p>
            <p><strong>Miltä lämpötila tuntuu:</strong> ${info.daily[i].feels_like.day.toFixed(0)}C°</p>
            <p><br></p>
            <p><strong>Aurinko nousee:</strong> Klo ${aurinkoDataa.sunrise}</p>
            <p><strong>Aurinko laskee:</strong> Klo ${aurinkoDataa.sunset}</p>
            <p><strong>Valoisaa aikaa päivässä:</strong> ${aurinkoDataa.light}</p>
            `;
            content.innerHTML = html;
            window.onclick = function (event) {
                if (event.target === modal) {
                    document.getElementById('modal').style.display = "none";
                }
            };
        })
        li.appendChild(link);
        lista.appendChild(li);
    }
}
