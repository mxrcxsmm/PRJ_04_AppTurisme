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
                'descripcion' => 'Campo de futbol de L\'Hospitalet de Llobregat',
                'direccion'   => 'Carrer de la Residencia, 30, 08907 L\'Hospitalet de Llobregat, Barcelona',
                'latitud'     => '41.3460888',
                'longitud'    => '2.0990090',
                'marker'      => 'marker_a.png',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nombre'      => 'Lugar B',
                'descripcion' => 'Pistas de fútbol Promosportive',
                'direccion'   => 'Camí Pau Redó, s/n, 08908 L\'Hospitalet de Llobregat, Barcelona',
                'latitud'     => '41.3449530',
                'longitud'    => '2.1104142',
                'marker'      => 'marker_b.png',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nombre'      => 'La Flama',
                'descripcion' => "Actualmente conocido como Restaurante La Flama, este negocio familiar con más de 30 años situado en el barrio de Bellvitge, es conocido por su gran variedad de tapas, desayunos y sus grandes celebraciones.",
                'direccion'   => 'Rambla de la Marina, 150, 08907 L\'Hospitalet de Llobregat, Barcelona',
                'latitud'     => '41.3515694',
                'longitud'    => '2.1114861',
                'marker'      => 'marker_b.png',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nombre'      => 'Pare d\'Enric d\'Osso',
                'descripcion' => 'Un colegio con identidad propia, concertado, de dos líneas, con más de 800 alumnos desde infantil hasta bachillerato. Nuestra historia la conforman las vivencias de todo el alumnado, profesorado y familias que han confiado en nosotros, convirtiéndonos en un referente educativo en el barrio.',
                'direccion'   => 'Av. d\'Amèrica, 5-9, 08907 L\'Hospitalet de Llobregat, Barcelona',
                'latitud'     => '41.3495041',
                'longitud'    => '2.1138022',
                'marker'      => 'marker_b.png',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nombre'      => 'Biblioteca de Bellvitge',
                'descripcion' => 'La Biblioteca Bellvitge forma part de la Xarxa de Biblioteques Municipals de l\'Hospitalet de Llobregat. És un espai públic i cultural que dona suport a l\'aprenentatge formal, a la formació al llarg de la vida i al foment de la lectura.',
                'direccion'   => 'Plaça de la Cultura, 1, 08907 L\'Hospitalet de Llobregat, Barcelona',
                'latitud'     => '41.3512488',
                'longitud'    => '2.1142503',
                'marker'      => 'marker_b.png',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nombre'      => 'El Pirulo de Bellvitge',
                'descripcion' => 'El pirulo de Bellvitge lugar emblematico de encuentro,conversación y cultura. El pirulo de Bellvitge se convirtio en cierta manera en el centro del barrio, en el se escucho y escucha musica ,lugar de encuentro de vecinos,lugar de mitines,centro de las fiestas ,todo un clasico en el barrio',
                'direccion'   => 'Av. d\'Amèrica, 117B, 08907 L\'Hospitalet de Llobregat, Barcelona',
                'latitud'     => '41.3527156',
                'longitud'    => '2.1132369',
                'marker'      => 'marker_b.png',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],

        ]);
    }
}
