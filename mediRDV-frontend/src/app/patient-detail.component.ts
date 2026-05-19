import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface PatientProfile {
  id: number;
  name: string;
  lastVisit: string;
  status: string;
  location: string;
  age: number;
  doctor: string;
  notes: string;
}

const PATIENTS: PatientProfile[] = [
  {
    id: 1,
    name: 'Armand Sagna',
    lastVisit: '10 mai 2026',
    status: 'Actif',
    location: 'Dakar',
    age: 48,
    doctor: 'Dr. Moustapha Diouf',
    notes: 'Suivi régulier pour hypertension artérielle. Prochain bilan dans 3 mois.'
  },
  {
    id: 2,
    name: 'Aloise Diop',
    lastVisit: '12 mai 2026',
    status: 'À vérifier',
    location: 'Thies',
    age: 35,
    doctor: 'Dr. Jean Diouf',
    notes: 'Contrôle dermatologique recommandé suite à irritation récurrente.'
  },
  {
    id: 3,
    name: 'Mariejeanne Coulibaly',
    lastVisit: '08 mai 2026',
    status: 'Actif',
    location: 'Pout',
    age: 29,
    doctor: 'Dr. Marriane Fall',
    notes: 'Bilan dentaire de routine. Aucune anomalie majeure détectée.'
  }
];

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel detail-panel">
      <div class="detail-header">
        <button class="button secondary" type="button" (click)="goBack()">← Retour</button>
        <div>
          <p class="eyebrow">Détails du patient</p>
          <h1>{{ patient?.name || 'Patient introuvable' }}</h1>
          <p *ngIf="patient">{{ patient.age }} ans • {{ patient.location }}</p>
        </div>
      </div>

      <div *ngIf="patient; else notFound">
        <div class="detail-grid">
          <div class="detail-card">
            <h2>Informations</h2>
            <p><strong>Statut :</strong> {{ patient.status }}</p>
            <p><strong>Dernière visite :</strong> {{ patient.lastVisit }}</p>
            <p><strong>Médecin référent :</strong> {{ patient.doctor }}</p>
            <p>{{ patient.notes }}</p>
          </div>

          <div class="detail-card actions-card">
            <h2>Actions</h2>
            <button class="button accent" type="button" (click)="goToBooking()">Prendre rendez-vous</button>
            <button class="button" type="button" (click)="goBack()">Retour aux patients</button>
          </div>
        </div>
      </div>

      <ng-template #notFound>
        <div class="detail-card">
          <p>Ce patient n’a pas été trouvé. Vérifiez l’URL et réessayez.</p>
        </div>
      </ng-template>
    </section>
  `,
  styles: [`
    .detail-panel { max-width: 980px; margin: 0 auto; padding: 2.5rem 1.5rem; }
    .detail-header { display:flex; gap:1rem; align-items:flex-start; margin-bottom:2rem; }
    .eyebrow { margin-bottom:0.75rem; display:inline-block; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; font-size:0.85rem; color:#2563eb; }
    h1 { margin:0; font-size:clamp(2rem, 3vw, 2.5rem); }
    .detail-grid { display:grid; gap:1.5rem; grid-template-columns:1.5fr 1fr; }
    .detail-card { background:white; border-radius:24px; padding:1.75rem; border:1px solid rgba(148,163,184,0.16); box-shadow:0 20px 45px rgba(15,23,42,0.05); }
    .stats { display:grid; gap:1rem; margin-top:1.5rem; color:#334155; }
    .actions-card { display:flex; flex-direction:column; gap:1rem; }
    .button { padding:0.95rem 1.4rem; border-radius:999px; border:none; cursor:pointer; font-weight:700; }
    .button.accent { background:#2563eb; color:white; }
    .button.secondary { background:#e2e8f0; color:#0f172a; }
    @media(max-width:860px) { .detail-grid { grid-template-columns:1fr; } }
  `]
})
export class PatientDetailComponent {
  patient?: PatientProfile;

  constructor(private route: ActivatedRoute, private router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.patient = PATIENTS.find(p => p.id === id) ?? undefined;
  }

  goBack() {
    this.router.navigate(['/patients']);
  }

  goToBooking() {
    this.router.navigate(['/booking']);
  }
}
