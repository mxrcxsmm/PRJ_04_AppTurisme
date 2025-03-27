// Variables globales
let map = L.map('map').setView([41.38879, 2.15899], 13);
let userMarker;
let lugares = [];
let marcadores = [];
let userPosition = null;
let activeFilter = null;
let favoritosUsuario = [];
let userCircle = null;

// Configurar capa de mapa
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Configurar CSRF token para Axios
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

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
async function cargarLugaresCercanos() {
    if (!userPosition) return;

    try {
        const response = await axios.get('/api/lugares');
        lugares = response.data;
        await cargarFavoritos();

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
    } catch (error) {
        console.error('Error al cargar lugares:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los lugares',
            timer: 2000
        });
    }
}

// Función para filtrar por favoritos
function filtrarPorFavoritos() {
    if (!userPosition) return;

    if (favoritosUsuario.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Sin favoritos',
            text: 'No tienes lugares marcados como favoritos',
            timer: 2000
        });
        return;
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
        mostrarLugares([]);
        Swal.fire({
            icon: 'info',
            title: 'Favoritos no encontrados',
            text: 'No hay favoritos cercanos a tu ubicación',
            timer: 2000
        });
    }
}

// Cargar favoritos del usuario
async function cargarFavoritos() {
    try {
        const response = await axios.get('/user/favoritos');
        favoritosUsuario = response.data.map(fav => fav.lugar_id);
    } catch (error) {
        console.error('Error cargando favoritos:', error);
        favoritosUsuario = [];
    }
}

// Función para mostrar lugares
async function mostrarLugares(lugaresArray) {
    marcadores.forEach(marker => map.removeLayer(marker));
    marcadores = [];

    try {
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
                    <div class="row">
                    <button class="btn-favorito ${esFavorito ? 'active' : ''}" 
                            data-lugar-id="${lugar.id}">
                        ${esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    </button>
                    <button class="btn-favorito" id="verRuta">
                        Ver Ruta
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
                calcularRuta([lugar.latitud, lugar.longitud]);
                const popup = this.getPopup();
                const btn = popup._contentNode.querySelector('.btn-favorito');
                if (btn) {
                    const lugarId = parseInt(btn.dataset.lugarId);
                    const esFavorito = favoritosUsuario.includes(lugarId);
                    btn.textContent = esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos';
                    btn.classList.toggle('active', esFavorito);

                    btn.onclick = async function(e) {
                        e.stopPropagation();
                        const button = e.target;
                        const lugarId = parseInt(button.dataset.lugarId);

                        try {
                            const response = await axios.post(`/lugares/${lugarId}/favorito`);
                            const { status } = response.data;

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

                        } catch (error) {
                            console.error('Error:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'No se pudo completar la acción',
                                timer: 3000
                            });
                        }
                    };
                }
            });

            marker.addTo(map);
            marcadores.push(marker);
        });

    } catch (error) {
        console.error('Error al mostrar lugares:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los lugares',
            timer: 3000
        });
    }
}
let rutaLayer;

// Función para cerrar el panel
function cerrarPanel() {
    document.getElementById('infoPanel').classList.remove('open');
    document.querySelector('.filter-buttons').style.display = 'flex';
    if (rutaLayer) {
        map.removeLayer(rutaLayer);
    }
}
async function calcularRuta(destino) {
    if (rutaLayer) {
        map.removeLayer(rutaLayer);
    }

    navigator.geolocation.getCurrentPosition(async function (position) {
        const inicio = [position.coords.latitude, position.coords.longitude];
        const url = `https://router.project-osrm.org/route/v1/foot/${inicio[1]},${inicio[0]};${destino[1]},${destino[0]}?overview=full&geometries=geojson`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            const route = data.routes[0].geometry;
            
            rutaLayer = L.geoJSON(route, {
                style: { color: 'blue', weight: 4 }
            }).addTo(map);
            
            map.fitBounds(L.geoJSON(route).getBounds());
        } catch (error) {
            console.error('Error al calcular la ruta:', error);
        }
    }, function () {
        Swal.fire({
            icon: 'error',
            title: 'Ubicación no disponible',
            text: 'No se pudo obtener la ubicación del usuario.'
        });
    });
}


// Event listeners
document.addEventListener('click', async(e) => {
    if (e.target.classList.contains('btn-favorito')) {
        const button = e.target;
        const lugarId = parseInt(button.dataset.lugarId);

        try {
            const response = await axios.post(`/lugares/${lugarId}/favorito`);
            const { status } = response.data;

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

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo completar la acción',
                timer: 3000
            });
        }
    }
});

document.getElementById('searchBox').addEventListener('input', (e) => {
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
    button.addEventListener('click', () => {
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