window.onload = function() {
    validatePuntosControl();
}


function validateNombre() {
    var nombre = document.getElementById('nombre').value.trim();
    if(nombre === ""){
       document.getElementById('nombreError').textContent = "El nombre es obligatorio.";
    } else {
       document.getElementById('nombreError').textContent = "";
    }
}

function validateDescripcion() {
    var descripcion = document.getElementById('descripcion').value.trim();
    if(descripcion === ""){
       document.getElementById('descripcionError').textContent = "La descripción es obligatoria.";
    } else {
       document.getElementById('descripcionError').textContent = "";
    }
}

// Validar que se seleccione al menos 4 puntos de control
function validatePuntosControl() {
    var select = document.getElementById('puntos_control');
    console.log(select);
    if(select.selectedOptions.length < 4) {
       document.getElementById('puntosControlError').textContent = "Debes seleccionar al menos 4 puntos de control.";
    } else {
       document.getElementById('puntosControlError').textContent = "";
    }
}

document.getElementById('createGimcanaForm').addEventListener('submit', function(e) {
    validateNombre();
    validateDescripcion();
    validatePuntosControl();

    var errorElements = document.querySelectorAll('small.text-danger');
    var hasError = false;
    errorElements.forEach(function(el) {
       if(el.textContent.trim() !== ""){
           hasError = true;
       }
    });

    if(hasError){
       e.preventDefault();
       Swal.fire({
           icon: 'error',
           title: 'Error en el formulario',
           text: 'Por favor, corrige los errores en el formulario.'
       });
    }
});