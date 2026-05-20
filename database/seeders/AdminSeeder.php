<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
        'name'     => 'Admin',
        'email'    => 'admin@plateforme.com',
        'password' => bcrypt('password'),
        'role_id'  => 1, // admin
        'credits'  => 9999,
    ]);
    }
}
