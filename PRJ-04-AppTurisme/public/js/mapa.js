let map = L.map('map').setView([41.38879, 2.15899], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// Variables globales
let userMarker;
let lugares = [];
let marcadores = [];
let userPosition = null;
let activeFilter = null;

// Geolocalización del usuario
function locateUser() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            userPosition = L.latLng(lat, lng);
            
            if (!userMarker) {
                userMarker = L.marker(userPosition, {
                    icon: L.icon({
                        iconUrl: '/images/user-marker.png',
                        iconSize: [32, 32]
                    })
                }).addTo(map);
            } else {
                userMarker.setLatLng(userPosition);
            }
            
            map.setView(userPosition);
            cargarLugaresCercanos();
        });
    }
}

// Cargar lugares cercanos
async function cargarLugaresCercanos() {
    if (!userPosition) return;

    try {
        const response = await axios.get('/api/lugares');
        lugares = response.data;
        
        // Filtrar lugares por distancia (100 metros) usando Leaflet
        const lugaresCercanos = lugares.filter(lugar => {
            const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
            const distancia = userPosition.distanceTo(lugarLatLng);
            lugar.distancia = distancia;
            return distancia <= 100;
        });

        if (activeFilter) {
            filtrarLugares(activeFilter);
        } else {
            mostrarLugares(lugaresCercanos);
        }
    } catch (error) {
        console.error('Error al cargar lugares:', error);
    }
}

// Mostrar lugares en el mapa
function mostrarLugares(lugaresArray) {
    // Limpiar marcadores existentes
    marcadores.forEach(marker => map.removeLayer(marker));
    marcadores = [];

    lugaresArray.forEach(lugar => {
        const marker = L.marker([lugar.latitud, lugar.longitud], {
            icon: L.icon({
                iconUrl: lugar.marker || '/images/default-marker.png',
                iconSize: [32, 32]
            })
        });

        marker.bindPopup(`
            <h3>${lugar.nombre}</h3>
            <p>${lugar.descripcion}</p>
            <p>${lugar.direccion}</p>
            <p>Distancia: ${Math.round(lugar.distancia)}m</p>
        `);

        marker.addTo(map);
        marcadores.push(marker);
    });
}

// Búsqueda de lugares
document.getElementById('searchBox').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const lugaresFiltered = lugares.filter(lugar => {
        const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
        const distancia = userPosition.distanceTo(lugarLatLng);
        return distancia <= 100 && lugar.nombre.toLowerCase().includes(searchTerm);
    });
    mostrarLugares(lugaresFiltered);
});

// Filtrado por botones
function filtrarLugares(tipo) {
    if (!userPosition) return;
    
    const lugaresFiltered = lugares.filter(lugar => {
        const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
        const distancia = userPosition.distanceTo(lugarLatLng);
        const tieneEtiqueta = lugar.etiquetas.some(et => et.nombre === tipo);
        return distancia <= 100 && tieneEtiqueta;
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
            document.querySelectorAll('.filter-button').forEach(btn => 
                btn.classList.remove('active')
            );
            button.classList.add('active');
            activeFilter = tipo;
            filtrarLugares(tipo);
        }
    });
});

// Inicializar
locateUser();