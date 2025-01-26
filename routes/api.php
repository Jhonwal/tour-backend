<?php


use App\Models\TourType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TourDayController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DayImageController;
use App\Http\Controllers\TourTypeController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\TourPriceController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\VisitorCountController;
use App\Http\Controllers\CategoryController;
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
Route::get('/tour/slug/{slug}', [TourController::class, 'showSlug']);



Route::get('images', [ImageController::class, 'index']);


Route::get('/tour-types', function () {
    $tourTypes = TourType::with('tours')->get();
    return response()->json($tourTypes);
});
Route::get('/tour-types/page', [TourTypeController::class, 'tour_type']);
Route::post('/track-visitor', [VisitorCountController::class, 'trackVisitor']);
Route::get('visitor-counts/top-countries', [VisitorCountController::class, 'getTopCountries']);
Route::post('/delete/session', [SessionController::class, 'cleanup']);
Route::get('/tours/type/{slug}', [TourController::class, "tour_type"]);
Route::get('/tour/day/{id}', [TourDayController::class, 'getDayDetails']);
Route::get('/tour-prices/{id}', [TourPriceController::class, 'show']);

Route::post('/testimonials', [TestimonialController::class, 'store']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::post('/check-booking', [BookingController::class, 'checkBooking']);

Route::get('/blog', [BlogController::class, 'index']);
Route::get('/blog/{slug}', [BlogController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (){
        return response()->json(['name' => Auth::user()->name]);
    });
    Route::get('/user', [UserProfileController::class, 'getUserProfile']);
    Route::post('/user/profile', [UserProfileController::class, 'updateProfile']);
    Route::post('/user/security', [UserProfileController::class, 'updateSecurity']);

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
    Route::get('/tours/{id}', [TourController::class, 'showTour']);
    
    Route::get('/admin/analytics/visitor-count-by-month', [AnalyticsController::class, 'getVisitorCountByMonth']);
    Route::get('/admin/analytics/current-month-visitors-by-country', [AnalyticsController::class, 'getCurrentMonthVisitorsByCountry']);
    Route::get('/admin/analytics/tours-by-type', [AnalyticsController::class, 'getToursByType']);
    Route::get('/admin/analytics/key-metrics', [AnalyticsController::class, 'getKeyMetrics']);
    
});
Route::get('/admin/categories',[CategoryController::class, 'index']);
Route::prefix('tours/update')->group(function () {
    Route::get('/{id}', [TourController::class, 'getTourDetails']); // Get tour details
    Route::put('/{id}', [TourController::class, 'update']); // Update tour info
    Route::post('/{id}/images', [TourController::class, 'updateImages']); // Update tour images
    Route::put('/{id}/days', [TourController::class, 'updateDays']); // Update tour days
    Route::put('/{id}/destinations', [TourController::class, 'updateDestinations']); // Update tour destinations
    Route::put('/{id}/services', [TourController::class, 'updateServices']); // Update tour services
    Route::put('/{id}/prices', [TourController::class, 'updatePrices']); // Update tour prices
});
Route::prefix('tours')->group(function () {
    // Fetch tour details
    Route::get('update/{id}', [TourController::class, 'getTourDetails']);

    // Update tour information
    Route::post('update/{id}', [TourController::class, 'updateTour']);

    // Delete tour image
    Route::delete('tour-images/{id}', [TourController::class, 'deleteTourImage']);

    // Delete day image
    Route::delete('day-images/{id}', [TourController::class, 'deleteDayImage']);
});
