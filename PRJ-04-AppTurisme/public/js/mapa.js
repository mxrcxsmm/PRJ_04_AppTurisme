// Variables globales
let map = L.map('map').setView([41.38879, 2.15899], 13);
let userMarker;
let lugares = [];
let marcadores = [];
let userPosition = null;
let activeFilter = null;
let favoritosUsuario = [];

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
            } else {
                userMarker.setLatLng(userPosition);
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

        // Cargar favoritos del usuario
        await cargarFavoritos();

        // Filtrar lugares cercanos (5 kilómetros de distancia)
        const lugaresCercanos = lugares.filter(lugar => {
            const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
            const distancia = userPosition.distanceTo(lugarLatLng);
            lugar.distancia = distancia;
            return distancia <= 5000;
        });

        // Si el filtro de favoritos está activo, aplicar filtro
        if (activeFilter === 'Favoritos') {
            filtrarPorFavoritos();
        } else {
            mostrarLugares(lugaresCercanos);
        }

        // Centrar el mapa en la posición del usuario
        map.setView(userPosition, 13);
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

    const lugaresFavoritos = lugares.filter(lugar => {
        const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
        const distancia = userPosition.distanceTo(lugarLatLng);
        lugar.distancia = distancia;
        return favoritosUsuario.includes(lugar.id) && distancia <= 5000;
    });

    if (lugaresFavoritos.length > 0) {
        mostrarLugares(lugaresFavoritos);
    } else {
        mostrarLugares([]);

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
    // Limpiar marcadores existentes
    marcadores.forEach(marker => map.removeLayer(marker));
    marcadores = [];

    try {
        // Crear marcadores para cada lugar
        lugaresArray.forEach(lugar => {
            const markerIcon = lugar.marker ? `${lugar.marker}` : '/markers/default.png';
            const esFavorito = favoritosUsuario.includes(lugar.id);

            // Crear marcador
            const marker = L.marker([lugar.latitud, lugar.longitud], {
                icon: L.icon({
                    iconUrl: markerIcon,
                    iconSize: [32, 32],
                    popupAnchor: [0, -15]
                })
            });

            // Crear contenido del popup
            const popupContent = `
                <div class="popup-content">
                    <h4>${lugar.nombre}</h4>
                    <p>${lugar.descripcion}</p>
                    <p class="text-muted">${lugar.direccion}</p>
                    <p>Distancia: ${Math.round(lugar.distancia)} metros</p>
                    <button class="btn-favorito ${esFavorito ? 'active' : ''}" 
                            data-lugar-id="${lugar.id}">
                        ${esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    </button>
                </div>
            `;

            // Asignar popup al marcador
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                minWidth: 200,
                className: 'custom-popup'
            });

            // Evento al abrir popup para actualizar estado
            marker.on('popupopen', function() {
                const popup = this.getPopup();
                const btn = popup._contentNode.querySelector('.btn-favorito');
                if (btn) {
                    const lugarId = parseInt(btn.dataset.lugarId);
                    const esFavorito = favoritosUsuario.includes(lugarId);
                    btn.textContent = esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos';
                    btn.classList.toggle('active', esFavorito);

                    // Manejar clic directamente en este botón
                    btn.onclick = async function(e) {
                        e.stopPropagation();
                        const button = e.target;
                        const lugarId = parseInt(button.dataset.lugarId);

                        try {
                            const response = await axios.post(`/lugares/${lugarId}/favorito`);
                            const { status } = response.data;

                            // Actualizar estado global
                            if (status === 'added') {
                                if (!favoritosUsuario.includes(lugarId)) {
                                    favoritosUsuario.push(lugarId);
                                }
                            } else {
                                favoritosUsuario = favoritosUsuario.filter(id => id !== lugarId);
                            }

                            // Actualizar este botón
                            button.textContent = status === 'added' ? 'Quitar de favoritos' : 'Añadir a favoritos';
                            button.classList.toggle('active', status === 'added');

                            // Actualizar todos los botones para este lugar
                            document.querySelectorAll(`.btn-favorito[data-lugar-id="${lugarId}"]`).forEach(btn => {
                                btn.textContent = status === 'added' ? 'Quitar de favoritos' : 'Añadir a favoritos';
                                btn.classList.toggle('active', status === 'added');
                            });

                            // Si estamos en el filtro de favoritos, actualizar la vista
                            if (activeFilter === 'Favoritos') {
                                filtrarPorFavoritos();
                            }

                            // Mostrar notificación
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

            // Añadir marcador al mapa y al array
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

// Evento para botones de favoritos
document.addEventListener('click', async(e) => {
    if (e.target.classList.contains('btn-favorito')) {
        const button = e.target;
        const lugarId = parseInt(button.dataset.lugarId);
        const isActive = button.classList.contains('active');

        try {
            const response = await axios.post(`/lugares/${lugarId}/favorito`);
            const { status } = response.data;

            // Actualización inmediata del botón
            button.textContent = status === 'added' ? 'Quitar de favoritos' : 'Añadir a favoritos';
            button.classList.toggle('active', status === 'added');

            // Actualizar todos los botones para este lugar
            document.querySelectorAll(`.btn-favorito[data-lugar-id="${lugarId}"]`).forEach(btn => {
                btn.textContent = status === 'added' ? 'Quitar de favoritos' : 'Añadir a favoritos';
                btn.classList.toggle('active', status === 'added');
            });

            // Si estamos en el filtro de favoritos, actualizar la vista
            if (activeFilter === 'Favoritos') {
                filtrarPorFavoritos();
            }

            // Mostrar notificación
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

// Búsqueda de lugares
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

// Filtrar lugares por etiquetas
function filtrarLugares(tipo) {
    if (!userPosition) return;

    const lugaresFiltered = lugares.filter(lugar => {
        const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
        const distancia = userPosition.distanceTo(lugarLatLng);
        lugar.distancia = distancia;

        const tieneEtiqueta = lugar.etiquetas && lugar.etiquetas.some(et => et.nombre === tipo);
        return distancia <= 5000 && tieneEtiqueta;
    });

    mostrarLugares(lugaresFiltered);
}

// Event listeners para los botones de filtro
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