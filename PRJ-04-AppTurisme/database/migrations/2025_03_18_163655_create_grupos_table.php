<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGruposTable extends Migration
{
    public function up()
    {
        Schema::create('grupos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            $table->string('codigo', 6)->unique()->nullable(); // Código único del grupo
            $table->unsignedBigInteger('gimcana_id')->nullable(); // Relación con gimcana
            $table->timestamps();

            $table->foreign('gimcana_id')
                  ->references('id')->on('gimcanas')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('grupos');
    }
}
