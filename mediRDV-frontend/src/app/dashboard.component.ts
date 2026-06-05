import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from './api.service';

// Statistique principale affichée dans les cartes du tableau de bord
interface StatCard {
  label: string;
  value: string;
  detail: string;
  accent: string;
}

// Structure d'un rendez-vous dans la liste du jour
interface AppointmentSummary {
  time: string;
  patient: string;
  specialty: string;
  doctor: string;
  status: string;
  badge: 'success' | 'warning' | 'info' | 'danger';
}

// Informations sur le praticien affichées dans la section "Praticiens disponibles"
interface DoctorCard {
  name: string;
  specialty: string;
  location: string;
  nextAvailable: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="panel">
      <div class="section-header">
        <div>
          <p class="eyebrow">Tableau de bord</p>
          <h1>Vue d'ensemble de la plateforme MediRDV</h1>
          <p>Suivez les rendez-vous du jour, le taux d'occupation et les professionnels disponibles.</p>
        </div>
        <a routerLink="/booking" class="button accent">Nouveau rendez-vous</a>
      </div>

      <!-- Cartes de métriques clés -->
      <div class="stats-grid">
        <article class="stat-card" *ngFor="let card of statCards()">
          <div class="stat-value">{{ card.value }}</div>
          <div class="stat-label">{{ card.label }}</div>
          <p>{{ card.detail }}</p>
        </article>
      </div>

      <div class="dashboard-grid">
        <div class="overview-card card">
          <div class="card-header">
            <h2>Rendez-vous du jour</h2>
            <span>{{ today }}</span>
          </div>
          <div class="timeline-list">
            <article class="timeline-item" *ngFor="let appointment of appointments">
              <div class="timeline-time">{{ appointment.time }}</div>
              <div>
                <strong>{{ appointment.patient }}</strong>
                <p>{{ appointment.specialty }} • {{ appointment.doctor }}</p>
              </div>
              <span class="status-chip" [ngClass]="appointment.badge">{{ appointment.status }}</span>
            </article>
          </div>
        </div>

        <aside class="calendar-card card">
          <div class="card-header">
            <h2>Mai 2026</h2>
            <span>Planning rapide</span>
          </div>
          <div class="calendar-grid">
            <div *ngFor="let day of days" class="calendar-day" [class.active]="day.active">{{ day.label }}</div>
          </div>
          <div class="calendar-footer">
            <p>8 rendez-vous aujourd’hui • 3 créneaux libres</p>
          </div>
        </aside>
      </div>

      <div class="doctor-panel card">
        <div class="card-header">
          <h2>Praticiens disponibles</h2>
          <span>Liste actualisée</span>
        </div>
        <div class="doctor-grid">
          <article class="doctor-card" *ngFor="let doctor of doctors">
            <div>
              <span class="pill accent">{{ doctor.specialty }}</span>
              <h3>{{ doctor.name }}</h3>
              <p>{{ doctor.location }}</p>
            </div>
            <span>{{ doctor.nextAvailable }}</span>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .panel {
      display: grid;
      gap: 2rem;
    }

    .eyebrow {
      display: inline-block;
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: #60a5fa;
      text-transform: uppercase;
      letter-spacing: 0.18em;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.2rem, 3vw, 3rem);
      line-height: 1.05;
    }

    .section-header {
      align-items: flex-start;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }

    .stat-card {
      background: #111827;
      border-radius: 24px;
      padding: 1.5rem;
      border: 1px solid rgba(148, 163, 184, 0.12);
    }

    .stat-value {
      font-size: 2.4rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.75rem;
    }

    .stat-card p {
      margin: 0;
      color: #94a3b8;
      line-height: 1.7;
    }

    .dashboard-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
    }

    .overview-card,
    .calendar-card,
    .doctor-panel {
      padding: 1.75rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
      align-items: center;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.3rem;
    }

    .timeline-list {
      display: grid;
      gap: 1rem;
    }

    .timeline-item {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(148, 163, 184, 0.1);
    }

    .timeline-time {
      color: #60a5fa;
      font-weight: 700;
      min-width: 4.5rem;
    }

    .timeline-item strong {
      display: block;
      margin-bottom: 0.35rem;
    }

    .timeline-item p {
      margin: 0;
      color: #94a3b8;
      font-size: 0.95rem;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 0.65rem;
    }

    .calendar-day {
      background: rgba(255, 255, 255, 0.04);
      border-radius: 16px;
      padding: 0.9rem 0.65rem;
      text-align: center;
      color: #94a3b8;
      font-weight: 700;
    }

    .calendar-day.active {
      background: #2563eb;
      color: white;
    }

    .calendar-footer {
      margin-top: 1.5rem;
      color: #94a3b8;
      font-size: 0.95rem;
    }

    .doctor-grid {
      display: grid;
      gap: 1rem;
    }

    .doctor-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(148, 163, 184, 0.1);
      padding: 1rem 1.2rem;
      border-radius: 20px;
    }

    .doctor-card h3 {
      margin: 0.3rem 0 0;
    }

    .doctor-card p {
      margin: 0.35rem 0 0;
      color: #94a3b8;
      font-size: 0.95rem;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      padding: 0.45rem 0.8rem;
      border-radius: 999px;
      background: rgba(37, 99, 235, 0.12);
      color: #bfdbfe;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    @media (max-width: 980px) {
      .stats-grid,
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  protected readonly today = '15 mai 2026';

  // Données affichées dans les métriques du dashboard
  protected readonly statCards = signal<StatCard[]>([
    {
      label: 'RDV aujourd’hui',
      value: '24',
      detail: 'Un pic de 3 rendez-vous par rapport à hier.',
      accent: 'blue'
    },
    {
      label: 'Patients actifs',
      value: '1 247',
      detail: 'Plus 12 patients ce mois-ci.',
      accent: 'green'
    },
    {
      label: 'Médecins disponibles',
      value: '8 / 11',
      detail: 'Professionnels connectés et prêts à recevoir.',
      accent: 'violet'
    },
    {
      label: 'Taux d’occupation',
      value: '87%',
      detail: 'Capacité encore élevée pour la journée.',
      accent: 'yellow'
    }
  ]);

  // Liste des rendez-vous du jour affichée dans le fil d'actualité
  protected readonly appointments: AppointmentSummary[] = [
    {
      time: '08:30',
      patient: 'Armand Sagna',
      specialty: 'Consultation générale',
      doctor: 'Dr. Ba',
      status: 'Confirmé',
      badge: 'success'
    },
    {
      time: '09:15',
      patient: 'Aloise Diop',
      specialty: 'Cardiologie',
      doctor: 'Dr. Diallo',
      status: 'En attente',
      badge: 'warning'
    },
    {
      time: '10:00',
      patient: 'Mariejeanne Coulibaly',
      specialty: 'Pédiatrie',
      doctor: 'Dr. Fall',
      status: 'En cours',
      badge: 'info'
    }
  ];

  protected readonly days = [
    { label: '1', active: false },
    { label: '2', active: false },
    { label: '3', active: false },
    { label: '4', active: false },
    { label: '5', active: false },
    { label: '6', active: false },
    { label: '7', active: false },
    { label: '8', active: false },
    { label: '9', active: false },
    { label: '10', active: false },
    { label: '11', active: false },
    { label: '12', active: false },
    { label: '13', active: false },
    { label: '14', active: false },
    { label: '15', active: true },
    { label: '16', active: false },
    { label: '17', active: false },
    { label: '18', active: false },
    { label: '19', active: false },
    { label: '20', active: false },
    { label: '21', active: false },
    { label: '22', active: false },
    { label: '23', active: false },
    { label: '24', active: false },
    { label: '25', active: false },
    { label: '26', active: false },
    { label: '27', active: false },
    { label: '28', active: false },
    { label: '29', active: false },
    { label: '30', active: false },
    { label: '31', active: false }
  ];

  // Praticiens disponibles et leur prochain créneau libre
  protected readonly doctors: DoctorCard[] = [
    {
      name: 'Dr. Moustapha Diouf',
      specialty: 'Généraliste',
      location: 'Clinique du Parc',
      nextAvailable: '26 mai • 10h30'
    },
    {
      name: 'Dr. Jean Diouf',
      specialty: 'Dermatologue',
      location: 'Centre Santé cherif',
      nextAvailable: '27 mai • 14h00'
    },
    {
      name: 'Dr. Marriane Fall',
      specialty: 'Dentiste',
      location: 'Cabinet Dentaire Montaigne',
      nextAvailable: '26 mai • 09h00'
    }
  ];

  constructor(private readonly api: ApiService) {
    this.loadDashboard();
  }

  private async loadDashboard() {
    try {
      const response = await this.api.getDashboard();
      if (response?.success) {
        const data = response.data;
        this.statCards.set([
          {
            label: 'Patients actifs',
            value: `${data.users_count}`,
            detail: 'Nombre total de patients enregistrés.',
            accent: 'green'
          },
          {
            label: 'Médecins',
            value: `${data.doctors_count ?? 'N/A'}`,
            detail: 'Praticiens présents sur la plateforme.',
            accent: 'violet'
          },
          {
            label: 'RDV planifiés',
            value: `${data.appointments_count ?? 'N/A'}`,
            detail: 'Rendez-vous totaux enregistrés.',
            accent: 'blue'
          },
          {
            label: 'Taux d’occupation',
            value: '87%',
            detail: 'Capacité actuelle de la journée.',
            accent: 'yellow'
          }
        ]);
      }
    } catch {
      // backend peut ne pas être disponible pendant le prototype
    }
  }
}
