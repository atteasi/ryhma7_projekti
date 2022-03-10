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
    //Makes the map a little smaller and displays the side panel on the right side
    infoja.classList.replace('hidden', 'visible');
    if (avauksia > 0) {
        but.classList.replace('visible', 'hidden');
    }
    //Shows the Route button and the Close sidepanel button
    lentoTietoNappi.classList.replace('hidden', 'visible');
    nappi.classList.replace('hidden', 'visible');
    //Selects the target tag by id and changes its content to show weather data
    document.getElementById('kaupunki').innerHTML = info.name;
    document.getElementById('lampo').innerHTML = `<strong>Lämpötila:</strong> ${info.main.temp.toFixed(0)}C°`;
    document.getElementById('tuntuu').innerHTML = `<strong>Tuntuu:</strong> ${info.main.feels_like.toFixed(0)}C°`;
    const tilanne = info.weather[0].description;
    document.getElementById('desc').innerHTML = `<strong>Tämän hetken säätilanne:</strong> ${tilanne.charAt(0).toUpperCase() + tilanne.slice(1)}<br>`;
    const img = document.getElementById('img');
    img.src = `https://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png`;
    map.flyTo([info.coord.lat, info.coord.lon], 11);
    //Sets up the coodinate object with the clicked spot coordinates
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
        //Gets the date from the Weather API and transforms it to our date format
        const paiva = `${info.daily[i].dt}000`;
        const paivaString = new Date(parseInt(paiva)).toLocaleDateString('en-GB', {timeZone: `${info.timezone}`})
        //Creates things to present inside the list and adds weather data to them
        const weather = info.daily[i].weather[0].description;
        const li = document.createElement('li');
        //The miniature icon on the rightmost side of each day
        const icon = document.createElement('img');
        icon.src = `https://openweathermap.org/img/wn/${info.daily[i].weather[0].icon}@2x.png`;
        icon.alt = 'Pikkukuvake';
        li.appendChild(icon);
        li.appendChild(document.createElement('br'));
        const date = document.createElement('strong');
        const br = document.createElement('br');
        //Prints the date
        date.appendChild(document.createTextNode(`${paivaString}`));
        li.appendChild(date);
        li.appendChild(br);
        //Prints the weather forecast for that day
        const data = document.createElement('p');
        const strong = document.createElement('strong');
        strong.appendChild(document.createTextNode('Päivän yleistilanne:'));
        data.appendChild(strong);
        data.appendChild(document.createTextNode(` ${weather.charAt(0).toUpperCase() + weather.slice(1)}`));
        li.appendChild(data);
        li.appendChild(br);
        //Prints the temperature for that day
        const strong2 = document.createElement('strong');
        strong2.appendChild(document.createTextNode('Lämpötila:'));
        const temp = document.createElement('p');
        temp.appendChild(strong2);
        temp.appendChild(document.createTextNode(` ${info.daily[i].feels_like.day.toFixed(0)} C°`));
        li.appendChild(temp);
        li.appendChild(br);
        //Gets the time when the sun rises and sets.
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
        console.log(info);
        //Creates the link to show additional information
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
            <ul>
            <li>
                <p><strong>Lämpötila aamulla:</strong> ${info.daily[i].feels_like.morn.toFixed(0)}°C</p>
            </li>
            <li>    
                <p><strong>Lämpötila päivällä:</strong> ${info.daily[i].feels_like.day.toFixed(0)}°C</p>
            </li>
            <li>
                <p><strong>Lämpötila illalla:</strong> ${info.daily[i].feels_like.eve.toFixed(0)}°C</p>
            </li>
            </ul>
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
