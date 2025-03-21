<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <link rel="stylesheet" href="{{asset('css/inicio.css')}}">
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

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="{{ asset('js/mapa.js') }}"></script>
</body>
</html>