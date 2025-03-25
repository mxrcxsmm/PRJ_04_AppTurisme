document.addEventListener('DOMContentLoaded', function() {
    // Funciones de validación
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

    function validateColor() {
        var colorElem = document.getElementById('color');
        if (colorElem) {
            var color = colorElem.value.trim();
            var errorElem = document.getElementById('colorError');
            if (color === "") {
                errorElem.textContent = "El color es obligatorio.";
            } else if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
                errorElem.textContent = "El formato de color debe ser #RRGGBB.";
            } else {
                errorElem.textContent = "";
            }
        }
    }

    // Función para validar todos los campos dentro de un formulario dado su id
    function validateForm(formId) {
        // Ejecutar validaciones específicas (si existen)
        if (document.getElementById('nombre')) {
            validateNombre();
        }
        if (document.getElementById('color')) {
            validateColor();
        }
        // Revisar si existen mensajes de error dentro del formulario
        var errorElements = document.querySelectorAll('#' + formId + ' small.text-danger');
        var hasError = false;
        errorElements.forEach(function(el) {
            if (el.textContent.trim() !== "") {
                hasError = true;
            }
        });
        return !hasError;
    }

    // --- Validación para Create Etiqueta ---
    var createForm = document.getElementById('createEtiquetaForm');
    if (createForm) {
        // Asignar eventos onblur a los inputs (si existen)
        var nombreInput = document.getElementById('nombre');
        if (nombreInput) {
            nombreInput.addEventListener('blur', validateNombre);
        }
        var colorInput = document.getElementById('color');
        if (colorInput) {
            colorInput.addEventListener('blur', validateColor);
        }

        createForm.addEventListener('submit', function(e) {
            if (!validateForm('createEtiquetaForm')) {
                e.preventDefault();
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el formulario',
                    text: 'Por favor, corrige los errores en el formulario.'
                });
            }
        });
    }

    // --- Validación para Edit Etiqueta ---
    var editForm = document.getElementById('editEtiquetaForm');
    if (editForm) {
        var nombreInputEdit = document.getElementById('nombre');
        if (nombreInputEdit) {
            nombreInputEdit.addEventListener('blur', validateNombre);
        }
        var colorInputEdit = document.getElementById('color');
        if (colorInputEdit) {
            colorInputEdit.addEventListener('blur', validateColor);
        }
        editForm.addEventListener('submit', function(e) {
            if (!validateForm('editEtiquetaForm')) {
                e.preventDefault();
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el formulario',
                    text: 'Por favor, corrige los errores en el formulario.'
                });
            }
        });
    }

    // --- Confirmación de eliminación en Index de Etiquetas ---
    document.querySelectorAll('form.delete-form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            Swal.fire({
                title: '¿Seguro que deseas eliminar esta etiqueta?',
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
