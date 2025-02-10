<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'waguer',
            'email' => 'karimouiaboub@gmail.com',
            'phone_number'=> '0651234567',
            'password' => Hash::make('waguer2004'), // Use Hash::make to hash the password
        ]);
        User::factory()->create([
            'name' => 'zakaria ouiaboub',
            'email' => 'Zakaria.ouiaboub@gmail.com',
            'phone_number'=> '065123456',
            'password' => Hash::make('zakaria1996'), // Use Hash::make to hash the password
        ]);
        User::factory()->create([
            'name' => 'brahim hadach',
            'email' => 'bhadach57@gmail.com',
            'phone_number'=> '065123567',
            'password' => Hash::make('brahim1995'), // Use Hash::make to hash the password
        ]);
    }
}
