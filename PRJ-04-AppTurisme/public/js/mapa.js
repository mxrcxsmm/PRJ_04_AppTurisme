// Variables globales
let map = L.map('map').setView([41.38879, 2.15899], 13);
let userMarker;
let lugares = [];
let marcadores = [];
let userPosition = null;
let activeFilter = null;
let userCircle = null; // Círculo alrededor del usuario

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

                // Crear un círculo alrededor del usuario con un radio de 400 metros
                userCircle = L.circle(userPosition, {
                    color: 'blue',
                    fillColor: '#add8e6',
                    fillOpacity: 0.3,
                    radius: 400 // Radio en metros
                }).addTo(map);
            } else {
                userMarker.setLatLng(userPosition);
                userCircle.setLatLng(userPosition); // Actualizar la posición del círculo
            }

            map.setView(userPosition);
            cargarLugaresCercanos();
        }, error => console.error("Error obteniendo la geolocalización:", error), {
            enableHighAccuracy: true
        });
    } else {
        console.error("Geolocalización no está disponible en este navegador.");
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

            // Filtrar lugares cercanos (400 metros de distancia)
            const lugaresCercanos = lugares.filter(lugar => {
                const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
                const distancia = userPosition.distanceTo(lugarLatLng);
                lugar.distancia = distancia; // Guardamos la distancia para mostrarla
                return distancia <= 400; // Filtrar lugares dentro de 400 metros
            });

            // Mostrar los lugares cercanos
            mostrarLugares(lugaresCercanos);

            // Centrar el mapa en la posición del usuario
            map.setView(userPosition, 13); // Zoom al nivel 13 para ver mejor el área
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
        const markerIcon = lugar.marker ? `/img/${lugar.marker}` : '/markers/user-marker.png';

        const marker = L.marker([lugar.latitud, lugar.longitud], {
            icon: L.icon({
                iconUrl: markerIcon,
                iconSize: [20, 24]
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

    const searchTerm = e.target.value.toLowerCase().trim(); // Eliminar espacios en blanco y convertir a minúsculas

    if (searchTerm.length === 0) {
        // Si el campo de búsqueda está vacío, cargar los lugares cercanos
        cargarLugaresCercanos();
        return;
    }

    const lugaresFiltered = lugares.filter(lugar => {
        const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
        const distancia = userPosition.distanceTo(lugarLatLng);

        // Buscar coincidencias en nombre o dirección
        const matchNombre = lugar.nombre.toLowerCase().includes(searchTerm);
        const matchDireccion = lugar.direccion.toLowerCase().includes(searchTerm);

        return matchNombre || matchDireccion; // No filtramos por distancia
    });

    if (lugaresFiltered.length > 0) {
        // Asignar distancia a cada lugar filtrado
        lugaresFiltered.forEach(lugar => {
            const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
            lugar.distancia = userPosition.distanceTo(lugarLatLng);
        });

        // Mostrar los lugares filtrados
        mostrarLugares(lugaresFiltered);

        // Centrar el mapa en el primer lugar encontrado
        const primerLugar = lugaresFiltered[0];
        const primerLugarLatLng = L.latLng(primerLugar.latitud, primerLugar.longitud);
        map.setView(primerLugarLatLng, 15); // Zoom al nivel 15 para ver mejor el lugar
    } else {
        // Limpiar marcadores si no hay resultados
        mostrarLugares([]);
        console.log("No se encontraron resultados para:", searchTerm);
    }
});

// Filtrar lugares por etiquetas
function filtrarLugares(tipo) {
    if (!userPosition) return;

    const lugaresFiltered = lugares.filter(lugar => {
        const lugarLatLng = L.latLng(lugar.latitud, lugar.longitud);
        const distancia = userPosition.distanceTo(lugarLatLng);

        // Verificar si el lugar tiene la etiqueta seleccionada
        const tieneEtiqueta = lugar.etiquetas && lugar.etiquetas.some(et => et.nombre === tipo);

        return distancia <= 5000 && tieneEtiqueta; // Filtrar por distancia y etiqueta
    });

    mostrarLugares(lugaresFiltered);
}

// Event listeners para los botones de filtro
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
        const tipo = button.getAttribute('data-etiqueta'); // Obtener el nombre de la etiqueta

        if (activeFilter === tipo) {
            activeFilter = null;
            button.classList.remove('active'); // Desactivar el botón
            cargarLugaresCercanos(); // Restaurar todos los lugares cercanos
        } else {
            // Desactivar botón anterior si existe
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));

            // Activar el botón actual
            button.classList.add('active');
            activeFilter = tipo;
            filtrarLugares(tipo); // Filtrar por la etiqueta seleccionada
        }
    });
});

// Inicializar
locateUser();