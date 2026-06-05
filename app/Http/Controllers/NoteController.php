<?php
namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\Course;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class NoteController extends Controller
{
    // Voir les notes — tout utilisateur connecté
    public function index($courseId)
    {
        Course::findOrFail($courseId);

        $media = Media::where('course_id', $courseId)->get();

        return response()->json($media);
    }

    // Ajouter une note — instructeur ou admin seulement
    public function store(Request $request, $courseId)
    {
        $user   = $request->user();
        $course = Course::findOrFail($courseId);

        // Vérifier que c'est l'instructeur ou un admin
        if ($course->instructor_id !== $user->id && $user->role_id !== 1) {
            return response()->json([
                'message' => 'Seul l\'instructeur peut ajouter des ressources'
            ], 403);
        }

        $request->validate([
            'type' => 'required|in:pdf,image,document',
            'file' => 'required|file|max:20480',
        ]);

        // Upload sur Cloudinary
        $uploaded = Cloudinary::upload(
            $request->file('file')->getRealPath(),
            ['folder' => 'skillswap/notes']
        );

        $media = Media::create([
            'url'       => $uploaded->getSecurePath(),
            'type'      => $request->type,
            'course_id' => $courseId,
        ]);

        return response()->json([
            'message' => 'Ressource ajoutée avec succès',
            'media'   => $media,
        ], 201);
    }

    // Supprimer — instructeur ou admin seulement
    public function destroy(Request $request, $id)
    {
        $user  = $request->user();
        $media = Media::with('course')->findOrFail($id);

        if ($media->course->instructor_id !== $user->id && $user->role_id !== 1) {
            return response()->json([
                'message' => 'Non autorisé'
            ], 403);
        }

        $media->delete();

        return response()->json([
            'message' => 'Ressource supprimée avec succès'
        ]);
    }

    // Télécharger — premium ou admin seulement
    public function download(Request $request, $id)
    {
        $user  = $request->user();
        $media = Media::findOrFail($id);

        if ($user->role_id !== 3 && $user->role_id !== 1) {
            return response()->json([
                'message' => 'Abonnement premium requis pour télécharger'
            ], 403);
        }

        return response()->json([
            'url' => $media->url
        ]);
    }
}