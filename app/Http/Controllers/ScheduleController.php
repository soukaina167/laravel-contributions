<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\ScheduleItem;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    // Voir le planning
    public function index(Request $request)
    {
        $schedule = Schedule::where('user_id', auth()->id())
            ->with('items')
            ->latest()
            ->first();

        if (!$schedule) {
            return response()->json([
                'message' => 'Aucun planning trouvé'
            ], 404);
        }

        return response()->json($schedule);
    }

    // Générer un planning
    public function store(Request $request)
    {
        $request->validate([
            'generated_date'       => 'sometimes|date',
            'items'                => 'required|array',
            'items.*.course_id'    => 'required|integer',
            'items.*.planned_date' => 'required|date',
            'items.*.duration'     => 'required|integer',
            'items.*.status'       => 'sometimes|in:pending,done,skipped',
        ]);

        // Supprimer l'ancien planning
        Schedule::where('user_id', auth()->id())->delete();

        // Créer le nouveau
        $schedule = Schedule::create([
            'user_id'        => auth()->id(),
            'generated_date' => $request->generated_date ?? Carbon::today()->toDateString(),
        ]);

        // Ajouter les items
        foreach ($request->items as $item) {
            ScheduleItem::create([
                'schedule_id'  => $schedule->id,
                'course_id'    => $item['course_id'],
                'planned_date' => $item['planned_date'],
                'duration'     => $item['duration'],
                'status'       => $item['status'] ?? 'pending',
            ]);
        }

        return response()->json([
            'message'  => 'Planning créé avec succès',
            'schedule' => $schedule->load('items'),
        ], 201);
    }

    // Supprimer le planning
    public function destroy(Request $request)
    {
        Schedule::where('user_id', auth()->id())->delete();

        return response()->json([
            'message' => 'Planning supprimé avec succès'
        ]);
    }
}