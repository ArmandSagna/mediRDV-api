<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Notifications\AppointmentConfirmed;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AppointmentController extends Controller
{
    public function index(): JsonResponse
    {
        $appointments = Appointment::with(['doctor', 'patient'])
            ->orderBy('scheduled_at')
            ->get()
            ->map(function (Appointment $appointment) {
                return [
                    'id' => $appointment->id,
                    'scheduled_at' => $appointment->scheduled_at->toDateTimeString(),
                    'status' => $appointment->status,
                    'reason' => $appointment->reason,
                    'doctor' => $appointment->doctor?->name,
                    'patient' => $appointment->patient?->name,
                    'specialty' => $appointment->doctor?->specialty,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'integer', 'exists:patients,id'],
            'doctor_id' => ['required', 'integer', 'exists:doctors,id'],
            'scheduled_at' => ['required', 'date_format:Y-m-d H:i'],
            'reason' => ['nullable', 'string'],
        ]);

        $patient = Patient::find($data['patient_id']);
        $doctor = Doctor::find($data['doctor_id']);

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'scheduled_at' => $data['scheduled_at'],
            'status' => 'confirmé',
            'reason' => $data['reason'] ?? 'Consultation',
        ]);

        if ($patient) {
            try {
                $patient->notify(new AppointmentConfirmed($appointment));
            } catch (\Throwable $e) {
                Log::error('Appointment notification failed: ' . $e->getMessage(), [
                    'patient_id' => $patient->id ?? null,
                    'appointment_id' => $appointment->id ?? null,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $appointment->id,
                'scheduled_at' => $appointment->scheduled_at->toDateTimeString(),
                'status' => $appointment->status,
                'reason' => $appointment->reason,
                'doctor' => $doctor?->name,
                'patient' => $patient?->name,
                'specialty' => $doctor?->specialty,
            ],
        ]);
    }
}
