document.addEventListener('DOMContentLoaded', function() {

    // ================= Validaciones Comunes =================
    function validateNombre() {
        var nombreElem = document.getElementById('nombre');
        if (nombreElem) {
            var value = nombreElem.value.trim();
            var errorElem = document.getElementById('nombreError');
            errorElem.textContent = (value === "") ? "El nombre es obligatorio." : "";
        }
    }

    function validateDescripcion() {
        var descripcionElem = document.getElementById('descripcion');
        if (descripcionElem) {
            var value = descripcionElem.value.trim();
            var errorElem = document.getElementById('descripcionError');
            errorElem.textContent = (value === "") ? "La descripción es obligatoria." : "";
        }
    }

    function validateDireccion() {
        var direccionElem = document.getElementById('direccion');
        if (direccionElem) {
            var value = direccionElem.value.trim();
            var errorElem = document.getElementById('direccionError');
            errorElem.textContent = (value === "") ? "La dirección es obligatoria." : "";
        }
    }

    function validateLatitud() {
        var latitudElem = document.getElementById('latitud');
        if (latitudElem) {
            var value = latitudElem.value.trim();
            var errorElem = document.getElementById('latitudError');
            errorElem.textContent = (value === "" || isNaN(value)) ? "La latitud debe ser un número válido." : "";
        }
    }

    function validateLongitud() {
        var longitudElem = document.getElementById('longitud');
        if (longitudElem) {
            var value = longitudElem.value.trim();
            var errorElem = document.getElementById('longitudError');
            errorElem.textContent = (value === "" || isNaN(value)) ? "La longitud debe ser un número válido." : "";
        }
    }

    function validateMarker() {
        var markerElem = document.getElementById('marker');
        if (markerElem) {
            var errorElem = document.getElementById('markerError');
            errorElem.textContent = (markerElem.files.length === 0) ? "Debes subir un icono." : "";
        }
    }

    // En edición, marker es opcional; solo se valida si se selecciona uno.
    function validateMarkerEdit() {
        var markerElem = document.getElementById('marker');
        if (markerElem) {
            var errorElem = document.getElementById('markerError');
            errorElem.textContent = ""; // No se valida si no se selecciona
        }
    }

    function validateEtiquetas() {
        var etiquetasElem = document.getElementById('etiquetas');
        if (etiquetasElem) {
            var errorElem = document.getElementById('etiquetasError');
            errorElem.textContent = (etiquetasElem.selectedOptions.length === 0) ? "Debes seleccionar al menos una etiqueta." : "";
        }
    }

    // Para validar que se seleccione al menos 4 puntos de control (usado en Gimcana)
    function validatePuntosControl() {
        var puntosElem = document.getElementById('puntos_control');
        if (puntosElem) {
            var errorElem = document.getElementById('puntosControlError');
            errorElem.textContent = (puntosElem.selectedOptions.length < 4) ? "Debes seleccionar al menos 4 puntos de control." : "";
        }
    }

    // ================= Geocodificación (Lugares) =================
    var btnGeocode = document.getElementById('btn-geocode');
    if (btnGeocode) {
        btnGeocode.addEventListener('click', function() {
            var direccionElem = document.getElementById('direccion');
            if (!direccionElem) return;
            var direccion = direccionElem.value;
            if (!direccion) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atención',
                    text: 'Ingresa una dirección.'
                });
                return;
            }
            fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(direccion))
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        var latElem = document.getElementById('latitud');
                        var lonElem = document.getElementById('longitud');
                        if (latElem && lonElem) {
                            latElem.value = data[0].lat;
                            lonElem.value = data[0].lon;
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'No encontrado',
                            text: 'No se encontraron resultados de geocodificación.'
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al geocodificar la dirección.'
                    });
                });
        });
    }

    // ================= Validación Final en Formulario =================
    // Para formularios de creación y edición de Lugar
    var createLugarForm = document.getElementById('createLugarForm');
    if (createLugarForm) {
        createLugarForm.addEventListener('submit', function(e) {
            validateNombre();
            validateDescripcion();
            validateDireccion();
            validateLatitud();
            validateLongitud();
            validateMarker();
            validateEtiquetas();

            var errors = document.querySelectorAll('#createLugarForm small.text-danger');
            var hasError = Array.from(errors).some(el => el.textContent.trim() !== "");
            if (hasError) {
                e.preventDefault();
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el formulario',
                    text: 'Por favor, corrige los errores en el formulario.'
                });
            }
        });
    }

    var editLugarForm = document.getElementById('editLugarForm');
    if (editLugarForm) {
        editLugarForm.addEventListener('submit', function(e) {
            validateNombre();
            validateDescripcion();
            validateDireccion();
            validateLatitud();
            validateLongitud();
            validateEtiquetas();
            // En edición, marker es opcional, por lo que usamos validateMarkerEdit
            validateMarkerEdit();

            var errors = document.querySelectorAll('#editLugarForm small.text-danger');
            var hasError = Array.from(errors).some(el => el.textContent.trim() !== "");
            if (hasError) {
                e.preventDefault();
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el formulario',
                    text: 'Por favor, corrige los errores en el formulario.'
                });
            }
        });
    }

    // ================= Confirmación de Eliminación (Lugares Index) =================
    document.querySelectorAll('form.delete-form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            Swal.fire({
                title: '¿Seguro que deseas eliminar este lugar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then(function(result) {
                if (result.isConfirmed) {
                    form.submit();
                }
            });
        });
    });

    // ================= Código para el Mapa (Lugares) =================
    var mapElem = document.getElementById('map');
    if (mapElem) {
        let map = L.map('map').setView([41.3851, 2.1734], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Map data © OpenStreetMap contributors'
        }).addTo(map);
        let markersLayer = L.layerGroup().addTo(map);

        function loadLugares(etiquetaId = '') {
            let url = '/lugares/json?';
            if (etiquetaId) {
                url += 'etiqueta=' + etiquetaId;
            }
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    markersLayer.clearLayers();
                    data.forEach(function(lugar) {
                        let markerOptions = {};
                        if (lugar.marker) {
                            let markerUrl = lugar.marker;
                            if (!markerUrl.startsWith('/')) {
                                markerUrl = '/' + markerUrl;
                            }
                            markerOptions.icon = L.icon({
                                iconUrl: markerUrl,
                                iconSize: [32, 32]
                            });
                        }
                        let marker = L.marker([lugar.latitud, lugar.longitud], markerOptions)
                            .bindPopup(`
                                <b>${lugar.nombre}</b><br>
                                ${lugar.direccion}
                            `);
                        markersLayer.addLayer(marker);
                    });
                })
                .catch(function(err) {
                    console.error(err);
                });
        }
        loadLugares();
        document.getElementById('filter-etiqueta').addEventListener('change', function() {
            let etId = this.value;
            loadLugares(etId);
        });
    }
});
