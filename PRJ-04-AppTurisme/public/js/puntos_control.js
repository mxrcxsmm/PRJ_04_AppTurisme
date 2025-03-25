document.addEventListener('DOMContentLoaded', function() {

    // ================= Funciones de Validación =================

    function validateLugar() {
        var lugarElem = document.getElementById('lugar_id');
        if (lugarElem) {
            var value = lugarElem.value;
            var errorElem = document.getElementById('lugarError');
            errorElem.textContent = (value === "") ? "Debes seleccionar un lugar." : "";
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

    function validatePista() {
        var pistaElem = document.getElementById('pista');
        if (pistaElem) {
            var value = pistaElem.value.trim();
            var errorElem = document.getElementById('pistaError');
            errorElem.textContent = (value === "") ? "La pista es obligatoria." : "";
        }
    }

    function validatePrueba() {
        var pruebaElem = document.getElementById('prueba');
        if (pruebaElem) {
            var value = pruebaElem.value.trim();
            var errorElem = document.getElementById('pruebaError');
            errorElem.textContent = (value === "") ? "La prueba es obligatoria." : "";
        }
    }

    // ================= Validación de Formularios =================

    // Para el formulario de creación de Punto de Control
    var createPuntoForm = document.getElementById('createPuntoControlForm');
    if (createPuntoForm) {
        createPuntoForm.addEventListener('submit', function(e) {
            validateLugar();
            validateDescripcion();
            validatePista();
            validatePrueba();

            var errorElements = document.querySelectorAll('#createPuntoControlForm small.text-danger');
            var hasError = Array.from(errorElements).some(el => el.textContent.trim() !== "");
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

    // Para el formulario de edición de Punto de Control
    var editPuntoForm = document.getElementById('editPuntoControlForm');
    if (editPuntoForm) {
        editPuntoForm.addEventListener('submit', function(e) {
            validateLugar();
            validateDescripcion();
            validatePista();
            validatePrueba();

            var errorElements = document.querySelectorAll('#editPuntoControlForm small.text-danger');
            var hasError = Array.from(errorElements).some(el => el.textContent.trim() !== "");
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

    // ================= Confirmación de Eliminación =================
    document.querySelectorAll('form.delete-form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            Swal.fire({
                title: '¿Seguro que deseas eliminar este punto de control?',
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

});
