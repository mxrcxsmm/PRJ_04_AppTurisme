// Configurar CSRF token
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

let groupCode = null;
let groupMembers = [];
let selectedGimcana = null; // Gimcana seleccionada por el usuario
let currentUser = []; // Nombre del usuario autenticado

// Obtener el nombre del usuario autenticado desde el backend
document.addEventListener('DOMContentLoaded', () => {
    axios.get('/api/authenticated-user')
        .then(response => {
            currentUser = response.data.name; // Asignar el nombre del usuario autenticado
        })
        .catch(error => {
            console.error('Error al obtener el usuario autenticado:', error);
        });
});

// Abrir el modal del lobby
function openLobby() {
    document.getElementById('lobbyModal').style.display = 'block';
    loadGimcanas(); // Cargar las gimcanas disponibles
}

// Cerrar el modal del lobby
function closeLobby() {
    document.getElementById('lobbyModal').style.display = 'none';
}

// Configurar SweetAlert2 para que aparezca encima del modal
const swalWithCustomZIndex = Swal.mixin({
    customClass: {
        popup: 'swal2-popup-custom',
    },
    backdrop: `
        rgba(0,0,0,0.4)
    `,
});

// Cargar las gimcanas disponibles desde la base de datos
async function loadGimcanas() {
    try {
        const response = await axios.get('/api/gimcanas'); // Ruta de tu API para obtener las gimcanas
        const gimcanasUl = document.getElementById('gincanasUl');
        gimcanasUl.innerHTML = response.data.map(gimcana => `
            <li>
                <input type="radio" name="gimcana" value="${gimcana.id}" id="gimcana-${gimcana.id}" />
                <label for="gimcana-${gimcana.id}">${gimcana.nombre} - ${gimcana.descripcion}</label>
            </li>
        `).join('');

        // Agregar evento para seleccionar una gimcana
        document.querySelectorAll('input[name="gimcana"]').forEach(input => {
            input.addEventListener('change', (event) => {
                selectedGimcana = event.target.value;
            });
        });
    } catch (error) {
        swalWithCustomZIndex.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las gimcanas. Inténtalo de nuevo más tarde.',
        });
        console.error('Error cargando gimcanas:', error);
    }
}

// Crear un grupo con un código aleatorio
function createGroup() {
    groupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('groupCode').textContent = groupCode;
    document.getElementById('createGroupSection').style.display = 'block';
    document.getElementById('joinGroupSection').style.display = 'none';
    updateGroupMembers();
    swalWithCustomZIndex.fire({
        icon: 'success',
        title: 'Grupo creado',
        text: `Tu código de grupo es: ${groupCode}. Compártelo con tus amigos.`,
    });
}

// Mostrar la sección para unirse a un grupo
function showJoinGroup() {
    document.getElementById('joinGroupSection').style.display = 'block';
    document.getElementById('createGroupSection').style.display = 'none';
}

// Unirse a un grupo con un código
function joinGroup() {
    const code = document.getElementById('joinGroupCode').value.trim().toUpperCase();

    if (code !== groupCode) {
        swalWithCustomZIndex.fire({
            icon: 'error',
            title: 'Código incorrecto',
            text: 'El código de grupo que ingresaste no es válido.',
        });
        return;
    }

    if (groupMembers.includes(currentUser)) {
        swalWithCustomZIndex.fire({
            icon: 'warning',
            title: 'Ya estás en el grupo',
            text: 'No puedes unirte al grupo más de una vez.',
        });
        return;
    }

    groupMembers.push(currentUser);
    updateGroupMembers();
    swalWithCustomZIndex.fire({
        icon: 'success',
        title: 'Unido al grupo',
        text: 'Te has unido correctamente al grupo.',
    });
}

// Actualizar la lista de miembros del grupo
function updateGroupMembers() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = groupMembers.map(member => `<div>${member}</div>`).join('');
    document.getElementById('startGincanaButton').disabled = groupMembers.length !== 4 || !selectedGimcana;
}

// Iniciar la gimcana si hay 4 miembros en el grupo y una gimcana seleccionada
function startGincana() {
    if (groupMembers.length === 4 && selectedGimcana) {
        swalWithCustomZIndex.fire({
            icon: 'success',
            title: '¡Gimcana iniciada!',
            text: `La gimcana con ID ${selectedGimcana} ha comenzado. ¡Buena suerte!`,
        });
        closeLobby();
    } else {
        swalWithCustomZIndex.fire({
            icon: 'warning',
            title: 'No se puede iniciar',
            text: 'El grupo debe tener exactamente 4 personas y debes seleccionar una gimcana para iniciar.',
        });
    }
}

// Mostrar/ocultar el menú en dispositivos móviles
function toggleMenu() {
    const cabezeraContainer = document.querySelector('.cabezera-container');
    cabezeraContainer.classList.toggle('active');
}

// Si el usuario está en un grupo, mostrar la pista inicial
document.addEventListener('DOMContentLoaded', function () {
    const grupo = document.querySelector('.searching-text');
    if (grupo) {
        document.getElementById('pistaModal').style.display = 'block';
    }
});