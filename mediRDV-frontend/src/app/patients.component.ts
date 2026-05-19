import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface PatientProfile {
  id: number;
  name: string;
  age: number;
  lastVisit: string;
  status: string;
  location: string;
  assignedDoctor: string;
  nextAppointment: string;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel patients-panel">
      <div class="section-header">
        <div>
          <p class="eyebrow">Patients</p>
          <h1>Suivi des patients</h1>
          <p>Affichage des dossiers, des statuts de suivi et des prochains rendez-vous.</p>
        </div>
      </div>

      <div class="toolbar">
        <div class="search-group">
          <input placeholder="Rechercher un patient..." [(ngModel)]="query" />
          <select [(ngModel)]="statusFilter">
            <option value="">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="À vérifier">À vérifier</option>
          </select>
        </div>

        <div class="summary-pill">
          <span>{{ filteredPatients.length }}</span>
          patients correspondants
        </div>
      </div>

      <div class="summary-grid">
        <article class="summary-card">
          <p>Total patients</p>
          <strong>{{ patients.length }}</strong>
        </article>
        <article class="summary-card">
          <p>Suivi actif</p>
          <strong>{{ patients.filter(p => p.status === 'Actif').length }}</strong>
        </article>
        <article class="summary-card">
          <p>À vérifier</p>
          <strong>{{ patients.filter(p => p.status === 'À vérifier').length }}</strong>
        </article>
      </div>

      <div class="grid-columns">
        <article class="patient-card" *ngFor="let patient of filteredPatients">
          <header>
            <div>
              <p class="patient-meta-label">{{ patient.location }} • {{ patient.age }} ans</p>
              <h2>{{ patient.name }}</h2>
            </div>
            <span class="status-chip" [class.success]="patient.status === 'Actif'" [class.warning]="patient.status === 'À vérifier'">{{ patient.status }}</span>
          </header>

          <section class="patient-details">
            <div>
              <p><strong>Dernière visite</strong></p>
              <span>{{ patient.lastVisit }}</span>
            </div>
            <div>
              <p><strong>Médecin</strong></p>
              <span>{{ patient.assignedDoctor }}</span>
            </div>
            <div>
              <p><strong>Prochain RDV</strong></p>
              <span>{{ patient.nextAppointment }}</span>
            </div>
          </section>

          <footer class="card-actions">
            <button class="button outline" type="button" (click)="viewPatient(patient)">Voir</button>
            <button class="button accent" type="button" (click)="bookPatient(patient)">Prendre RDV</button>
          </footer>
        </article>
      </div>

      <div class="empty-state" *ngIf="filteredPatients.length === 0">
        Aucun patient trouvé. Ajustez la recherche ou le filtre de statut.
      </div>
    </section>
  `,
  styles: [`
    .patients-panel {
      padding: 2rem 1.5rem 3rem;
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .eyebrow {
      display: inline-block;
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.18em;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 3vw, 2.5rem);
      color: var(--text);
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .search-group {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) 220px;
      gap: 0.75rem;
      width: 100%;
      max-width: 680px;
    }

    input,
    select {
      width: 100%;
      padding: 0.95rem 1rem;
      border-radius: 16px;
      border: 1px solid rgba(148, 163, 184, 0.35);
      background: var(--surface);
      color: var(--text);
      font-size: 0.97rem;
    }

    .summary-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 1rem;
      border-radius: 999px;
      background: rgba(37, 99, 235, 0.1);
      color: var(--text);
      font-weight: 700;
      min-width: 190px;
    }

    .summary-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin-bottom: 1.75rem;
    }

    .summary-card {
      padding: 1.4rem;
      border-radius: 22px;
      background: var(--surface);
      border: 1px solid rgba(148, 163, 184, 0.16);
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.05);
    }

    .summary-card p {
      margin: 0 0 0.65rem;
      color: var(--subtext);
      font-size: 0.95rem;
      font-weight: 700;
    }

    .summary-card strong {
      font-size: 2rem;
      color: var(--text);
    }

    .grid-columns {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .patient-card {
      background: var(--surface);
      border-radius: 24px;
      padding: 1.5rem;
      border: 1px solid rgba(148, 163, 184, 0.16);
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .patient-card header {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 1rem;
    }

    .patient-card h2 {
      margin: 0.35rem 0 0;
      font-size: 1.35rem;
    }

    .patient-meta-label {
      margin: 0;
      color: var(--subtext);
      font-size: 0.95rem;
    }

    .patient-details {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .patient-details div p {
      margin: 0;
      color: var(--subtext);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .patient-details div span {
      display: block;
      margin-top: 0.45rem;
      font-weight: 700;
      color: var(--text);
      font-size: 0.98rem;
    }

    .card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .button {
      border: 1px solid transparent;
      border-radius: 999px;
      padding: 0.85rem 1.25rem;
      font-weight: 700;
      cursor: pointer;
      background: transparent;
      color: var(--text);
      transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    }

    .button:hover {
      transform: translateY(-1px);
    }

    .button.outline {
      border-color: rgba(148, 163, 184, 0.35);
    }

    .button.accent {
      background: var(--primary);
      color: white;
    }

    .status-chip {
      padding: 0.55rem 0.9rem;
      border-radius: 999px;
      font-weight: 700;
      color: white;
      min-width: 108px;
      text-align: center;
      align-self: flex-start;
    }

    .status-chip.success {
      background: #22c55e;
    }

    .status-chip.warning {
      background: #f97316;
    }

    .empty-state {
      margin-top: 1.5rem;
      padding: 1.5rem;
      border-radius: 20px;
      background: rgba(148, 163, 184, 0.12);
      color: var(--subtext);
      text-align: center;
    }

    @media (max-width: 1100px) {
      .summary-grid,
      .grid-columns {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 760px) {
      .search-group,
      .summary-grid,
      .grid-columns {
        grid-template-columns: 1fr;
      }

      .patients-panel {
        padding: 1.5rem 1rem 2.5rem;
      }
    }
  `]
})
export class PatientsComponent {
  // Search query and filter state
  query = '';
  statusFilter = '';

  constructor(private router: Router) {}

  // Compute filtered list based on query/status
  get filteredPatients(): PatientProfile[] {
    const q = this.query.trim().toLowerCase();
    return this.patients.filter(p => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.assignedDoctor.toLowerCase().includes(q);
      const matchesStatus = !this.statusFilter || p.status === this.statusFilter;
      return matchesQuery && matchesStatus;
    });
  }

  // Action: navigate to patient detail page
  viewPatient(p: PatientProfile) {
    this.router.navigate(['/patients', p.id]);
  }

  // Action: navigate to booking page
  bookPatient(p: PatientProfile) {
    this.router.navigate(['/booking']);
  }

  protected readonly patients: PatientProfile[] = [
    {
      id: 1,
      name: 'Armand Sagna',
      age: 48,
      lastVisit: '10 mai 2026',
      status: 'Actif',
      location: 'Dakar',
      assignedDoctor: 'Dr. Moustapha Diouf',
      nextAppointment: '02 juin 2026'
    },
    {
      id: 2,
      name: 'Aloise Diop',
      age: 35,
      lastVisit: '12 mai 2026',
      status: 'À vérifier',
      location: 'Thies',
      assignedDoctor: 'Dr. Jean Diouf',
      nextAppointment: 'En attente'
    },
    {
      id: 3,
      name: 'Mariejeanne Coulibaly',
      age: 29,
      lastVisit: '08 mai 2026',
      status: 'Actif',
      location: 'Pout',
      assignedDoctor: 'Dr. Marriane Fall',
      nextAppointment: '16 juin 2026'
    }
  ];
}
