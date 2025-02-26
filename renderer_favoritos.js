
window.onload = () => {
    // const { DataFrame } = window.dataForge;
    const index = document.getElementById("index");
    index.onclick = () => {
        window.electron.send("navigate-to-index"); 
    }

    const peticion = "http://localhost:3000/leerfavoritos";
    const apiKey = "a84748ceaa7726544cb3a0bbef6994f2";

    let ciudadesTemperaturas = [];

    async function listarLugares() {
        try {
            const respuesta = await axios.get(peticion);
            const datos = respuesta.data;
            
            const contenedor = document.getElementById("lista-lugares");

            for (let element of datos) {

                let p = document.createElement("p");
                p.innerText = element.nombre_personalizado;
    
                let divInformacion = document.createElement("div");
                divInformacion.classList.add("hidden");
                divInformacion.id = `informacion-${element.nombre_personalizado}`;
    
           
                let url = `https://api.openweathermap.org/data/2.5/weather?q=${element.nombre_lugar}&appid=${apiKey}&units=metric&lang=es`;
                let respuestaClima = await axios.get(url);
                let info = respuestaClima.data;

               
                ciudadesTemperaturas.push({
                    ciudad: info.name,
                    temperatura: info.main.temp,
                    pais: info.sys.country
                });

             
                let infoContenido = document.createElement("p");
                infoContenido.innerText = `📍 Ciudad: ${info.name}, ${info.sys.country}\n` + 
                                          `🌡️ Temperatura: ${info.main.temp}°C\n` + 
                                          `⛅ Clima: ${info.weather[0].description}\n` + 
                                          `🥵 Sensación térmica: ${info.main.feels_like}°C\n` + 
                                          `💧 Humedad: ${info.main.humidity}%\n` + 
                                          `🌍 Presión atmosférica: ${info.main.pressure} hPa`;
                divInformacion.appendChild(infoContenido);

                let btnDesvelar = document.createElement("button");
                btnDesvelar.classList.add("botonInformacion");
                btnDesvelar.innerText = `Ver más sobre ${element.nombre_personalizado}`;
                btnDesvelar.onclick = () => {
                   
                    divInformacion.classList.toggle("hidden");
                };
    
    
                contenedor.appendChild(p);
                contenedor.appendChild(btnDesvelar);
                contenedor.appendChild(divInformacion);
            }

            
            const df = new DataFrame(ciudadesTemperaturas);

            const ciudadMasCaliente = df
                .orderByDescending(row => row.temperatura)
                .first();

            const ciudadMasFria = df
                .orderBy(row => row.temperatura)
                .first();

           
            const promedioTemperatura = df
                .select(row => row.temperatura)
                .average();


            

            const estadisticas = document.getElementById("estadisticas");
            estadisticas.innerText = `📊 Estadísticas:
                                      \n 🌡️ Ciudad más caliente: ${ciudadMasCaliente.ciudad} (${ciudadMasCaliente.temperatura}°C)
                                      \n ❄️ Ciudad más fría: ${ciudadMasFria.ciudad} (${ciudadMasFria.temperatura}°C)
                                      \n 📊 Promedio de temperaturas: ${promedioTemperatura.toFixed(2)}°C`;

        } catch (error) {
            console.error("Error al obtener los lugares:", error);
        }
    }

    listarLugares();
};
