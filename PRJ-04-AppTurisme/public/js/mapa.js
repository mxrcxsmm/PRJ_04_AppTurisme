// Variables globales
let map = L.map('map').setView([41.38879, 2.15899], 13);
let userMarker;
let lugares = [];
let marcadores = [];
let userPosition = null;
let activeFilter = null;
let favoritosUsuario = [];
let userCircle = null;
let routingControl = null;


// Configurar capa de mapa
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Obtener token CSRF
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

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
                        iconSize: [12, 12]
                    })
                }).addTo(map);

                // Crear círculo de 400m alrededor del usuario
                userCircle = L.circle(userPosition, {
                    color: 'blue',
                    fillColor: '#add8e6',
                    fillOpacity: 0.3,
                    radius: 400
                }).addTo(map);
            } else {
                userMarker.setLatLng(userPosition);
                userCircle.setLatLng(userPosition);
            }

            map.setView(userPosition);
            cargarLugaresCercanos();
        }, error => {
            console.error("Error obteniendo la geolocalización:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error de geolocalización',
                text: 'No se pudo obtener tu ubicación. Asegúrate de habilitar los permisos.',
                timer: 3000
            });
        }, {
            enableHighAccuracy: true
        });
    } else {
        console.error("Geolocalización no está disponible en este navegador.");
        Swal.fire({
            icon: 'error',
            title: 'Geolocalización no disponible',
            text: 'Tu navegador no soporta geolocalización',
            timer: 3000
        });
    }
}

// Cargar lugares cercanos desde la API
function cargarLugaresCercanos() {
    if (!userPosition) return;

    const formdata = new FormData();
    formdata.append('_token', csrfToken);

    fetch('/api/lugares', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            return response.json();
        })
        .then(data => {
            lugares = data;
            cargarFavoritos();

            const lugaresCercanos = lugares.filter(lugar => {
                const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
                const distancia = userPosition.distanceTo(lugarLatLng);
                lugar.distancia = distancia;
                return distancia <= 400;
            });

            if (activeFilter === 'Favoritos') {
                filtrarPorFavoritos();
            } else {
                mostrarLugares(lugaresCercanos);
            }

            map.setView(userPosition, 15);
        })
        .catch(error => {
            console.error('Error al cargar lugares:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los lugares',
                timer: 2000
            });
        });
}

// Función para filtrar por favoritos
function filtrarPorFavoritos() {
    if (!userPosition) return;

    if (favoritosUsuario.length === 0) {
        // Limpiar todos los marcadores
        marcadores.forEach(marker => map.removeLayer(marker));
        marcadores = [];

    }

    const lugaresFavoritos = lugares.filter(lugar => {
        const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
        const distancia = userPosition.distanceTo(lugarLatLng);
        lugar.distancia = distancia;
        return favoritosUsuario.includes(lugar.id) && distancia <= 400;
    });

    if (lugaresFavoritos.length > 0) {
        mostrarLugares(lugaresFavoritos);
    } else {
        // Limpiar todos los marcadores
        marcadores.forEach(marker => map.removeLayer(marker));
        marcadores = [];
    }
}
// Cargar favoritos del usuario
function cargarFavoritos() {
    const formdata = new FormData();
    formdata.append('_token', csrfToken);

    fetch('/user/favoritos', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar favoritos');
            return response.json();
        })
        .then(data => {
            favoritosUsuario = data.map(fav => fav.lugar_id);
        })
        .catch(error => {
            console.error('Error cargando favoritos:', error);
            favoritosUsuario = [];
        });
}

// Función para mostrar lugares
function mostrarLugares(lugaresArray) {
    // Limpiar marcadores y ruta existente
    marcadores.forEach(marker => map.removeLayer(marker));
    marcadores = [];

    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    lugaresArray.forEach(lugar => {
        const markerIcon = lugar.marker ? `${lugar.marker}` : '/markers/default.png';
        const esFavorito = favoritosUsuario.includes(lugar.id);

        const marker = L.marker([lugar.latitud, lugar.longitud], {
            icon: L.icon({
                iconUrl: markerIcon,
                iconSize: [32, 32],
                popupAnchor: [0, -15]
            })
        });

        const popupContent = `
            <div class="popup-content">
                <h4>${lugar.nombre}</h4>
                <p>${lugar.descripcion}</p>
                <p class="text-muted">${lugar.direccion}</p>
                <p>Distancia: ${Math.round(lugar.distancia)} metros</p>
                <div class="popup-buttons">
                    <button class="btn-favorito ${esFavorito ? 'active' : ''}" 
                            data-lugar-id="${lugar.id}">
                        ${esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    </button>
                    <button class="btn-ruta" data-lat="${lugar.latitud}" data-lng="${lugar.longitud}">
                        Cómo llegar
                    </button>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 300,
            minWidth: 200,
            className: 'custom-popup'
        });

        marker.on('popupopen', function() {
            const popup = this.getPopup();

            // Configurar botón de favoritos
            const btnFavorito = popup._contentNode.querySelector('.btn-favorito');
            if (btnFavorito) {
                btnFavorito.onclick = function(e) {
                    e.stopPropagation();
                    const button = e.target;
                    const lugarId = parseInt(button.dataset.lugarId);

                    const formdata = new FormData();
                    formdata.append('_token', csrfToken);

                    fetch(`/lugares/${lugarId}/favorito`, {
                            method: 'POST',
                            body: formdata
                        })
                        .then(response => {
                            if (!response.ok) throw new Error('Error en la respuesta del servidor');
                            return response.json();
                        })
                        .then(data => {
                            const { status } = data;

                            if (status === 'added') {
                                if (!favoritosUsuario.includes(lugarId)) {
                                    favoritosUsuario.push(lugarId);
                                }
                            } else {
                                favoritosUsuario = favoritosUsuario.filter(id => id !== lugarId);
                            }

                            button.textContent = status === 'added' ? 'Quitar de favoritos' : 'Añadir a favoritos';
                            button.classList.toggle('active', status === 'added');

                            document.querySelectorAll(`.btn-favorito[data-lugar-id="${lugarId}"]`).forEach(btn => {
                                btn.textContent = status === 'added' ? 'Quitar de favoritos' : 'Añadir a favoritos';
                                btn.classList.toggle('active', status === 'added');
                            });

                            if (activeFilter === 'Favoritos') {
                                filtrarPorFavoritos();
                            }

                            Swal.fire({
                                icon: status === 'added' ? 'success' : 'info',
                                title: status === 'added' ? '¡Añadido!' : '¡Eliminado!',
                                timer: 2000,
                                showConfirmButton: false
                            });
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'No se pudo completar la acción',
                                timer: 3000
                            });
                        });
                };
            }

            // Configurar botón de ruta con verificación
            const btnRuta = popup._contentNode.querySelector('.btn-ruta');
            if (btnRuta) {
                btnRuta.onclick = async function(e) {
                    e.stopPropagation();

                    if (!userPosition) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ubicación no disponible',
                            text: 'No se pudo obtener tu ubicación actual',
                            timer: 3000
                        });
                        return;
                    }

                    // Verificar y cargar Routing Machine si es necesario
                    if (typeof L.Routing === 'undefined') {
                        try {
                            await loadRoutingMachine();
                        } catch (error) {
                            console.error('Error cargando Routing Machine:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'No se pudo cargar la funcionalidad de rutas',
                                timer: 3000
                            });
                            return;
                        }
                    }

                    const destinoLat = parseFloat(btnRuta.dataset.lat);
                    const destinoLng = parseFloat(btnRuta.dataset.lng);

                    // Eliminar ruta anterior si existe
                    if (routingControl) {
                        map.removeControl(routingControl);
                        routingControl = null;
                    }

                    // Crear nueva ruta
                    routingControl = L.Routing.control({
                        waypoints: [
                            L.latLng(userPosition.lat, userPosition.lng),
                            L.latLng(destinoLat, destinoLng)
                        ],
                        routeWhileDragging: false,
                        showAlternatives: false,
                        fitSelectedRoutes: true,
                        addWaypoints: false,
                        draggableWaypoints: false,
                        lineOptions: {
                            styles: [{ color: '#3a70c2', opacity: 0.7, weight: 5 }]
                        },
                        createMarker: function() { return null; }
                    }).addTo(map);

                    // Centrar el mapa en la ruta
                    const bounds = L.latLngBounds([
                        [userPosition.lat, userPosition.lng],
                        [destinoLat, destinoLng]
                    ]);
                    map.fitBounds(bounds, { padding: [50, 50] });

                    // Actualizar el popup para mostrar el botón de eliminar ruta
                    updatePopupWithRouteControls(marker, lugar, esFavorito);
                };
            }
        });

        marker.addTo(map);
        marcadores.push(marker);
    });
}

// Función auxiliar para cargar Routing Machine dinámicamente
function loadRoutingMachine() {
    return new Promise((resolve, reject) => {
        if (typeof L.Routing !== 'undefined') return resolve();

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Función auxiliar para actualizar el popup con controles de ruta
function updatePopupWithRouteControls(marker, lugar, esFavorito) {
    const popupContent = `
        <div class="popup-content">
            <h4>${lugar.nombre}</h4>
            <p>${lugar.descripcion}</p>
            <p class="text-muted">${lugar.direccion}</p>
            <p>Distancia: ${Math.round(lugar.distancia)} metros</p>
            <div class="popup-buttons">
                <button class="btn-favorito ${esFavorito ? 'active' : ''}" 
                        data-lugar-id="${lugar.id}">
                    ${esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                </button>
                <button class="btn-ruta" data-lat="${lugar.latitud}" data-lng="${lugar.longitud}">
                    Actualizar ruta
                </button>
                <button class="btn-eliminar-ruta">Eliminar ruta</button>
            </div>
        </div>
    `;

    marker.getPopup().setContent(popupContent);

    // Configurar eventos para los nuevos botones
    const popup = marker.getPopup();
    const popupNode = popup._contentNode;

    if (popupNode) {
        const btnEliminar = popupNode.querySelector('.btn-eliminar-ruta');
        if (btnEliminar) {
            btnEliminar.onclick = function(e) {
                e.stopPropagation();
                if (routingControl) {
                    map.removeControl(routingControl);
                    routingControl = null;
                }
                mostrarLugares([lugar]); // Vuelve a mostrar el lugar sin ruta
            };
        }
    }
}
// Event listeners
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-favorito')) {
        const button = e.target;
        const lugarId = parseInt(button.dataset.lugarId);

        const formdata = new FormData();
        formdata.append('_token', csrfToken);

        fetch(`/lugares/${lugarId}/favorito`, {
                method: 'POST',
                body: formdata
            })
            .then(response => {
                if (!response.ok) throw new Error('Error en la respuesta del servidor');
                return response.json();
            })
            .then(data => {
                const { status } = data;

                button.textContent = status === 'added' ? 'Quitar de favoritos' : 'Añadir a favoritos';
                button.classList.toggle('active', status === 'added');

                document.querySelectorAll(`.btn-favorito[data-lugar-id="${lugarId}"]`).forEach(btn => {
                    btn.textContent = status === 'added' ? 'Quitar de favoritos' : 'Añadir a favoritos';
                    btn.classList.toggle('active', status === 'added');
                });

                if (activeFilter === 'Favoritos') {
                    filtrarPorFavoritos();
                }

                Swal.fire({
                    icon: status === 'added' ? 'success' : 'info',
                    title: status === 'added' ? '¡Añadido!' : '¡Eliminado!',
                    timer: 2000,
                    showConfirmButton: false
                });
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo completar la acción',
                    timer: 3000
                });
            });
    }
});

document.getElementById('searchBox').addEventListener('input', function(e) {
    if (!userPosition) return;

    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm.length === 0) {
        cargarLugaresCercanos();
        return;
    }

    const lugarEncontrado = lugares.find(lugar => {
        const matchNombreExacto = lugar.nombre.toLowerCase() === searchTerm;
        const matchNombreParcial = lugar.nombre.toLowerCase().includes(searchTerm);
        const matchDireccion = lugar.direccion.toLowerCase().includes(searchTerm);

        return matchNombreExacto || matchNombreParcial || matchDireccion;
    });

    if (lugarEncontrado) {
        const lugarLatLng = L.latLng(lugarEncontrado.latitud, lugarEncontrado.longitud);
        lugarEncontrado.distancia = userPosition.distanceTo(lugarLatLng);
        mostrarLugares([lugarEncontrado]);
        map.setView(lugarLatLng, 18);
    } else {
        mostrarLugares([]);
    }
});

function filtrarLugares(tipo) {
    if (!userPosition) return;

    const lugaresFiltered = lugares.filter(lugar => {
        const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
        const distancia = userPosition.distanceTo(lugarLatLng);
        lugar.distancia = distancia;

        const tieneEtiqueta = lugar.etiquetas && lugar.etiquetas.some(et => et.nombre === tipo);
        return distancia <= 400 && tieneEtiqueta;
    });

    mostrarLugares(lugaresFiltered);
}

document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', function() {
        const tipo = button.getAttribute('data-etiqueta');

        if (activeFilter === tipo) {
            activeFilter = null;
            button.classList.remove('active');
            cargarLugaresCercanos();
        } else {
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            activeFilter = tipo;

            if (tipo === 'Favoritos') {
                filtrarPorFavoritos();
            } else {
                filtrarLugares(tipo);
            }
        }
    });
});

// Inicializar
locateUser();
cargarFavoritos();