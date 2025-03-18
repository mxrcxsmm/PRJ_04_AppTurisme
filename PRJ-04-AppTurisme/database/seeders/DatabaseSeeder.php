<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            RolesTableSeeder::class,
            UsuariosTableSeeder::class,
            GruposTableSeeder::class,
            UsuarioGrupoSeeder::class,
            LugaresTableSeeder::class,
            EtiquetasTableSeeder::class,
            LugarEtiquetaSeeder::class,
            FavoritosTableSeeder::class,
            PuntosControlTableSeeder::class,
            UsuarioPuntoSeeder::class,
        ]);
    }
}
