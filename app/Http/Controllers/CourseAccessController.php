<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseAccessController extends Controller
{
    // Accéder à un cours
    public function access(Request $request, $courseId)
    {
        $user   = $request->user();
        $course = Course::findOrFail($courseId);

        // Vérifier si déjà accès
        $alreadyAccess = $user->accessibleCourses()
            ->wherePivot('course_id', $courseId)
            ->exists();

        if ($alreadyAccess) {
            return response()->json([
                'message' => 'Vous avez déjà accès à ce cours',
                'course'  => $course,
            ]);
        }

        // Utilisateur standard → limite 5 cours
        if (!$user->isPremium()) {
            $count = $user->accessibleCourses()->count();

            if ($count >= 5) {
                return response()->json([
                    'message' => 'Limite atteinte - Passez en premium pour accès illimité'
                ], 403);
            }

            // Vérifier crédits
            if ($user->credits < $course->credits_cost) {
                return response()->json([
                    'message' => 'Crédits insuffisants'
                ], 403);
            }

            // Déduire crédits
            $user->decrement('credits', $course->credits_cost);
        }

        // Donner accès
        $user->accessibleCourses()->attach($courseId);

        return response()->json([
            'message' => 'Accès accordé avec succès',
            'course'  => $course,
        ]);
    }

    // Voir mes cours accessibles
    public function myCourses(Request $request)
    {
        $courses = $request->user()
            ->accessibleCourses()
            ->with('instructor')
            ->get();

        return response()->json($courses);
    }
}
