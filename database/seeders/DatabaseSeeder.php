<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $doctors = Doctor::insert([
            [
                'name' => 'Dr. Moustapha Diouf',
                'specialty' => 'Généraliste',
                'location' => 'Clinique Habib Thiam',
                'rating' => 4.8,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Jean Diouf',
                'specialty' => 'Dermatologue',
                'location' => 'Centre Santé Cherif',
                'rating' => 4.9,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Marriane Fall',
                'specialty' => 'Dentiste',
                'location' => 'Cabinet hôpital Principal de Dakar',
                'rating' => 4.7,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $patients = Patient::insert([
            [
                'name' => 'Fatou Ndiaye',
                'email' => 'fatou@example.com',
                'phone' => '770102030',
                'location' => 'Dakar',
                'status' => 'Actif',
                'last_visit' => Carbon::parse('2026-05-10 14:00:00'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Moussa Diop',
                'email' => 'moussa@example.com',
                'phone' => '7705060708',
                'location' => 'Dakar',
                'status' => 'À vérifier',
                'last_visit' => Carbon::parse('2026-05-12 09:15:00'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Aissatou Fall',
                'email' => 'aissatou@example.com',
                'phone' => '7708091011',
                'location' => 'Dakar',
                'status' => 'Actif',
                'last_visit' => Carbon::parse('2026-05-08 10:00:00'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $doctorIds = Doctor::pluck('id')->toArray();
        $patientIds = Patient::pluck('id')->toArray();

        Appointment::insert([
            [
                'patient_id' => $patientIds[0],
                'doctor_id' => $doctorIds[0],
                'scheduled_at' => Carbon::parse('2026-05-15 08:30:00'),
                'status' => 'Confirmé',
                'reason' => 'Consultation générale',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => $patientIds[1],
                'doctor_id' => $doctorIds[1],
                'scheduled_at' => Carbon::parse('2026-05-15 09:15:00'),
                'status' => 'En attente',
                'reason' => 'Suivi cardiologique',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'patient_id' => $patientIds[2],
                'doctor_id' => $doctorIds[2],
                'scheduled_at' => Carbon::parse('2026-05-15 10:00:00'),
                'status' => 'En cours',
                'reason' => 'Consultation dentaire',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
