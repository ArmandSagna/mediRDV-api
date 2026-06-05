<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function show($id): JsonResponse
    {
        $doctor = Doctor::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $doctor,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'specialty' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'rating' => ['nullable', 'numeric', 'between:0,5'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $doctor = Doctor::create([
            'name' => $data['name'],
            'specialty' => $data['specialty'],
            'location' => $data['location'],
            'rating' => $data['rating'] ?? 4.5,
            'status' => $data['status'] ?? 'available',
        ]);

        return response()->json([
            'success' => true,
            'data' => $doctor,
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $doctor = Doctor::findOrFail($id);

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'specialty' => ['sometimes', 'required', 'string', 'max:255'],
            'location' => ['sometimes', 'required', 'string', 'max:255'],
            'rating' => ['nullable', 'numeric', 'between:0,5'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $doctor->update($data);

        return response()->json([
            'success' => true,
            'data' => $doctor,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $doctor = Doctor::findOrFail($id);
        $doctor->delete();

        return response()->json([
            'success' => true,
            'data' => null,
        ]);
    }
}
