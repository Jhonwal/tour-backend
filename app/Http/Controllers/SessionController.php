<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class SessionController extends Controller
{
    /**
     * Clean up expired sessions and retain the latest N sessions per user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function cleanup()
    {
        // Define the number of sessions to retain per user
        $retainLimit = 6;

        // Step 1: Remove expired sessions based on session lifetime
        $expiredSessionsCount = DB::table('sessions')
            ->where('last_activity', '<', now()->subMinutes(Config::get('session.lifetime'))->getTimestamp())
            ->delete();

        // Step 2: Retain the latest N sessions per user
        // Fetch all sessions grouped by user
        $allSessions = DB::table('sessions')
            ->select('id', 'user_id', 'last_activity')
            ->orderBy('user_id') // Group by user (requires user_id in sessions table)
            ->orderBy('last_activity', 'desc') // Order by most recent activity
            ->get();

        $sessionsToKeep = $allSessions
            ->groupBy('user_id') // Group sessions by user
            ->flatMap(function ($sessions) use ($retainLimit) {
                return $sessions->take($retainLimit)->pluck('id'); // Keep the latest N sessions per user
            });

        // Delete all other sessions except the retained ones
        $deletedSessionsCount = DB::table('sessions')
            ->whereNotIn('id', $sessionsToKeep)
            ->delete();

        return response()->json([
            'message' => 'Session cleanup completed.',
            'expired_sessions_removed' => $expiredSessionsCount,
            'active_sessions_kept' => $sessionsToKeep->count(),
            'other_sessions_deleted' => $deletedSessionsCount,
        ]);
    }
}
