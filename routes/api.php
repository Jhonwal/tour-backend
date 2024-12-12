<?php


use App\Models\TourType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TourController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TourDayController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DayImageController;
use App\Http\Controllers\TourTypeController;
use App\Http\Controllers\TourPriceController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\VisitorCountController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;

Route::get('/destinations/featured', [TourController::class, 'getThree']);


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

Route::get('/tour/{id}', [TourController::class, 'show']);

Route::get('images', [ImageController::class, 'index']);


Route::get('/tour-types', function () {
    $tourTypes = TourType::with('tours')->get();
    return response()->json($tourTypes);
});
Route::get('/tour-types/page', [TourTypeController::class, 'tour_type']);
Route::post('/track-visitor', [VisitorCountController::class, 'trackVisitor']);
Route::get('visitor-counts/top-countries', [VisitorCountController::class, 'getTopCountries']);
Route::post('/delete/session', [SessionController::class, 'cleanup']);
Route::get('/tours/type/{type}', [TourController::class, "tour_type"]);
Route::get('/tour/day/{id}', [TourDayController::class, 'getDayDetails']);
Route::get('/tour-prices/{id}', [TourPriceController::class, 'show']);

Route::post('/testimonials', [TestimonialController::class, 'store']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::post('/check-booking', [BookingController::class, 'checkBooking']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (){
        return response()->json(['name' => Auth::user()->name]);
    });
    Route::get('/tours', [TourController::class, 'index']);
    Route::get('/tours/countOfTours', [TourController::class, 'count']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::post('/add-tours', [TourController::class, 'store']);
    Route::get('/last-tour', [TourController::class, 'lastTour']);
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::get('/tour-days/{tour_id}', [TourDayController::class, 'index']);
    Route::post('/tour-days', [TourDayController::class, 'store']);
    Route::post('/submit-day', [TourDayController::class, 'updateDayAndActivities']);
    Route::post('/destinations/store', [DestinationController::class, 'store']);
    Route::post('/services/store', [ServiceController::class, 'store']);
    Route::post('/tour-prices', [TourPriceController::class, 'store']);
    Route::post('/tour/latest-days/pictures', [DayImageController::class, 'uploadPictures']);
    Route::get('/tour-types/chart', [TourTypeController::class, 'show']);
    Route::get('/testimonials/all', [TestimonialController::class, 'showAll']);
    Route::put('/testimonials/{id}', [TestimonialController::class, 'updateState']);
    Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);
    Route::get('/admin/bookings', [BookingController::class, 'index']);
    Route::post('/admin/bookings', [BookingController::class, 'store']);
    Route::put('/admin/bookings/{id}', [BookingController::class, 'update']);
    Route::delete('/admin/bookings/{id}', [BookingController::class, 'destroy']);

    
});
