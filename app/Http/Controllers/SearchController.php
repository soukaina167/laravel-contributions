<?php
// app/Http/Controllers/SearchController.php
namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2',
        ]);

        $query = $request->get('q');
        $mode  = $request->get('mode', 'detailed'); // detailed ou last_minute

        $courses = Course::with('instructor')
            ->where('status', 'approved')
            ->where(function($q) use ($query) {
                $q->where('title', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%");
            });

        // Mode dernière minute → cours récents
        if ($mode === 'last_minute') {
            $courses->orderBy('created_at', 'desc')->limit(5);
        }

        // Mode détaillé → avec reviews et stats
        if ($mode === 'detailed') {
            $courses->with(['reviews']);
        }

        return response()->json($courses->get());
    }
}