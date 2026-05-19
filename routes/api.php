<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AppointmentController;

Route::get('/appointments', [AppointmentController::class, 'index']);
Route::post('/appointments', [AppointmentController::class, 'store']);
