<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Administración</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" 
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
       <ul class="navbar-nav mr-auto">
           <li class="nav-item"><a class="nav-link" href="{{ route('admin.lugares.index') }}">Lugares</a></li>
           <li class="nav-item"><a class="nav-link" href="{{ route('admin.etiquetas.index') }}">Etiquetas</a></li>
           <li class="nav-item"><a class="nav-link" href="{{ route('admin.puntos-control.index') }}">Puntos de Control</a></li>
           <li class="nav-item"><a class="nav-link" href="{{ route('admin.gimcanas.index') }}">Gimcana</a></li>
           <li class="nav-item"><a class="nav-link" href="{{ route('map') }}">Ver Mapa</a></li>  
       </ul>
       <form action="{{ route('logout') }}" method="POST" class="form-inline my-2 my-lg-0">
            @csrf
            <button type="submit" class="btn btn-outline-light my-2 my-sm-0">Cerrar sesión</button>
       </form>
    </div>
</nav>

