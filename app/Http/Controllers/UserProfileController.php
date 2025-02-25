<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Team;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;

class UserProfileController extends Controller
{
    // Get current user profile
    public function getUserProfile()
    {
        $user = Auth::user();
        if($user){
            $user->profile_picture = URL::to($user->profile_picture);
            return response()->json($user, 200);
        }
        return response()->json([null], 404);
    }

    // Update user profile
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
    
        // Define the validation rules
        $validationRules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
            'phone_number' => 'required|max:30',
            'bio' => 'nullable|string|max:1000',
            'facebook' => 'nullable|url',
            'instagram' => 'nullable|url',
            'role' => 'nullable|string',
        ];
    
        if ($request->hasFile('profile_picture')) {
            $validationRules['profile_picture'] = 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048';
        }
    
        // Validate the request data
        $validatedData = $request->validate($validationRules);
    
        // Handle profile picture upload if present
        if ($request->hasFile('profile_picture')) {
            $imagePath = $request->file('profile_picture')->store('profile_pictures', 'public');
            $validatedData['profile_picture'] = Storage::url($imagePath);
        }
    
        // Update the user's profile
        User::find($user->id)->update($validatedData);
    
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    // Update user security settings
    public function updateSecurity(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed'
        ]);

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'currentPassword' => ['Current password is incorrect']
            ]);
        }

        // Update password
        User::find($user->id)
        ->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }
    public function getTeamMembers()
    {
        try {
            // Fetch data
            $users = User::all();
            $teamMembers = Team::all();
            $completedBookingCount = Booking::where('status', 'completed')->count();
            $tourCount = Tour::count();
    
            foreach ($teamMembers as $key) {
                $key->email = null;
            }
            $team = $users->merge($teamMembers);
    
            foreach ($team as $user) {
                $user->profile_picture = URL::to($user->profile_picture);
            }
    
            // Return JSON response
            return response()->json([
                'teamMembers' => $team,
                'book' => $completedBookingCount,
                'tourCount' => $tourCount,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching data.'], 500);
        }
    }
}