<?php
// app/Http/Controllers/AdminController.php
namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Liste des vidéos en attente
    public function pendingVideos()
    {
        $courses = Course::with('instructor')
            ->where('status', 'pending')
            ->get();

        return response()->json($courses);
    }

    // Valider une vidéo
    public function validateVideo($id)
    {
        $course = Course::findOrFail($id);
        $course->update(['status' => 'approved']);

        return response()->json([
            'message' => 'Vidéo validée avec succès',
            'course'  => $course,
        ]);
    }

    // Rejeter une vidéo
    public function rejectVideo($id)
    {
        $course = Course::findOrFail($id);
        $course->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Vidéo rejetée',
            'course'  => $course,
        ]);
    }

    // Bannir un utilisateur
    public function banUser($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_banned' => true]);

        return response()->json([
            'message' => 'Utilisateur banni avec succès'
        ]);
    }

    // Débannir un utilisateur
    public function unbanUser($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_banned' => false]);

        return response()->json([
            'message' => 'Utilisateur débanni avec succès'
        ]);
    }

    // Statistiques
    public function statistics()
    {
        return response()->json([
            'total_users'    => User::count(),
            'total_courses'  => Course::count(),
            'pending_videos' => Course::where('status', 'pending')->count(),
            'premium_users'  => User::where('role_id', 3)->count(),
        ]);
    }

    // Liste tous les utilisateurs
    public function users()
    {
        $users = User::with('role')->get();
        return response()->json($users);
    }
    // Gérer catégories (skills)
public function getSkills()
{
    $skills = \App\Models\Skill::all();
    return response()->json($skills);
}

public function createSkill(Request $request)
{
    $request->validate([
        'name'  => 'required|string|max:255',
        'level' => 'required|in:beginner,intermediate,advanced',
    ]);

    $skill = \App\Models\Skill::create([
        'name'  => $request->name,
        'level' => $request->level,
    ]);

    return response()->json([
        'message' => 'Catégorie créée avec succès',
        'skill'   => $skill,
    ], 201);
}

public function deleteSkill($id)
{
    $skill = \App\Models\Skill::findOrFail($id);
    $skill->delete();

    return response()->json([
        'message' => 'Catégorie supprimée avec succès'
    ]);
}
}