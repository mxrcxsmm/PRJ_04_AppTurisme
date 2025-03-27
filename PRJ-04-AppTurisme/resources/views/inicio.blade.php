<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <link rel="stylesheet" href="{{asset('css/inicio.css')}}">
    <title>Gincana</title>   
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@300..800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <title>Inicio</title>
</head>
<body>
    <div class="hamburger-menu" onclick="toggleMenu()">
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="cabezera-container">
        <div class="cabezera">
            <div class="search-container">
                <input type="text" class="search-box" id="searchBox" placeholder="Buscar localizaciones">
            </div>
                <div class="filter-buttons">
                    <button class="filter-button" data-etiqueta="Restaurante">Restaurantes</button>
                    <button class="filter-button" data-etiqueta="Museo">Museos</button>
                    <button class="filter-button" data-etiqueta="Tienda">Tiendas</button>
                    <button class="filter-button" data-etiqueta="Parque">Parques</button>
                    <button class="filter-button" data-etiqueta="Bar">Bares</button>
                    <button class="filter-button" data-etiqueta="Favoritos">Favoritos</button>
                <form action="{{ route('logout') }}" method="POST" class="logout-form">
                    @csrf
                    <button type="submit" class="button-logout">Cerrar sesión</button>
                </form>
                </div>
        </div>
    </div>

    <div id="map"></div>

    @if(!$grupo)
        <button class="play-button" onclick="openLobby()">Jugar Gincana</button>
        
        <!-- Modal Lobby -->
        <div id="lobbyModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeLobby()">&times;</span>
                <h2>Lobby de Jugadores</h2>
                <div class="lobby-options">
                    <button class="btn btn-primary" onclick="createGroup()">Crear Grupo</button>
                    <button class="btn btn-secondary" onclick="showJoinGroup()">Unirse a Grupo</button>
                </div>
                <div id="createGroupSection" style="display: none;">
                    <h3>Tu código de grupo:</h3>
                    <p id="groupCode" class="group-code"></p>
                    <p>Comparte este código con tus amigos para que se unan al grupo.</p>
                </div>
                <div id="joinGroupSection" style="display: none;">
                    <h3>Unirse a un grupo</h3>
                    <input type="text" id="joinGroupCode" placeholder="Introduce el código del grupo" class="form-control">
                    <button class="btn btn-success" onclick="joinGroup()">Unirse</button>
                </div>
                <div class="users-list" id="usersList">
                    <!-- Los usuarios se cargarán aquí dinámicamente -->
                </div>
                <br>
                <div id="gincanasList">
                    <h3>Gincanas disponibles:</h3>
                    <ul id="gincanasUl">
                        <!-- Las gincanas se cargarán aquí dinámicamente -->
                    </ul>
                </div>
                <br>
                <button class="btn btn-success" id="startGincanaButton" onclick="startGincana()" disabled>Iniciar Gincana</button>
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

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="{{ asset('js/mapa.js') }}"></script>
    <script src="{{ asset('js/gincana.js') }}"></script>
</body>
</html>