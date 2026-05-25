<?php
// app/Http/Controllers/ProfileController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    // Voir profil
    public function show(Request $request)
    {
        $user = $request->user()->load([
            'role',
            'skills',
            'courses',
            'subscription'
        ]);

        return response()->json($user);
    }

    // Modifier profil
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,'.$user->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        $data = $request->only(['name', 'email']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profil modifié avec succès',
            'user'    => $user->load('role'),
        ]);
    }

    // Voir quota (nombre de vidéos accessibles)
    public function quota(Request $request)
    {
        $user = $request->user()->load('role');

        if ($user->isPremium()) {
            return response()->json([
                'type'           => 'premium',
                'videos_watched' => $user->accessibleCourses()->count(),
                'limit'          => 'illimité',
            ]);
        }

        return response()->json([
            'type'           => 'standard',
            'videos_watched' => $user->accessibleCourses()->count(),
            'limit'          => 5,
        ]);
    }
}