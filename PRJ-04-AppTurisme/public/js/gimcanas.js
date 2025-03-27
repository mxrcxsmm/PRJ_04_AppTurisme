document.addEventListener('DOMContentLoaded', function() {

    // ----------------- Funciones de Validación -----------------

    function validateNombre() {
        var nombreElem = document.getElementById('nombre');
        if (nombreElem) {
            var nombre = nombreElem.value.trim();
            var errorElem = document.getElementById('nombreError');
            if (nombre === "") {
                errorElem.textContent = "El nombre es obligatorio.";
            } else {
                errorElem.textContent = "";
            }
        }
    }

    function validateDescripcion() {
        var descripcionElem = document.getElementById('descripcion');
        if (descripcionElem) {
            var descripcion = descripcionElem.value.trim();
            var errorElem = document.getElementById('descripcionError');
            if (descripcion === "") {
                errorElem.textContent = "La descripción es obligatoria.";
            } else {
                errorElem.textContent = "";
            }
        }
    }

    // Valida que se seleccionen al menos 4 puntos de control.
    function validatePuntosControl() {
        var select = document.getElementById('puntos_control');
        if (select) {
            var errorElem = document.getElementById('puntosControlError');
            if (select.selectedOptions.length < 4) {
                errorElem.textContent = "Debes seleccionar al menos 4 puntos de control.";
            } else {
                errorElem.textContent = "";
            }
        }
    }

    // ----------------- Validación en Formularios -----------------

    // Para formulario de creación
    var createForm = document.getElementById('createGimcanaForm');
    if (createForm) {
        // Asignar eventos onblur y onchange
        var nombreInput = document.getElementById('nombre');
        if (nombreInput) {
            nombreInput.addEventListener('blur', validateNombre);
        }
        var descripcionInput = document.getElementById('descripcion');
        if (descripcionInput) {
            descripcionInput.addEventListener('blur', validateDescripcion);
        }
        var puntosSelect = document.getElementById('puntos_control');
        if (puntosSelect) {
            puntosSelect.addEventListener('change', validatePuntosControl);
        }
        createForm.addEventListener('submit', function(e) {
            // Ejecutar validaciones
            validateNombre();
            validateDescripcion();
            validatePuntosControl();

            // Verificar si hay algún <small> con mensaje de error dentro del formulario
            var errorElements = document.querySelectorAll('#createGimcanaForm small.text-danger');
            var hasError = false;
            errorElements.forEach(function(el) {
                if (el.textContent.trim() !== "") {
                    hasError = true;
                }
            });

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

    // Para formulario de edición
    var editForm = document.getElementById('editGimcanaForm');
    if (editForm) {
        var nombreInputEdit = document.getElementById('nombre');
        if (nombreInputEdit) {
            nombreInputEdit.addEventListener('blur', validateNombre);
        }
        var descripcionInputEdit = document.getElementById('descripcion');
        if (descripcionInputEdit) {
            descripcionInputEdit.addEventListener('blur', validateDescripcion);
        }
        var puntosSelectEdit = document.getElementById('puntos_control');
        if (puntosSelectEdit) {
            puntosSelectEdit.addEventListener('change', validatePuntosControl);
        }
        editForm.addEventListener('submit', function(e) {
            validateNombre();
            validateDescripcion();
            validatePuntosControl();

            var errorElements = document.querySelectorAll('#editGimcanaForm small.text-danger');
            var hasError = false;
            errorElements.forEach(function(el) {
                if (el.textContent.trim() !== "") {
                    hasError = true;
                }
            });
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

    // ----------------- Confirmación de Eliminación en Index -----------------

    document.querySelectorAll('form.delete-form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            Swal.fire({
                title: '¿Seguro que deseas eliminar esta gimcana?',
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
