<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Affiche la page dashboard (Blade).
     */
    public function index()
    {
        return view('dashboard');
    }

    /**
     * Point API retournant des statistiques pour le dashboard.
     * Retourne un JSON contenant :
     * - users_count : nombre d'utilisateurs (obligatoire)
     * - doctors_count : nombre de médecins (nullable si table absente)
     * - appointments_count : nombre de rendez‑vous (nullable si table absente)
     *
     * La méthode vérifie d'abord si les tables existent pour éviter
     * les erreurs si le projet n'a pas encore ces modèles/migrations.
     */
    public function stats(Request $request)
    {
        // Nombre d'utilisateurs (table `users` fournie par défaut)
        $usersCount = User::count();

        // Compteurs optionnels : vérifions l'existence des tables
        $doctorsCount = null;
        if (Schema::hasTable('doctors')) {
            $doctorsCount = DB::table('doctors')->count();
        }

        $appointmentsCount = null;
        if (Schema::hasTable('appointments')) {
            $appointmentsCount = DB::table('appointments')->count();
        }
        return response()->json([
            'success' => true,
            'data' => [
                'users_count' => $usersCount,
                'doctors_count' => $doctorsCount,
                'appointments_count' => $appointmentsCount,
            ],
        ]);
    }
}
