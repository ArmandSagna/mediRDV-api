import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';

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
          <span>{{ todayLabel }}</span>
        </div>

        <div class="table-list">
          <article class="table-row table-header">
            <div>Heure / Patient</div>
            <div>Spécialité</div>
            <div>Médecin</div>
            <div>Statut</div>
          </article>

          <ng-container *ngIf="appointments().length > 0; else emptyState">
            <article class="table-row" *ngFor="let appointment of appointments()">
              <div>
                <strong>{{ appointment.time }}</strong>
                <p>{{ appointment.patient }}</p>
              </div>
              <div>{{ appointment.specialty }}</div>
              <div>{{ appointment.doctor }}</div>
              <span class="status-chip" [ngClass]="appointment.badge">{{ appointment.status }}</span>
            </article>
          </ng-container>

          <ng-template #emptyState>
            <article class="table-row empty-row">
              <div colspan="4">Aucun rendez-vous disponible.</div>
            </article>
          </ng-template>
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

    .table-row.empty-row {
      grid-template-columns: 1fr;
      justify-items: center;
      text-align: center;
      background: rgba(255, 255, 255, 0.02);
      color: #64748b;
      font-weight: 700;
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
  // Appel du service API pour récupérer les rendez-vous
  private readonly api = inject(ApiService);

  // Signal qui stocke la liste des rendez-vous depuis l'API
  protected readonly appointments = signal<AppointmentRow[]>([]);

  // Label pour afficher la date d'aujourd'hui
  protected readonly todayLabel = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  constructor() {
    this.loadAppointments();
  }

  // Charge les rendez-vous depuis l'API dès l'initialisation
  protected async loadAppointments() {
    try {
      const response = await this.api.getAppointments();

      this.appointments.set(
        response.data.map((appointment) => ({
          time: appointment.scheduled_at.slice(11),
          patient: appointment.patient,
          doctor: appointment.doctor,
          specialty: appointment.specialty ?? appointment.reason ?? 'Consultation',
          status: appointment.status,
          badge: this.statusBadge(appointment.status)
        }))
      );
    } catch (error) {
      // Si l'API ne répond pas, on garde une liste vide pour éviter les erreurs
      this.appointments.set([]);
    }
  }

  // Détermine la couleur du badge en fonction du statut
  protected statusBadge(status: string): 'success' | 'warning' | 'info' | 'danger' {
    if (status.toLowerCase().includes('confirm')) {
      return 'success';
    }

    if (status.toLowerCase().includes('attente')) {
      return 'warning';
    }

    if (status.toLowerCase().includes('en cours')) {
      return 'info';
    }

    return 'danger';
  }
}
