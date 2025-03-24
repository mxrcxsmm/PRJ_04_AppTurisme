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

// Función para actualizar la posición del marcador
function updateMarkerPosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const userLatLng = L.latLng(lat, lng);
    
    if (!userMarker) {
        userMarker = L.marker(userLatLng).addTo(map);
    } else {
        userMarker.setLatLng(userLatLng);
    }
    
    map.setView(userLatLng, 15);

    // Si el usuario está en un grupo, cargar lugares cercanos
    if (document.querySelector('.searching-text')) {
        loadNearbyPlaces(userLatLng);
    }
}

// Función para manejar errores de geolocalización
function handleLocationError(error) {
    let mensaje = '';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            mensaje = "Debes permitir la geolocalización para jugar.";
            break;
        case error.POSITION_UNAVAILABLE:
            mensaje = "La información de ubicación no está disponible.";
            break;
        case error.TIMEOUT:
            mensaje = "Se agotó el tiempo para obtener la ubicación.";
            break;
        default:
            mensaje = "Error desconocido de geolocalización.";
            break;
    }
    alert(mensaje);
}

// Limpiar marcadores existentes
function limpiarMarcadores() {
    marcadores.forEach(marker => map.removeLayer(marker));
    marcadores = [];
}

// Cargar lugares cercanos
function loadNearbyPlaces(userLatLng) {
    fetch('/api/lugares/cercanos')
        .then(function(response) { return response.json(); })
        .then(function(lugares) {
            limpiarMarcadores();
            
            lugares.forEach(function(lugar) {
                const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
                const distancia = userLatLng.distanceTo(lugarLatLng);

                // Solo mostrar lugares a menos de 100 metros
                if (distancia <= 100) {
                    const marker = L.marker(lugarLatLng)
                        .bindPopup(`
                            <h3>${lugar.nombre}</h3>
                            <p>${lugar.descripcion}</p>
                            <p>Distancia: ${Math.round(distancia)}m</p>
                        `);
                    
                    marker.addTo(map);
                    marcadores.push(marker);
                }
            });
        })
        .catch(function(error) {
            console.error('Error cargando lugares:', error);
        });
}

// Iniciar geolocalización
function startGeolocation() {
    if ("geolocation" in navigator) {
        const options = {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        };

        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
        }

        watchId = navigator.geolocation.watchPosition(
            updateMarkerPosition,
            handleLocationError,
            options
        );
    } else {
        alert("Tu navegador no soporta geolocalización");
    }
}

// Iniciar cuando se carga la página
document.addEventListener('DOMContentLoaded', startGeolocation);

// Limpiar al cerrar
window.addEventListener('beforeunload', function() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
});