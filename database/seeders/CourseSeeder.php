<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Video;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un cours
        $course = Course::create([
            'title' => 'Advanced Laravel',
            'description' => 'Cours avancé sur Laravel',
            'status' => 'approved',
            'instructor_id' => 5, // ID d’un utilisateur existant
        ]);

        // Créer une vidéo liée à ce cours
        Video::create([
            'title' => 'Middleware dans Laravel',
            'url' => 'https://example.com/video3.mp4',
            'description' => 'Vidéo sur les middleware',
            'course_id' => $course->id,
        ]);
    }
}
