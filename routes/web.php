<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\AppointmentController;

Route::get('/', function () {
    return view('welcome');
});

// API routes are defined in routes/api.php to keep them stateless (no CSRF).

// Routes du dashboard protégées par le middleware d'authentification
Route::middleware('auth')->group(function () {
    // Page dashboard simple
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Point API pour récupérer les statistiques du dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});
