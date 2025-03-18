<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LugaresTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('lugares')->insert([
            [
                'nombre'      => 'Lugar A',
                'descripcion' => 'Descripción del lugar A',
                'direccion'   => 'Calle Falsa 123',
                'latitud'     => '40.416775',
                'longitud'    => '-3.703790',
                'marker'      => 'marker_a.png',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nombre'      => 'Lugar B',
                'descripcion' => 'Descripción del lugar B',
                'direccion'   => 'Avenida Siempre Viva 742',
                'latitud'     => '40.417000',
                'longitud'    => '-3.704000',
                'marker'      => 'marker_b.png',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
