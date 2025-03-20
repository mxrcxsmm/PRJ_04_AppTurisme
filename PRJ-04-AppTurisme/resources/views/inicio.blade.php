<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
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
    </style>
</head>
<body>
    <div class="search-container">
        <input type="text" class="search-box" id="searchBox" placeholder="Buscar localizaciones">
    </div>
    
    <div class="filter-buttons">
        <button class="filter-button" data-icon="❤️">Favoritos</button>
        <button class="filter-button" data-icon="🍴">Restaurantes</button>
        <button class="filter-button" data-icon="🛒">Tiendas</button>
        <button class="filter-button" data-icon="➕">Más</button>
        <button class="filter-button" data-icon="🏠">Inicio</button>
    </div>

    <div id="map"></div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="{{ asset('js/mapa.js') }}"></script>
</body>
</html>