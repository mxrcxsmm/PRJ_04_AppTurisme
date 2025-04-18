<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
    <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
    <script src="https://unpkg.com/@mapbox/mapbox-sdk/umd/mapbox-sdk.min.js"></script>
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
                    <button class="filter-button" id="btnFiltroDistancia">Distancia</button>
                <form action="{{ route('logout') }}" method="POST" class="logout-form">
                    @csrf
                    <button type="submit" class="button-logout">Cerrar sesión</button>
                </form>
                
                </div>
        </div>
        <div id="distanceModal" class="distance-modal">
            <div class="distance-modal-content">
                <span class="close-distance-modal">&times;</span>
                <h4>Filtrar por distancia</h4>
                <input type="number" id="inputMetros" placeholder="Ej: 100" min="50">
                <button class="btn btn-primary mt-2" id="btnAplicarDistancia">Aplicar</button>
            </div>
        </div>
    </div>

    <div id="map"></div>
    <div id="infoPanel" class="info-panel">
        <h2 id="infoTitle">INFO</h2>
        <div id="infoCategories" class="categories"></div>
        <div id="infoImages" class="image-gallery"></div>
        <p id="infoDescription"></p>
        <button id="controlPointButton" class="control-button">PUNTO DE CONTROL 1</button>
        <button class="control-button" id="verRutaBtn">Ver Ruta</button>
    </div>

    <div class="route-selector">
        <label for="modoRuta">Modo de ruta:</label>
        <select id="modoRuta">
            <option value="foot">Ruta a pie</option>
            <option value="car">Ruta en coche</option>
        </select>
    </div>

    <!-- Botón y modal nuevo (dentro de .filter-buttons) -->

    @if(!$grupo)
    <button class="play-button" id="playButton">Jugar Gincana</button>
        
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
    <div class="route-selector">
        <label for="modoRuta">Modo de ruta:</label>
        <select id="modoRuta">
            <option value="mapbox/walking">Ruta a pie</option>
            <option value="mapbox/driving">Ruta en coche</option>
        </select>
    </div>
    
    
    {{-- <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script> --}}
    <script src="{{ asset('js/mapa.js') }}"></script>
    <script src="{{ asset('js/gincana.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

</body>
</html>