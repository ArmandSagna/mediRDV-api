<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function show($id): JsonResponse
    {
        $patient = Patient::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $patient,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:50'],
            'last_visit' => ['nullable', 'date'],
        ]);

        $patient = Patient::create([
            'name' => $data['name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'location' => $data['location'] ?? null,
            'status' => $data['status'] ?? 'Actif',
            'last_visit' => $data['last_visit'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $patient,
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $patient = Patient::findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:50'],
            'last_visit' => ['nullable', 'date'],
        ]);

        $patient->update($data);

        return response()->json([
            'success' => true,
            'data' => $patient,
        ]);
    }

    public function destroy($id): JsonResponse
    {
    
        $patient = Patient::findOrFail($id);
        $patient->delete();

        return response()->json([
            'success' => true,
            'data' => null,
        ]);
    }
}
