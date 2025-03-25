// Inicializar el mapa
let map = L.map('map').setView([41.38879, 2.15899], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Variables globales
let userMarker = null;
let watchId = null;
let marcadores = [];
let userPosition = null;
let activeFilter = null;

// Geolocalización del usuario
function locateUser() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            userPosition = L.latLng(lat, lng);

            if (!userMarker) {
                userMarker = L.marker(userPosition, {
                    icon: L.icon({
                        iconUrl: '/img/user-marker.png',
                        iconSize: [22, 32]
                    })
                }).addTo(map);
            } else {
                userMarker.setLatLng(userPosition);
            }

            map.setView(userPosition);
            cargarLugaresCercanos();
        }, error => console.error("Error obteniendo la geolocalización:", error), {
            enableHighAccuracy: true
        });
    }
}

// Cargar lugares cercanos desde la API
function cargarLugaresCercanos() {
    if (!userPosition) return;

    fetch('/api/lugares')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar lugares');
            }
            return response.json();
        })
        .then(data => {
            lugares = data;

            // Filtrar lugares cercanos (5 kilometros de distancia)
            const lugaresCercanos = lugares.filter(lugar => {
                const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
                const distancia = userPosition.distanceTo(lugarLatLng);
                lugar.distancia = distancia; // Guardamos la distancia para mostrarla
                return distancia <= 5000;
            });

            if (activeFilter) {
                filtrarLugares(activeFilter);
            } else {
                mostrarLugares(lugaresCercanos);
            }
        })
        .catch(error => {
            console.error('Error al cargar lugares:', error);
        });
}

function mostrarInfoLugar(lugar) {
    // 1️⃣ Título del lugar
    document.getElementById('infoTitle').textContent = lugar.nombre;

    // 2️⃣ Categorías (Discoteca, Ocio, Museo, etc.)
    const categoriesDiv = document.getElementById('infoCategories');
    categoriesDiv.innerHTML = ''; // Limpiar antes de agregar nuevas categorías

    lugar.categorias.forEach(cat => {
        const button = document.createElement('button');
        button.textContent = cat.nombre;
        button.style.backgroundColor = cat.color;
        button.classList.add('category-button'); // Agregamos una clase para el diseño
        categoriesDiv.appendChild(button);
    });

    // 3️⃣ Imágenes del lugar
    const imagesDiv = document.getElementById('infoImages');
    imagesDiv.innerHTML = ''; // Limpiar antes de agregar nuevas imágenes

    lugar.imagenes.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = img.url;
        imgElement.classList.add('info-image'); // Agregamos una clase para el diseño
        imagesDiv.appendChild(imgElement);
    });

    // 4️⃣ Descripción del lugar
    document.getElementById('infoDescription').textContent = lugar.descripcion;

    // 5️⃣ Botón de Punto de Control
    const controlButton = document.createElement('button');
    controlButton.textContent = `PUNTO DE CONTROL ${lugar.id}`;
    controlButton.classList.add('control-button');
    controlButton.onclick = () => {
        alert(`Has activado el Punto de Control ${lugar.id}`);
    };

    const controlDiv = document.getElementById('infoControl');
    controlDiv.innerHTML = ''; // Limpiar antes de agregar
    controlDiv.appendChild(controlButton);

    // 6️⃣ Mostrar el panel de información
    document.getElementById('infoPanel').style.display = 'block';
}

function mostrarLugares(lugaresArray) {
    marcadores.forEach(marker => map.removeLayer(marker));
    marcadores = [];

    lugaresArray.forEach(lugar => {
        const markerIcon = lugar.marker ? `/img/${lugar.marker}` : '/img/user-marker.png';

        const marker = L.marker([lugar.latitud, lugar.longitud], {
            icon: L.icon({
                iconUrl: markerIcon,
                iconSize: [32, 32]
            })
        });

        marker.on('click', () => mostrarInfoLugar(lugar)); // Evento click

        marker.addTo(map);
        marcadores.push(marker);
    });
}


// Búsqueda de lugares
document.getElementById('searchBox').addEventListener('input', (e) => {
    if (!userPosition) return;

    const searchTerm = e.target.value.toLowerCase();
    const lugaresFiltered = lugares.filter(lugar => {
        const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
        const distancia = userPosition.distanceTo(lugarLatLng);
        return distancia <= 5000 && lugar.nombre.toLowerCase().includes(searchTerm);
    });

    mostrarLugares(lugaresFiltered);
});

// Filtrar lugares por etiquetas
function filtrarLugares(tipo) {
    if (!userPosition) return;

    const lugaresFiltered = lugares.filter(lugar => {
        const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
        const distancia = userPosition.distanceTo(lugarLatLng);
        const tieneEtiqueta = lugar.etiquetas && lugar.etiquetas.some(et => et.nombre === tipo);
        return distancia <= 5000 && tieneEtiqueta;
    });

    mostrarLugares(lugaresFiltered);
}

// Event listeners para los botones de filtro
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
        const tipo = button.textContent;

        // Toggle del filtro activo
        if (activeFilter === tipo) {
            activeFilter = null;
            button.classList.remove('active');
            cargarLugaresCercanos();
        } else {
            // Desactivar botón anterior si existe
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            activeFilter = tipo;
            filtrarLugares(tipo);
        }
    });
});

// Inicializar
locateUser();
