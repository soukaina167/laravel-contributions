<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\Course;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class NoteController extends Controller
{
    // Voir les notes/ressources d'un cours
    public function index($courseId)
    {
        // Vérifier accès au cours
        $user = request()->user();
        $course = Course::findOrFail($courseId);

        $hasAccess = $user->accessibleCourses()
            ->where('course_id', $courseId)
            ->exists();

        if (!$hasAccess && !$user->isPremium()) {
            return response()->json([
                'message' => 'Accès refusé - Abonnement requis'
            ], 403);
        }

        $media = Media::where('course_id', $courseId)->get();

        return response()->json($media);
    }

    // Ajouter une note/ressource
    public function store(Request $request, $courseId)
    {
        $request->validate([
            'type' => 'required|in:pdf,image,document',
            'file' => 'required|file|max:20480',
        ]);

        Course::findOrFail($courseId);

        // Upload sur Cloudinary
        $uploaded = Cloudinary::upload(
            $request->file('file')->getRealPath(),
            ['folder' => 'plateforme-cours/notes']
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

    // Supprimer une note
    public function destroy(Request $request, $id)
    {
        $media = Media::findOrFail($id);
        $media->delete();

        return response()->json([
            'message' => 'Ressource supprimée avec succès'
        ]);
    }

    // Télécharger ressource (premium only)
    public function download(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->isPremium()) {
            return response()->json([
                'message' => 'Abonnement premium requis pour télécharger'
            ], 403);
        }

        $media = Media::findOrFail($id);

        return response()->json([
            'url' => $media->url
        ]);
    }
}
