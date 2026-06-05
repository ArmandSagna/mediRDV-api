import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService, DoctorProfile } from './doctor.service';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
            <div class="stats">
              <span><strong>{{ doctor.experience }}</strong> expérience</span>
              <span><strong>{{ doctor.patientsCount }}</strong> patients suivis</span>
            </div>
          </div>

          <div class="detail-card actions-card">
            <h2>Actions</h2>
            <button class="button accent" type="button" (click)="goToBooking()">Prendre rendez-vous</button>
            <button class="button" type="button" (click)="toggleEdit()">Modifier</button>
            <button class="button outline danger" type="button" (click)="deleteDoctor()">Supprimer</button>
          </div>
        </div>

        <section *ngIf="editMode" class="detail-card edit-card">
          <h2>Modifier le médecin</h2>
          <div class="form-grid">
            <label>
              Nom
              <input type="text" [(ngModel)]="editDoctor.name" />
            </label>
            <label>
              Spécialité
              <input type="text" [(ngModel)]="editDoctor.specialty" />
            </label>
            <label>
              Lieu
              <input type="text" [(ngModel)]="editDoctor.location" />
            </label>
            <label>
              Expérience
              <input type="text" [(ngModel)]="editDoctor.experience" />
            </label>
          </div>
          <div class="form-actions">
            <button class="button accent" type="button" (click)="saveDoctor()">Enregistrer</button>
            <button class="button outline" type="button" (click)="toggleEdit()">Annuler</button>
          </div>
        </section>
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
    .button.outline { border:1px solid rgba(148,163,184,0.16); background:white; color:#0f172a; }
    .button.danger { border-color: rgba(248, 113, 113, 0.35); color: #b91c1c; }
    .edit-card { margin-top: 1.5rem; }
    .form-grid { display:grid; gap:1rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .form-grid label { display:grid; gap:0.5rem; font-weight:700; color:#0f172a; }
    .form-grid input { width:100%; padding:0.95rem 1rem; border-radius:16px; border:1px solid rgba(148,163,184,0.35); }
    .form-actions { display:flex; gap:0.75rem; justify-content:flex-end; margin-top:1rem; }
    @media(max-width:860px) { .detail-grid { grid-template-columns:1fr; } .form-grid { grid-template-columns:1fr; } }
  `]
})
export class DoctorDetailComponent implements OnInit {
  doctor?: DoctorProfile;
  editMode = false;
  editDoctor: Partial<DoctorProfile> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService
  ) {}

  async ngOnInit() {
    await this.doctorService.loadDoctors();
    this.loadDoctor();
  }

  private loadDoctor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.doctor = this.doctorService.getDoctor(id);
    if (this.doctor) {
      this.editDoctor = { ...this.doctor };
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode && this.doctor) {
      this.editDoctor = { ...this.doctor };
    }
  }

  async saveDoctor() {
    if (!this.doctor) {
      return;
    }

    await this.doctorService.updateDoctor(this.doctor.id, {
      name: this.editDoctor.name,
      specialty: this.editDoctor.specialty,
      location: this.editDoctor.location,
      experience: this.editDoctor.experience,
      rating: this.editDoctor.rating,
      status: this.editDoctor.status
    });

    this.loadDoctor();
    this.editMode = false;
  }

  async deleteDoctor() {
    if (!this.doctor) {
      return;
    }

    await this.doctorService.deleteDoctor(this.doctor.id);
    this.router.navigate(['/doctors']);
  }

  goBack() {
    this.router.navigate(['/doctors']);
  }

  goToBooking() {
    this.router.navigate(['/booking']);
  }
}
