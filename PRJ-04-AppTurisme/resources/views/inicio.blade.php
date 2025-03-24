<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <link rel="stylesheet" href="{{asset('css/inicio.css')}}">

    <title>Gimcana</title>   
</head>
<body>
    <div class="cabezera-container">
        <div class="cabezera">
            <div class="search-container">
                <input type="text" class="search-box" id="searchBox" placeholder="Buscar localizaciones">
            </div>
            <div class="filter-buttons">
                <button class="filter-button" data-icon="❤️">Favoritos</button>
                <button class="filter-button" data-icon="🍴">Restaurantes</button>
                <button class="filter-button" data-icon="🛒">Tiendas</button>
                <button class="filter-button" data-icon="➕">Más</button>
                <button class="filter-button" data-icon="🏠">Inicio</button>
                <form action="{{ route('logout') }}" method="POST" class="logout-form">
                    @csrf
                    <button type="submit" class="button-logout">Cerrar sesión</button>
                </form>
            </div>
        </div>
    </div>
    

    <div id="map"></div>

    @if(!$grupo)
    <button class="play-button" onclick="openLobby()">Jugar Gimcana</button>
    
    <!-- Modal Lobby -->
    <div id="lobbyModal" class="modal">
        <div class="modal-content">
            <div class="timer-bar" id="timerBar"></div>
            <div class="lobby-header">
                <h2>Lobby de Jugadores</h2>
                <p class="grupo-count">Grupos: <span id="grupoCount">0</span>/7</p>
            </div>
            <div class="grupos-list" id="gruposList">
                <!-- Los grupos se cargarán aquí dinámicamente -->
            </div>
        </div>
    </div>
    @else
        <div class="searching-text">
            Buscando... {{ $puntoControl->etiquetas->first()->nombre ?? 'Punto de Control 1' }}
        </div>

        <!-- Modal Pista -->
        <div id="pistaModal" class="modal">
            <div class="modal-content">
                <h2>Pista para el Punto de Control</h2>
                <p>{{ $puntoControl->descripcion ?? 'Busca un lugar con la etiqueta indicada' }}</p>
            </div>
        </div>
    @endif

    <!-- Scripts -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        let lobbyTimer;
    let grupos = [];

    function openLobby() {
        document.getElementById('lobbyModal').style.display = 'block';
        startLobbyTimer();
        loadGrupos();
    }

    function startLobbyTimer() {
        const timerBar = document.getElementById('timerBar');
        timerBar.style.width = '100%';
        
        setTimeout(() => {
            timerBar.style.width = '0%';
        }, 100);

        lobbyTimer = setTimeout(() => {
            startGimcana();
        }, 60000); // 1 minuto
    }

    async function loadGrupos() {
        try {
            const response = await fetch('/api/grupos', {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            grupos = await response.json();
            updateGruposView();
            
            if (grupos.length >= 7) {
                startGimcana();
            }
        } catch (error) {
            console.error('Error cargando grupos:', error);
        }
    }

    function updateGruposView() {
        const gruposList = document.getElementById('gruposList');
        const grupoCount = document.getElementById('grupoCount');
        
        grupoCount.textContent = grupos.length;
        
        gruposList.innerHTML = grupos.map(grupo => {
            const emptySlots = 4 - grupo.usuarios.length;
            const playerSlots = [
                ...grupo.usuarios.map(user => `
                    <div class="player-slot">${user.name}</div>
                `),
                ...Array(emptySlots).fill(`
                    <div class="player-slot empty">Vacío</div>
                `)
            ].join('');

            return `
                <div class="grupo-card">
                    <h3>Grupo ${grupo.id}</h3>
                    <div class="grupo-players">
                        ${playerSlots}
                    </div>
                    ${emptySlots > 0 ? `
                        <button class="join-button" onclick="joinGrupo(${grupo.id})">
                            Unirse al grupo
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    async function joinGrupo(grupoId) {
        try {
            const response = await fetch('/api/grupos/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ grupo_id: grupoId })
            });

            if (response.ok) {
                location.reload(); // Recargar para mostrar la vista de grupo
            } else {
                console.error('Error al unirse al grupo');
            }
        } catch (error) {
            console.error('Error uniéndose al grupo:', error);
        }
    }

    function startGimcana() {
        clearTimeout(lobbyTimer);
        location.reload();
    }

    // Actualizar grupos cada 5 segundos
    setInterval(loadGrupos, 5000);

    // Si el usuario está en un grupo, mostrar la pista inicial
    @if($grupo)
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('pistaModal').style.display = 'block';
        });
    @endif
    </script>
    <script src="{{ asset('js/mapa.js') }}"></script>
</body>
</html>