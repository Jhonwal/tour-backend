<?php


use App\Models\User;
use App\Models\TourType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TourDayController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DayImageController;
use App\Http\Controllers\TourTypeController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\TourPriceController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\TourRequestController;
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


Route::get('/tour-types', [TourTypeController::class, 'index']);
Route::get('/phone-numbers', function () {
    $phoneNumbers = User::pluck('phone_number'); // This will return an array of phone numbers

    return response()->json($phoneNumbers);
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
Route::get('/faqs/frontend', [FaqController::class, 'index']);
Route::get('/team', [UserProfileController::class, 'getTeamMembers']);
Route::get('/promotions/front', [PromotionController::class, 'indexFrontend']);
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/getAllAnalyticsData', [AnalyticsController::class, 'getAllAnalyticsData']);
Route::post('/tour-requests', [TourRequestController::class, 'store']);

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
    Route::delete('/admin/bookings/{id}', [BookingController::class, 'destroy']);
    Route::put('/admin/bookings/{booking}/status', [BookingController::class, 'updateStatus']);
    Route::get('/tours/{id}', [TourController::class, 'showTour']);
    
    Route::get('/admin/analytics/get-all-analytics-data', [AnalyticsController::class, 'getAllAnalyticsData']);


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
        Route::delete('/tour-days/{dayId}/activities/{id}', [TourDayController::class, 'deleteActivity']);
        Route::delete('/delete-service/{tourId}/{serviceId}', [ServiceController::class, 'deleteService']);
        Route::post('/add-service/{tourId}', [ServiceController::class, 'addService']);
        Route::post('/add-destination/{tourId}', [DestinationController::class, 'newDestination']);
        Route::delete('/delete-destination/{destinationId}', [DestinationController::class, 'deleteDestination']);
        
        Route::post('/tour-days/{tourDayId}/hotels', [TourDayController::class, 'addHotel']);
        Route::put('/tour-days/{tourDayId}/hotels/{hotelIndex}', [TourDayController::class, 'updateHotel']);
        Route::delete('/tour-days/{tourDayId}/hotels/{hotelIndex}', [TourDayController::class, 'deleteHotel']);

        Route::post('/tour-days/{tourId}/{dayId}/activities', [TourDayController::class, 'addActivity']);
    });
    Route::delete('/tour/{id}', [TourController::class, 'destroy']);

    Route::apiResource('/tour-types/type', TourTypeController::class);
    Route::put('/tour-types/type/update/{id}', [TourTypeController::class, 'update']);
    Route::get('/tour-types/type/{tourType}/tours', [TourTypeController::class, 'tours']);
    Route::apiResource('/admin/categories', CategoryController::class)->except(['update', 'destroy']);
    Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

    Route::get('/admin/categories/{category}/posts', [CategoryController::class, 'show']);
    Route::post('/admin/categories/{id}/posts', [PostController::class, 'store']);
    Route::get('/admin/posts/{id}', [PostController::class, 'show']);
    Route::put('/admin/posts/{id}', [PostController::class, 'update']);
    Route::delete('/admin/posts/{id}', [PostController::class, 'destroy']);

    Route::get('/faqs/all', [FaqController::class, 'all']);
    Route::apiResource('/faqs', FaqController::class);
    
    Route::apiResource('/promotions', PromotionController::class);

    Route::get('/tour-requests', [TourRequestController::class, 'index']);
    Route::patch('/tour-requests/{tourRequest}/status', [TourRequestController::class, 'updateStatus']);
    Route::post('/tour-requests/{tourRequest}/email', [TourRequestController::class, 'sendEmail']);

    Route::apiResource('/activities', ActivityController::class);

    Route::get('/activities/day/{id}', [ActivityController::class, 'getactivitynotexist']);
});