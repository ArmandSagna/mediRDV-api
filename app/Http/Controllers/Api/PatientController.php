<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;

class PatientController extends Controller
{
    public function index(): JsonResponse
    {
        $patients = Patient::orderBy('name')
            ->get(['id', 'name', 'email', 'phone', 'location', 'status', 'last_visit']);

        return response()->json([
            'success' => true,
            'data' => $patients,
        ]);
    }
}
