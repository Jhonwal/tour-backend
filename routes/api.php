<?php


use App\Models\TourType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TourController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\VisitorCountController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\TourDayController;
use App\Http\Controllers\DestinationController;



Route::get('/destinations/featured', [TourController::class, 'getThree']);

//Route::post('/register', [RegisteredUserController::class, 'store'])
//                ->middleware('guest')
//                ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
                ->middleware('guest')
                ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
                ->middleware('guest')
                ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
                ->middleware('guest')
                ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
                ->middleware(['auth', 'signed', 'throttle:6,1'])
                ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
                ->middleware(['auth', 'throttle:6,1'])
                ->name('verification.send');


Route::get('/tour-types', function () {
    return TourType::all();
});
Route::post('/track-visitor', [VisitorCountController::class, 'trackVisitor']);
Route::get('visitor-counts/top-countries', [VisitorCountController::class, 'getTopCountries']);
Route::post('/delete/session', [SessionController::class, 'delete']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (){
        return response()->json(['name' => Auth::user()->name]);
    });
    Route::get('/tours/countOfTours', [TourController::class, 'count']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
    Route::post('/add-tours', [TourController::class, 'store']);
    Route::get('/last-tour', [TourController::class, 'lastTour']);

    Route::get('/activities', [ActivityController::class, 'index']);
    Route::get('/tour-days/{tour_id}', [TourDayController::class, 'index']);

    Route::post('/tour-days', [TourDayController::class, 'store']);
    Route::post('/submit-day', [TourDayController::class, 'updateDayAndActivities']);
    Route::post('/destinations/store', [DestinationController::class, 'store']);

});
