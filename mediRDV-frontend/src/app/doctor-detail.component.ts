import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface DoctorProfile {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  nextAvailable: string;
  bio: string;
}

const DOCTORS: DoctorProfile[] = [
  {
    id: 1,
    name: 'Dr. Moustapha Diouf',
    specialty: 'Médecin Généraliste',
    location: 'Clinique du Parc',
    rating: 4.8,
    nextAvailable: '26 mai • 10h30',
    bio: 'Spécialiste des consultations de médecine générale, suivi préventif et gestion des pathologies chroniques.'
  },
  {
    id: 2,
    name: 'Dr. Jean Diouf',
    specialty: 'Dermatologue',
    location: 'Centre Santé cherif',
    rating: 4.9,
    nextAvailable: '27 mai • 14h00',
    bio: 'Expert en soins de la peau, traitement des maladies dermatologiques et consultations esthétiques.'
  },
  {
    id: 3,
    name: 'Dr. Marriane Fall',
    specialty: 'Dentiste',
    location: 'Cabinet Dentaire Montaigne',
    rating: 4.7,
    nextAvailable: '26 mai • 09h00',
    bio: 'Dentiste expérimentée en soins conservateurs, implants et traitements esthétiques du sourire.'
  }
];

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel detail-panel">
      <div class="detail-header">
        <button class="button secondary" type="button" (click)="goBack()">← Retour</button>
        <div>
          <p class="eyebrow">Détails du médecin</p>
          <h1>{{ doctor?.name || 'Médecin introuvable' }}</h1>
          <p *ngIf="doctor">{{ doctor.specialty }} • {{ doctor.location }}</p>
        </div>
      </div>

      <div *ngIf="doctor; else notFound">
        <div class="detail-grid">
          <div class="detail-card">
            <h2>À propos</h2>
            <p>{{ doctor.bio }}</p>
            <div class="stats">
              <span><strong>{{ doctor.rating.toFixed(1) }}/5</strong> note moyenne</span>
              <span><strong>{{ doctor.nextAvailable }}</strong> prochain créneau</span>
            </div>
          </div>

          <div class="detail-card actions-card">
            <h2>Actions</h2>
            <button class="button accent" type="button" (click)="goToBooking()">Prendre rendez-vous</button>
            <button class="button" type="button" (click)="goBack()">Retour aux médecins</button>
          </div>
        </div>
      </div>

      <ng-template #notFound>
        <div class="detail-card">
          <p>Impossible de trouver ce médecin. Vérifiez l’URL et réessayez.</p>
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
export class DoctorDetailComponent {
  doctor?: DoctorProfile;

  constructor(private route: ActivatedRoute, private router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.doctor = DOCTORS.find(d => d.id === id) ?? undefined;
  }

  goBack() {
    this.router.navigate(['/doctors']);
  }

  goToBooking() {
    this.router.navigate(['/booking']);
  }
}
