<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('depart_city');
            $table->string('end_city');
            $table->text('description');
            $table->string('map_image');
            $table->string('banner');
            $table->unsignedInteger('duration');
            $table->unsignedBigInteger('tour_type_id');
            $table->foreign('tour_type_id')->references('id')->on('tour_types')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
