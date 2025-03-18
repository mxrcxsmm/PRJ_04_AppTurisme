<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="{{ asset('css/login.css') }}">
</head>
<body>
    <div class="login-container">
        <img class="imagen" src="{{asset('img/logo.png')}}" alt="Inspector Gadget">
        <form action="{{ route('login') }}" method="POST">
            @csrf
            <input type="text" name="email" placeholder="Email">
            <input type="password" name="password" placeholder="Contraseña">
            <button type="submit">ENTRAR</button>
        </form>
        <a class="registro" href="{{ route('register') }}">¿Todavía sigues sin cuenta? Regístrate</a>
    </div>
</body>
</html>