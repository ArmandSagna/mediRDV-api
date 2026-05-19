<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;

class DoctorController extends Controller
{
    public function index(): JsonResponse
    {
        $doctors = Doctor::orderByDesc('rating')
            ->get(['id', 'name', 'specialty', 'location', 'rating', 'status']);

        return response()->json([
            'success' => true,
            'data' => $doctors,
        ]);
    }
}
