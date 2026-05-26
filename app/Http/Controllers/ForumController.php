<?php
// app/Http/Controllers/ForumController.php
namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class ForumController extends Controller
{
    // Liste toutes les questions d'un cours
    public function index($courseId)
    {
        $course = Course::with([
            'chat.messages' => function($query) {
                $query->where('sender_type', 'user');
            }
        ])->findOrFail($courseId);

        return response()->json($course->chat->messages ?? []);
    }

    // Publier une question
    public function store(Request $request, $courseId)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $course = Course::findOrFail($courseId);

        // Créer le chat si n'existe pas
        $chat = $course->chat()->firstOrCreate([
            'course_id' => $courseId
        ]);

        $message = $chat->messages()->create([
            'sender_type' => 'user',
            'receiver_id' => $request->user()->id,
            'content'     => $request->content,
            'chat_id'     => $chat->id,
        ]);

        return response()->json([
            'message' => 'Question publiée avec succès',
            'data'    => $message,
        ], 201);
    }

    // Répondre à une question
    public function reply(Request $request, $messageId)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        // Trouver le message original
        $original = \App\Models\Message::findOrFail($messageId);

        $reply = $original->chat->messages()->create([
            'sender_type' => 'user',
            'receiver_id' => $request->user()->id,
            'content'     => $request->content,
            'chat_id'     => $original->chat_id,
        ]);

        return response()->json([
            'message' => 'Réponse publiée avec succès',
            'data'    => $reply,
        ], 201);
    }

    // Supprimer une question/réponse
    public function destroy(Request $request, $messageId)
    {
        $message = \App\Models\Message::findOrFail($messageId);

        if ($message->receiver_id !== $request->user()->id
            && !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Non autorisé'
            ], 403);
        }

        $message->delete();

        return response()->json([
            'message' => 'Message supprimé avec succès'
        ]);
    }
}