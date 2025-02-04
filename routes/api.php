<?php


use App\Models\TourType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TourDayController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DayImageController;
use App\Http\Controllers\TourTypeController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\TourPriceController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\UserProfileController;
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
Route::get('/blog/{slug}/related', [BlogController::class, 'related']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (){
        return response()->json(['name' => Auth::user()->name]);
    });
    Route::get('/user', [UserProfileController::class, 'getUserProfile']);
    Route::post('/user/profile', [UserProfileController::class, 'updateProfile']);
    Route::post('/user/security', [UserProfileController::class, 'updateSecurity']);
    Route::get('/users/all', [AnalyticsController::class, 'getUsers']);
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
    Route::get('/tour-types/chart', [TourTypeController::class, 'shartShow']);
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

        // Fetch tour details
    Route::prefix('tours')->group(function () {
        Route::get('/update/{id}', [TourController::class, 'getTourDetails']);
        Route::post('/update-info/{id}', [TourController::class, 'updateTourInfo']);
        Route::post('/update-images/{id}', [TourController::class, 'updateTourImages']);
        Route::post('/update-day/{tourId}/{dayId}', [TourController::class, 'updateTourDay']);
        Route::post('/update-service/{tourId}/{serviceId}', [TourController::class, 'updateService']);
        Route::post('/update-destinations/{tourId}', [TourController::class, 'updateDestinations']);
        Route::post('/update-prices/{tourId}', [TourController::class, 'updatePrices']);
        Route::delete('/tour-images/{id}', [TourController::class, 'deleteTourImage']);
        Route::delete('/day-images/{id}', [TourController::class, 'deleteDayImage']);
    });

    Route::apiResource('/tour-types/type', TourTypeController::class);
    Route::get('/tour-types/type/{tourType}/tours', [TourTypeController::class, 'tours']);
    Route::apiResource('/admin/categories', CategoryController::class)->except(['update', 'destroy']);
    Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

    Route::get('/admin/categories/{category}/posts', [CategoryController::class, 'show']);
    Route::post('/admin/categories/{id}/posts', [PostController::class, 'store']);
    Route::get('/admin/posts/{id}', [PostController::class, 'show']);
    Route::put('/admin/posts/{id}', [PostController::class, 'update']);
    Route::delete('/admin/posts/{id}', [PostController::class, 'destroy']);
});

