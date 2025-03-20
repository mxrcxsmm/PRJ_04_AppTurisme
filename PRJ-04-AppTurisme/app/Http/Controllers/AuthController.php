<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;    

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('login');
    }

    public function login(Request $request)
    {
        // Validar los datos de entrada
        $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // Autenticación exitosa
            $user = Auth::user();
            if ($user->role_id == 1) {
                return redirect()->intended('admin/dashboard');
            } else {
                return redirect()->intended('user/dashboard');
            }
        }

        // Autenticación fallida
        return back()->withErrors([
            'email' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
        ]);
    }

   // Mostrar formulario de registro
   public function showRegistrationForm()
   {
       return view('register');
   }

   // Procesar registro
   public function register(Request $request)
   {
       // Validar datos
       $request->validate([
           'nombre' => 'required|string|max:100',
           'email' => 'required|string|email|max:150|unique:usuarios',
           'password' => 'required|string|min:6|confirmed',
       ]);

 
       $user = new User();
       $user->nombre = $request->nombre;
       $user->email = $request->email;
       $user->password = Hash::make($request->password);
       $user->role_id = 2; // Asignar rol de usuario regular
       $user->save();

       // Redirigir al login
       return redirect()->route('user.dashboard');
   }
}