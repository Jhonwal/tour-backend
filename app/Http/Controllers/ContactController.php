<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
use App\Models\User;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Get all admin users
        $admins = User::all();

        // Send personalized email to each admin
        foreach ($admins as $admin) {
            Mail::to($admin->email)->send(new ContactFormMail($validated, $admin->name));
        }

        return response()->json(['message' => 'Message sent successfully']);
    }
}
