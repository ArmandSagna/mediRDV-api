import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientProfile, PatientService } from './patient.service';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
            <p><strong>Médecin référent :</strong> {{ patient.assignedDoctor }}</p>
            <p>{{ patient.notes }}</p>
          </div>

          <div class="detail-card actions-card">
            <h2>Actions</h2>
            <button class="button accent" type="button" (click)="goToBooking()">Prendre rendez-vous</button>
            <button class="button" type="button" (click)="toggleEdit()">Modifier</button>
            <button class="button outline danger" type="button" (click)="deletePatient()">Supprimer</button>
          </div>
        </div>

        <section *ngIf="editMode" class="detail-card edit-card">
          <h2>Modifier le patient</h2>
          <div class="form-grid">
            <label>
              Nom
              <input type="text" [(ngModel)]="editPatient.name" />
            </label>
            <label>
              Email
              <input type="email" [(ngModel)]="editPatient.email" />
            </label>
            <label>
              Téléphone
              <input type="text" [(ngModel)]="editPatient.phone" />
            </label>
            <label>
              Localisation
              <input type="text" [(ngModel)]="editPatient.location" />
            </label>
          </div>
          <div class="form-grid">
            <label>
              Statut
              <input type="text" [(ngModel)]="editPatient.status" />
            </label>
            <label>
              Dernière visite
              <input type="date" [(ngModel)]="editPatient.lastVisit" />
            </label>
          </div>
          <div class="form-actions">
            <button class="button accent" type="button" (click)="savePatient()">Enregistrer</button>
            <button class="button outline" type="button" (click)="toggleEdit()">Annuler</button>
          </div>
        </section>
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
export class PatientDetailComponent implements OnInit {
  patient?: PatientProfile;
  editMode = false;
  editPatient: Partial<PatientProfile> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) {}

  async ngOnInit() {
    await this.patientService.loadPatients();
    this.loadPatient();
  }

  private loadPatient() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.patient = this.patientService.getPatient(id);
    if (this.patient) {
      this.editPatient = {
        id: this.patient.id,
        name: this.patient.name,
        email: this.patient.email,
        phone: this.patient.phone,
        location: this.patient.location,
        status: this.patient.status,
        lastVisit: this.patient.lastVisit
      };
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode && this.patient) {
      this.loadPatient();
    }
  }

  async savePatient() {
    if (!this.patient || !this.editPatient.name) {
      return;
    }

    await this.patientService.updatePatient(this.patient.id, {
      name: this.editPatient.name,
      email: this.editPatient.email ?? null,
      phone: this.editPatient.phone ?? null,
      location: this.editPatient.location ?? null,
      status: this.editPatient.status ?? null,
      last_visit: this.editPatient.lastVisit ?? null
    });

    this.loadPatient();
    this.editMode = false;
  }

  async deletePatient() {
    if (!this.patient) {
      return;
    }

    await this.patientService.deletePatient(this.patient.id);
    this.router.navigate(['/patients']);
  }

  goBack() {
    this.router.navigate(['/patients']);
  }

  goToBooking() {
    this.router.navigate(['/booking']);
  }
}
