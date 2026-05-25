<?php
// app/Http/Controllers/CourseController.php
namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class CourseController extends Controller
{
    // Liste tous les cours approuvés
    public function index()
    {
        $courses = Course::with('instructor')
            ->where('status', 'approved')
            ->get();

        return response()->json($courses);
    }

    // Détail d'un cours
    public function show($id)
    {
        $course = Course::with(['instructor', 'reviews', 'media'])
            ->findOrFail($id);

        return response()->json($course);
    }

    // Créer un cours + upload vidéo Cloudinary
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'video'       => 'required|file|mimes:mp4,avi,mov|max:102400',
            'credits_cost'=> 'required|integer|min:0',
        ]);

        // Upload vidéo sur Cloudinary
        $uploadedVideo = Cloudinary::uploadVideo(
            $request->file('video')->getRealPath(),
            ['folder' => 'plateforme-cours/videos']
        );

        $videoUrl = $uploadedVideo->getSecurePath();

        // Créer le cours
        $course = Course::create([
            'title'        => $request->title,
            'description'  => $request->description,
            'video_url'    => $videoUrl,
            'credits_cost' => $request->credits_cost,
            'instructor_id'=> auth()->id(),
            'status'       => 'pending', // en attente de validation admin
        ]);

        return response()->json([
            'message' => 'Cours soumis pour validation',
            'course'  => $course,
        ], 201);
    }

    // Modifier un cours
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        // Vérifier que c'est bien l'instructeur
        if ($course->instructor_id !== auth()->id()) {
            return response()->json([
                'message' => 'Non autorisé'
            ], 403);
        }

        $request->validate([
            'title'       => 'string|max:255',
            'description' => 'string',
            'credits_cost'=> 'integer|min:0',
        ]);

        $course->update($request->only([
            'title', 'description', 'credits_cost'
        ]));

        return response()->json([
            'message' => 'Cours modifié avec succès',
            'course'  => $course,
        ]);
    }

    // Supprimer un cours
    public function destroy($id)
    {
        $course = Course::findOrFail($id);

        if ($course->instructor_id !== auth()->id()) {
            return response()->json([
                'message' => 'Non autorisé'
            ], 403);
        }

        $course->delete();

        return response()->json([
            'message' => 'Cours supprimé avec succès'
        ]);
    }

    // Mes cours (instructeur)
    public function myCourses()
    {
        $courses = Course::where('instructor_id', auth()->id())
            ->with('reviews')
            ->get();

        return response()->json($courses);
    }

    // Rechercher un cours
    public function search(Request $request)
    {
        $query = $request->get('q');

        $courses = Course::with('instructor')
            ->where('status', 'approved')
            ->where(function($q) use ($query) {
                $q->where('title', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%");
            })
            ->get();

        return response()->json($courses);
    }
}