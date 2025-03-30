// Configurar CSRF token para fetch
// if (typeof csrfToken === 'undefined') {
//     var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
// }
let groupCode = null;
let groupMembers = [];
let selectedGimcana = null;
let currentUser = null;
let currentGroupId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/authenticated-user', {
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            currentUser = data.name;
        })
        .catch(error => {
            console.error('Error al obtener el usuario autenticado:', error);
        });
});

function openLobby() {
    document.getElementById('lobbyModal').style.display = 'block';
    loadGimcanas();
}

function closeLobby() {
    document.getElementById('lobbyModal').style.display = 'none';
}

const swalWithCustomZIndex = Swal.mixin({
    customClass: {
        popup: 'swal2-popup-custom',
    },
    backdrop: `rgba(0,0,0,0.4)`,
});

async function loadGimcanas() {
    try {
        const response = await fetch('/api/gimcanas', {
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        });
        const data = await response.json();

        const gimcanasUl = document.getElementById('gincanasUl');
        gimcanasUl.innerHTML = data.map(gimcana => `
            <li>
                <input type="radio" name="gimcana" value="${gimcana.id}" id="gimcana-${gimcana.id}" />
                <label for="gimcana-${gimcana.id}">${gimcana.nombre} - ${gimcana.descripcion}</label>
            </li>
        `).join('');

        document.querySelectorAll('input[name="gimcana"]').forEach(input => {
            input.addEventListener('change', (event) => {
                selectedGimcana = event.target.value;
                updateGroupMembers();
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

function createGroup() {
    if (!selectedGimcana) {
        swalWithCustomZIndex.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debes seleccionar una gimcana antes de crear un grupo',
        });
        return;
    }

    fetch('/groups/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                gimcana_id: selectedGimcana
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                groupCode = data.codigo;
                currentGroupId = data.grupo.id;

                document.getElementById('groupCode').textContent = groupCode;
                document.getElementById('createGroupSection').style.display = 'block';
                document.getElementById('joinGroupSection').style.display = 'none';

                updateGroupMembers();

                swalWithCustomZIndex.fire({
                    icon: 'success',
                    title: 'Grupo creado',
                    text: `Tu código de grupo es: ${groupCode}. Compártelo con tus amigos.`,
                });
            } else {
                throw new Error(data.message || 'Error al crear grupo');
            }
        })
        .catch(error => {
            console.error('Error al crear grupo:', error);
            swalWithCustomZIndex.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear el grupo. Inténtalo de nuevo.',
            });
        });
}

function showJoinGroup() {
    document.getElementById('joinGroupSection').style.display = 'block';
    document.getElementById('createGroupSection').style.display = 'none';
}

function joinGroup() {
    const code = document.getElementById('joinGroupCode').value.trim().toUpperCase();

    fetch('/groups/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                codigo: code
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentGroupId = data.grupo.id;
                updateGroupMembers();
                swalWithCustomZIndex.fire({
                    icon: 'success',
                    title: 'Unido al grupo',
                    text: 'Te has unido correctamente al grupo.',
                });
            } else {
                throw new Error(data.message || 'Error al unirse al grupo');
            }
        })
        .catch(error => {
            console.error('Error al unirse al grupo:', error);
            swalWithCustomZIndex.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo unir al grupo. Verifica el código e inténtalo de nuevo.',
            });
        });
}

function updateGroupMembers() {
    if (!currentGroupId) return;

    fetch(`/api/grupos/${currentGroupId}/members`, {
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                groupMembers = data.members;
                const usersList = document.getElementById('usersList');
                if (usersList) {
                    usersList.innerHTML = groupMembers.map(member => `<div>${member}</div>`).join('');
                }

                const startBtn = document.getElementById('startGincanaButton');
                if (startBtn) {
                    startBtn.disabled = (groupMembers.length !== 4 || !selectedGimcana);
                }
            }
        })
        .catch(error => {
            console.error('Error al obtener miembros del grupo:', error);
        });
}

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

function toggleMenu() {
    const cabezeraContainer = document.querySelector('.cabezera-container');
    if (cabezeraContainer) {
        cabezeraContainer.classList.toggle('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const grupo = document.querySelector('.searching-text');
    if (grupo && document.getElementById('pistaModal')) {
        document.getElementById('pistaModal').style.display = 'block';
    }
});

// Asignar eventos después de que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Asignar evento al botón de jugar
    const playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.addEventListener('click', openLobby);
    }

    // Resto del código de inicialización...
    const grupo = document.querySelector('.searching-text');
    if (grupo && document.getElementById('pistaModal')) {
        document.getElementById('pistaModal').style.display = 'block';
    }
});