<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    // Voir abonnement actuel
    public function show(Request $request)
    {
        $subscription = $request->user()->subscription;

        if (!$subscription) {
            return response()->json([
                'message' => 'Aucun abonnement actif'
            ], 404);
        }

        return response()->json($subscription);
    }

    // Acheter abonnement
    public function store(Request $request)
    {
        $request->validate([
            'plan' => 'required|in:monthly,yearly',
        ]);

        // Vérifier si abonnement déjà actif
        $existing = $request->user()->subscription;
        if ($existing && $existing->status === 'active') {
            return response()->json([
                'message' => 'Vous avez déjà un abonnement actif'
            ], 400);
        }

        $startsAt = Carbon::now();
        $endsAt   = $request->plan === 'monthly'
            ? Carbon::now()->addMonth()
            : Carbon::now()->addYear();

        $subscription = Subscription::create([
            'user_id'   => auth()->id(),
            'plan'      => $request->plan,
            'status'    => 'active',
            'starts_at' => $startsAt,
            'ends_at'   => $endsAt,
        ]);

        // Mettre à jour le rôle en premium
        $request->user()->update(['role_id' => 3]);

        return response()->json([
            'message'      => 'Abonnement activé avec succès',
            'subscription' => $subscription,
        ], 201);
    }

    // Annuler abonnement
    public function cancel(Request $request)
    {
        $subscription = $request->user()->subscription;

        if (!$subscription || $subscription->status !== 'active') {
            return response()->json([
                'message' => 'Aucun abonnement actif à annuler'
            ], 404);
        }

        $subscription->update(['status' => 'cancelled']);

        // Remettre en standard
        $request->user()->update(['role_id' => 2]);

        return response()->json([
            'message' => 'Abonnement annulé avec succès'
        ]);
    }
}
