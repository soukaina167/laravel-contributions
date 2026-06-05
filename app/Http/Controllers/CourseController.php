<?php
// app/Http/Controllers/CourseController.php
namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Cloudinary\Api\Upload\UploadApi;

class CourseController extends Controller
{
    // Liste tous les cours approuvés
    public function index()
{
    $courses = Course::with(['instructor', 'videos'])
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
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'video'        => 'nullable|file|mimes:mp4,avi,mov|max:102400',
            'credits_cost' => 'required|integer|min:0',
        ]);

        $videoUrl = null;
        $videoPublicId = null;
        $playbackUrl = null;

        if ($request->hasFile('video')) {
    try {
        // Récupère l'instance Cloudinary
        $cloudinary = app(\Cloudinary\Cloudinary::class);

        // Upload via l'API officielle
        $uploadedVideo = $cloudinary->uploadApi()->upload(
            $request->file('video')->getRealPath(),
            [
                'resource_type' => 'video',
                'folder' => 'plateforme-cours/videos'
            ]
        );

        // 🔍 Debug : décommente pour voir la réponse brute
        // dd($uploadedVideo);

        // Lis directement les clés du tableau
        $videoUrl = $uploadedVideo['secure_url'] ?? null;
        $videoPublicId = $uploadedVideo['public_id'] ?? null;
        $playbackUrl = $uploadedVideo['playback_url'] ?? null;

        if (!$videoUrl) {
            return response()->json([
                'message' => 'Erreur : Cloudinary n’a pas renvoyé d’URL valide.',
                'response' => $uploadedVideo
            ], 500);
        }

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur upload vidéo : ' . $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], 500);
    }
}

           
            

        $course = Course::create([
            'title'           => $request->title,
            'description'     => $request->description,
            'video_url'       => $videoUrl,
            'video_public_id' => $videoPublicId,
            'credits_cost'    => $request->credits_cost,
            'instructor_id'   => auth()->id(),
            'status'          => 'pending',
        ]);

        return response()->json([
            'message' => 'Cours soumis pour validation',
            'course'  => $course,
            'playback_url' => $playbackUrl
        ], 201);
    }

    // Modifier un cours
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        if ($course->instructor_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'title'       => 'string|max:255',
            'description' => 'string',
            'credits_cost'=> 'integer|min:0',
        ]);

        $course->update($request->only(['title', 'description', 'credits_cost']));

        return response()->json([
            'message' => 'Cours modifié avec succès',
            'course'  => $course,
        ]);
    }

    // Supprimer un cours + suppression vidéo Cloudinary
    public function destroy($id)
    {
        $course = Course::findOrFail($id);

        if ($course->instructor_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($course->video_public_id) {
            try {
                (new UploadApi())->destroy($course->video_public_id, ['resource_type' => 'video']);
            } catch (\Exception $e) {
                // On ignore l’erreur Cloudinary mais on continue la suppression du cours
            }
        }

        $course->delete();

        return response()->json(['message' => 'Cours supprimé avec succès']);
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
