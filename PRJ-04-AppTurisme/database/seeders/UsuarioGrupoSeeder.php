<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsuarioGrupoSeeder extends Seeder
{
    public function run()
    {
        DB::table('usuario_grupo')->insert([
            [
                'usuario_id' => 1, // Admin User
                'grupo_id'   => 1,
                'created_at' => now(),
            ],
            [
                'usuario_id' => 2, // Regular User
                'grupo_id'   => 1,
                'created_at' => now(),
            ],
        ]);
    }
}
