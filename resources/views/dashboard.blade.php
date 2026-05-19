<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dashboard</title>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 40px; }
        .card { border: 1px solid #ddd; padding: 20px; border-radius: 6px; width: 320px; }
        .label { color: #666; font-size: 14px; }
        .value { font-size: 32px; margin-top: 8px; }
    </style>
</head>
<body>

    <!-- Vue simple du dashboard : affiche des cartes de statistiques -->
    <h1>Tableau de bord</h1>

    <div class="card">
        <div class="label">Utilisateurs enregistrés</div>
        <div id="users-count" class="value">—</div>
    </div>

    <script>
        // Récupère les statistiques depuis le point API /dashboard/stats
        // et met à jour la page. Le code est volontairement simple
        // pour être facilement compris et commenté.
        async function loadStats() {
            try {
                const res = await fetch('/dashboard/stats', { headers: { 'Accept': 'application/json' } });
                if (!res.ok) throw new Error('Erreur réseau');
                const json = await res.json();

                // Si la réponse contient les données attendues, on met à jour le DOM
                if (json && json.success && json.data) {
                    document.getElementById('users-count').textContent = json.data.users_count;
                } else {
                    document.getElementById('users-count').textContent = 'N/A';
                }
            } catch (err) {
                // En cas d'erreur, afficher un message simple
                document.getElementById('users-count').textContent = 'Erreur';
                console.error('Impossible de charger les statistiques du dashboard', err);
            }
        }

        // Chargement initial
        loadStats();
    </script>

</body>
</html>
