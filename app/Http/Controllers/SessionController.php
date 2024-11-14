<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller
{
    public function delete(){
            $latestSession = DB::table('sessions')
            ->orderBy('last_activity', 'desc')
            ->first();

        // Check if there's at least one session
        if ($latestSession) {
            // Delete all sessions except the most recent one
            DB::table('sessions')
                ->where('id', '!=', $latestSession->id)
                ->delete();

            return response()->json(['message' => 'Old sessions removed, only the latest session is kept.']);
        }

        return response()->json(['message' => 'No sessions found.']);
    }
}
