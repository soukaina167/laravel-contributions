<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Non authentifié'
            ], 401);
        }

        if ($user->role_id !== 1) {
            return response()->json([
                'message' => 'Accès refusé - Admin seulement'
            ], 403);
        }

        return $next($request);
    }
}