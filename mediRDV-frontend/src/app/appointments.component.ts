import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Représente une ligne de tableau pour un rendez-vous
interface AppointmentRow {
  time: string;
  patient: string;
  doctor: string;
  specialty: string;
  status: string;
  badge: 'success' | 'warning' | 'info' | 'danger';
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel">
      <div class="section-header">
        <div>
          <p class="eyebrow">Rendez-vous</p>
          <h1>Planning des consultations</h1>
          <p>Suivez les prochains rendez-vous et gérez efficacement les créneaux disponibles.</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Prochains rendez-vous</h2>
          <span>15 mai 2026</span>
        </div>

        <div class="table-list">
          <article class="table-row table-header">
            <div>Heure / Patient</div>
            <div>Spécialité</div>
            <div>Médecin</div>
            <div>Statut</div>
          </article>

          <article class="table-row" *ngFor="let appointment of appointments">
            <div>
              <strong>{{ appointment.time }}</strong>
              <p>{{ appointment.patient }}</p>
            </div>
            <div>{{ appointment.specialty }}</div>
            <div>{{ appointment.doctor }}</div>
            <span class="status-chip" [ngClass]="appointment.badge">{{ appointment.status }}</span>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .section-header {
      margin-bottom: 1.5rem;
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
      font-size: clamp(2rem, 3vw, 2.5rem);
    }

    .card {
      padding: 1.5rem;
    }

    .table-list {
      display: grid;
      gap: 1rem;
    }

    .table-row {
      display: grid;
      grid-template-columns: 120px 1fr 1fr auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(148, 163, 184, 0.1);
    }

    .table-row.table-header {
      background: rgba(37, 99, 235, 0.08);
      border-color: rgba(37, 99, 235, 0.18);
      color: #bfdbfe;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .table-row strong {
      display: block;
      font-size: 1.05rem;
      margin-bottom: 0.25rem;
    }

    .table-row p {
      margin: 0;
      color: #94a3b8;
      font-size: 0.95rem;
    }

    @media (max-width: 820px) {
      .table-row {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
    }
  `]
})
export class AppointmentsComponent {
  // Liste des rendez-vous affichée sur la page de planning
  protected readonly appointments: AppointmentRow[] = [
    {
      time: '08:30',
      patient: 'Armand Sagna',
      doctor: 'Dr. Ba',
      specialty: 'Consultation générale',
      status: 'Confirmé',
      badge: 'success'
    },
    {
      time: '09:15',
      patient: 'Aloise Diop',
      doctor: 'Dr. Diallo',
      specialty: 'Cardiologie',
      status: 'En attente',
      badge: 'warning'
    },
    {
      time: '10:00',
      patient: 'Mariejeanne Coulibaly',
      doctor: 'Dr. Fall',
      specialty: 'Pédiatrie',
      status: 'En cours',
      badge: 'info'
    },
    {
      time: '11:30',
      patient: 'Sébastien Faye',
      doctor: 'Dr. Martin',
      specialty: 'Dermatologie',
      status: 'Annulé',
      badge: 'danger'
    }
  ];
}
