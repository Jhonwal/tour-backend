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
        Schema::create('tour_requests', function (Blueprint $table) {
            $table->id();

            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('country');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->integer('travelers');
            $table->boolean('has_children');
            $table->integer('children_count')->nullable();
            $table->json('children_ages')->nullable();
            $table->integer('duration');
            $table->date('arrival_date');
            $table->date('departure_date');

            $table->json('experience_types');
            $table->json('destinations');
            $table->json('accommodation_type');

            $table->string('budget_range');
            $table->string('custom_budget')->nullable();
            $table->json('transportation');

            $table->json('dietary_preferences');
            $table->json('additional_services');
            $table->json('additional_activities');
            $table->text('other_requests')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_requests');
    }
};
