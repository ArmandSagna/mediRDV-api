<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\DashboardController;

Route::get('/appointments', [AppointmentController::class, 'index']);
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::apiResource('doctors', DoctorController::class)->except(['create', 'edit']);
Route::apiResource('patients', PatientController::class)->except(['create', 'edit']);
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);