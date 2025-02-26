window.onload = () => {
    
    const apiKey = "a84748ceaa7726544cb3a0bbef6994f2";
    const boton_buscar = document.getElementById("buscar");
    const ciudad = document.getElementById("busqueda");
    const annadir_favoritos = document.getElementById("favorito")
    const nombre_personalizado = document.getElementById("nombre_personalizado")
    const ir_favoritos = document.getElementById("ir_favoritos")
    

    let mapa = L.map('mapa').setView([40.4168, -3.7038], 5);


    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mapa);

    
    mapa.on("click", async function (event) {
        const lat = event.latlng.lat;
        const lon = event.latlng.lng;

        console.log(`Coordenadas clicadas: Latitud ${lat}, Longitud ${lon}`);

        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

        try {
            const respuesta = await axios.get(url);
            const datos = respuesta.data;

            document.getElementById("ciudad").innerText = `📍 Ciudad: ${datos.name}, ${datos.sys.country}`;
            document.getElementById("temperatura").innerText = `🌡️ Temperatura: ${datos.main.temp}°C`;
            document.getElementById("descripcion").innerText = `⛅ Clima: ${datos.weather[0].description}`;
            document.getElementById("sensacion").innerText = `🥵 Sensación térmica: ${datos.main.feels_like}°C`;
            document.getElementById("humedad").innerText = `💧 Humedad: ${datos.main.humidity}%`;
            document.getElementById("presion").innerText = `🌍 Presión atmosférica: ${datos.main.pressure} hPa`;
            document.getElementById("viento").innerText = `💨 Viento: ${datos.wind.speed} m/s`;
            document.getElementById("nubes").innerText = `☁️ Nubosidad: ${datos.clouds.all}%`;
            document.getElementById("amanecer").innerText = `🌅 Amanecer: ${new Date(datos.sys.sunrise * 1000).toLocaleTimeString()}`;
            document.getElementById("atardecer").innerText = `🌇 Atardecer: ${new Date(datos.sys.sunset * 1000).toLocaleTimeString()}`;

            ciudad.value =  datos.name
            nombre_personalizado.value = datos.name

        } catch (error) {
            console.error("Error obteniendo el clima:", error);
        }
    });

    
    boton_buscar.onclick = obtenerClima;

    
    async function obtenerClima() {
        ciudadd = ciudad.value;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudadd}&appid=${apiKey}&units=metric&lang=es`;

        try {
            const respuesta = await axios.get(url);
            const datos = respuesta.data;

            console.log(datos);

     
            const lat = datos.coord.lat;
            const lon = datos.coord.lon;

     
            mapa.setView([lat, lon], 10);
                document.getElementById("ciudad").innerText = `📍 Ciudad: ${datos.name}, ${datos.sys.country}`;
                document.getElementById("temperatura").innerText = `🌡️ Temperatura: ${datos.main.temp}°C`;
                document.getElementById("descripcion").innerText = `⛅ Clima: ${datos.weather[0].description}`;
                document.getElementById("sensacion").innerText = `🥵 Sensación térmica: ${datos.main.feels_like}°C`;
                document.getElementById("humedad").innerText = `💧 Humedad: ${datos.main.humidity}%`;
                document.getElementById("presion").innerText = `🌍 Presión atmosférica: ${datos.main.pressure} hPa`;
                document.getElementById("viento").innerText = `💨 Viento: ${datos.wind.speed} m/s`;
                document.getElementById("nubes").innerText = `☁️ Nubosidad: ${datos.clouds.all}%`;
                document.getElementById("amanecer").innerText = `🌅 Amanecer: ${new Date(datos.sys.sunrise * 1000).toLocaleTimeString()}`;
                document.getElementById("atardecer").innerText = `🌇 Atardecer: ${new Date(datos.sys.sunset * 1000).toLocaleTimeString()}`;

                nombre_personalizado.value = datos.name

        } catch (error) {
            console.error("Error obteniendo el clima:", error);
        }
    }

    

    ir_favoritos.onclick = () => {
        window.electron.send("navigate-to-favoritos");
    };




    
    annadir_favoritos.onclick = annadir_favorito

    








    async function annadir_favorito() {
        const nombre_lugar = ciudad.value
        nombre_pers = nombre_personalizado.value

        const annadirFav = await axios.get(`http://localhost:3000/annadirFavoritos/${nombre_lugar}/${nombre_pers}`)
        nombre_personalizado.value = ""
        ciudad.value = ""

        
    }


    ciudad.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            obtenerClima();
        }
    });
};
