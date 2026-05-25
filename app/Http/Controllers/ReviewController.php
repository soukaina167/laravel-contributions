<?php
// app/Http/Controllers/ReviewController.php
namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Course;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // Voir les avis d'un cours
    public function index($courseId)
    {
        $reviews = Review::with('user')
            ->where('course_id', $courseId)
            ->get();

        return response()->json($reviews);
    }

    // Donner un avis
    public function store(Request $request, $courseId)
    {
        $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'sometimes|string|max:1000',
        ]);

        // Vérifier si l'utilisateur a déjà donné un avis
        $existing = Review::where('user_id', auth()->id())
            ->where('course_id', $courseId)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Vous avez déjà donné un avis sur ce cours'
            ], 400);
        }

        $review = Review::create([
            'rating'    => $request->rating,
            'comment'   => $request->comment,
            'user_id'   => auth()->id(),
            'course_id' => $courseId,
        ]);

        // Mettre à jour la note moyenne du cours
        $avgRating = Review::where('course_id', $courseId)->avg('rating');
        Course::findOrFail($courseId)->update(['rating' => $avgRating]);

        return response()->json([
            'message' => 'Avis ajouté avec succès',
            'review'  => $review->load('user'),
        ], 201);
    }

    // Modifier un avis
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Non autorisé'
            ], 403);
        }

        $request->validate([
            'rating'  => 'integer|min:1|max:5',
            'comment' => 'string|max:1000',
        ]);

        $review->update($request->only(['rating', 'comment']));

        return response()->json([
            'message' => 'Avis modifié avec succès',
            'review'  => $review,
        ]);
    }
}