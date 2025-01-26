<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'facebook' => 'nullable|url',
            'instagram' => 'nullable|url',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('profile_picture')) {
            $imagePath = $request->file('profile_picture')->store('profile_pictures', 'public');
            $validatedData['profile_picture'] = Storage::url($imagePath);
        }
        User::find($user->id)
        ->update($validatedData);

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
            'currentPassword' => 'required',
            'newPassword' => 'required|min:8|confirmed'
        ]);

        // Verify current password
        if (!Hash::check($request->currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'currentPassword' => ['Current password is incorrect']
            ]);
        }

        // Update password
        User::find($user->id)
        ->update([
            'password' => Hash::make($request->newPassword)
        ]);

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }
}