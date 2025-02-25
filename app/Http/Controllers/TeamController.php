<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Storage;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::all();
        foreach ($teams as $team) {
            $team->profile_picture = URL::to($team->profile_picture);
        }
        return response()->json($teams);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:teams,email',
            'phone_number' => 'required|string|unique:teams,phone_number',
            'profile_picture' => 'nullable|image|max:2048',
            'facebook' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
        ]);

        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('teams', 'public');
            $validated['profile_picture'] = Storage::url($path);
        }

        $team = Team::create($validated);

        return response()->json($team, 201);
    }

    public function update(Request $request, Team $team)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('teams')->ignore($team->id)],
            'phone_number' => ['required', 'string', Rule::unique('teams')->ignore($team->id)],
            'profile_picture' => 'nullable|image|max:2048',
            'facebook' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
        ]);

        if ($request->hasFile('profile_picture')) {
            // Delete old image if exists
            if ($team->profile_picture) {
                $oldPath = str_replace('/storage/', '', $team->profile_picture);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('profile_picture')->store('teams', 'public');
            $validated['profile_picture'] = Storage::url($path);
        }

        $team->update($validated);

        return response()->json($team);
    }

    public function destroy(Team $team)
    {
        if ($team->profile_picture) {
            $path = str_replace('/storage/', '', $team->profile_picture);
            Storage::disk('public')->delete($path);
        }

        $team->delete();

        return response()->json(200);
    }
}