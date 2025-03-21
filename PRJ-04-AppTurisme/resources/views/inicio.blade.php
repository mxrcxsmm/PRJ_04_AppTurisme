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
    <style>
        #map { 
            height: 80vh;
            width: 100%;
            margin-top: 10px;
        }
        .search-container {
            padding: 10px;
            background: yellow;
        }
        .filter-buttons {
            padding: 10px;
            display: flex;
            gap: 10px;
            background: yellow;
        }
        .filter-button {
            padding: 10px;
            border: none;
            background: white;
            border-radius: 5px;
        }
        .search-box {
            width: 100%;
            padding: 10px;
            border-radius: 20px;
            border: none;
        }
        .play-button {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 18px;
            z-index: 1000;
        }

        .searching-text {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px;
            background-color: rgba(0,0,0,0.7);
            color: white;
            border-radius: 25px;
            z-index: 1000;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 2000;
        }

        .modal-content {
            position: relative;
            background-color: white;
            margin: 15% auto;
            padding: 20px;
            width: 80%;
            max-width: 500px;
            border-radius: 10px;
        }

        .users-list {
            max-height: 300px;
            overflow-y: auto;
        }

        .user-item {
            padding: 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    </style>

    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@300..800&display=swap" rel="stylesheet">
    <title>Inicio</title>

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
                <h2>Lobby de Jugadores</h2>
                <div class="users-list" id="usersList">
                    <!-- Los usuarios se cargarán aquí dinámicamente -->
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
        // Configurar CSRF token
        axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // Funciones para el lobby
        function openLobby() {
            document.getElementById('lobbyModal').style.display = 'block';
            loadUsers();
        }

        async function loadUsers() {
            try {
                const response = await axios.get('/api/users');
                const usersList = document.getElementById('usersList');
                usersList.innerHTML = response.data.map(user => `
                    <div class="user-item">
                        <span>${user.name}</span>
                        <button onclick="inviteUser(${user.id})">Invitar</button>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Error cargando usuarios:', error);
            }
        }

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