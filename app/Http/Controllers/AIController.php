<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;

class AIController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        $response = OpenAI::chat()->create([
            'model'    => 'gpt-3.5-turbo',
            'messages' => [
                [
                    'role'    => 'system',
                    'content' => 'Tu es un assistant pédagogique qui aide les étudiants.'
                ],
                [
                    'role'    => 'user',
                    'content' => $request->question
                ],
            ],
        ]);

        return response()->json([
            'question' => $request->question,
            'answer'   => $response->choices[0]->message->content,
        ]);
    }
}
