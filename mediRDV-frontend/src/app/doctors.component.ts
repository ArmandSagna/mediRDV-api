import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService, DoctorProfile } from './doctor.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="panel doctors-panel">
      <div class="section-header">
        <div>
          <p class="eyebrow">Médecins</p>
          <h1>Notre réseau de médecins</h1>
          <p>Retrouvez facilement la disponibilité, la spécialité et la note de chaque praticien.</p>
        </div>
      </div>

      <div class="toolbar">
        <div class="search-group">
          <input placeholder="Rechercher un médecin..." [(ngModel)]="query" />
          <select [(ngModel)]="specialtyFilter">
            <option value="">Toutes les spécialités</option>
            <option *ngFor="let s of specialties" [value]="s">{{ s }}</option>
          </select>
        </div>
        <div class="summary-pill">
          <span>{{ filteredDoctors.length }}</span>
          médecins affichés
        </div>
        <button class="button accent" type="button" (click)="toggleAddDoctor()">
          {{ showAddForm ? 'Annuler' : 'Nouveau médecin' }}
        </button>
      </div>

      <section class="add-doctor-form card" *ngIf="showAddForm">
        <h2>Ajouter un nouveau médecin</h2>
        <div class="form-grid">
          <label>
            Nom du médecin
            <input type="text" [(ngModel)]="newDoctor.name" placeholder="Dr. Nom Prénom" />
          </label>
          <label>
            Spécialité
            <input type="text" [(ngModel)]="newDoctor.specialty" placeholder="Médecin Généraliste" />
          </label>
          <label>
            Lieu
            <input type="text" [(ngModel)]="newDoctor.location" placeholder="Clinique Habib Thiam" />
          </label>
          <label>
            Expérience
            <input type="text" [(ngModel)]="newDoctor.experience" placeholder="12 ans" />
          </label>
        </div>
        <div class="form-actions">
          <button class="button accent" type="button" (click)="addDoctor()">Ajouter</button>
          <button class="button outline" type="button" (click)="toggleAddDoctor()">Annuler</button>
        </div>
      </section>

      <div class="empty-state" *ngIf="loading">
        Chargement des médecins...
      </div>

      <div class="doctor-grid" *ngIf="!loading">
        <article class="doctor-card" *ngFor="let doctor of filteredDoctors">
          <div class="doctor-top">
            <div class="avatar">{{ initials(doctor.name) }}</div>
            <div>
              <span class="doctor-specialty">{{ doctor.specialty }}</span>
              <h2>{{ doctor.name }}</h2>
              <p>{{ doctor.location }}</p>
            </div>
          </div>

          <div class="doctor-stats">
            <div>
              <span>Expérience</span>
              <strong>{{ doctor.experience }}</strong>
            </div>
            <div>
              <span>Prochain créneau</span>
              <strong>{{ doctor.nextAvailable }}</strong>
            </div>
          </div>

          <div class="doctor-bottom">
            <div>
              <p>Patients suivis</p>
              <strong>{{ doctor.patientsCount }}</strong>
            </div>
          </div>

          <footer class="card-actions">
            <button class="button outline" type="button" (click)="viewDoctor(doctor)">Voir</button>
            <button class="button accent" type="button" (click)="bookDoctor(doctor)">Prendre RDV</button>
            <button class="button outline danger" type="button" (click)="deleteDoctor(doctor)">Supprimer</button>
          </footer>
        </article>
      </div>

      <div class="empty-state" *ngIf="filteredDoctors.length === 0">
        Aucun médecin trouvé. Ajustez la recherche ou sélectionnez une spécialité.
      </div>
    </section>
  `,
  styles: [`
    .doctors-panel {
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
      max-width: 700px;
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

    .doctor-grid {
      display: grid;
      gap: 1.25rem;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .doctor-card {
      background: var(--surface);
      border-radius: 24px;
      padding: 1.75rem;
      border: 1px solid rgba(148, 163, 184, 0.16);
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.05);
      display: grid;
      gap: 1.25rem;
    }

    .doctor-top {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eef2ff;
      color: #3730a3;
      font-weight: 800;
      font-size: 1.1rem;
    }

    .doctor-specialty {
      display: inline-flex;
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 0.85rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    h2 {
      margin: 0;
      font-size: 1.35rem;
      color: var(--text);
    }

    p {
      margin: 0;
      color: var(--subtext);
      line-height: 1.75;
    }

    .doctor-stats,
    .doctor-bottom {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      padding: 1rem 0;
      border-top: 1px solid rgba(148, 163, 184, 0.12);
      border-bottom: 1px solid rgba(148, 163, 184, 0.12);
    }

    .doctor-stats div,
    .doctor-bottom div {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .doctor-stats span,
    .doctor-bottom p {
      font-size: 0.85rem;
      color: var(--subtext);
      text-transform: uppercase;
      letter-spacing: 0.11em;
    }

    .doctor-stats strong,
    .doctor-bottom strong {
      color: var(--text);
      font-size: 1.05rem;
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

    .button.danger {
      border-color: rgba(248, 113, 113, 0.35);
      color: #b91c1c;
    }

    .button.accent {
      background: var(--primary);
      color: white;
    }

    .empty-state {
      margin-top: 1.5rem;
      padding: 1.5rem;
      border-radius: 20px;
      background: rgba(148, 163, 184, 0.12);
      color: var(--subtext);
      text-align: center;
    }

    .add-doctor-form {
      display: grid;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 24px;
      background: var(--surface);
      border: 1px solid rgba(148, 163, 184, 0.16);
      margin-bottom: 1.5rem;
    }

    .add-doctor-form h2 {
      margin: 0 0 0.75rem;
    }

    .form-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .form-grid label {
      display: grid;
      gap: 0.5rem;
      color: var(--text);
      font-weight: 700;
      font-size: 0.95rem;
    }

    .form-grid input {
      width: 100%;
      padding: 0.95rem 1rem;
      border-radius: 16px;
      border: 1px solid rgba(148, 163, 184, 0.35);
      background: var(--surface);
      color: var(--text);
      font-size: 0.95rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    @media (max-width: 1100px) {
      .doctor-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 900px) {
      .doctor-grid {
        grid-template-columns: 1fr;
      }

      .search-group {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 760px) {
      .doctors-panel {
        padding: 1.5rem 1rem 2.5rem;
      }
    }
  `]
})
export class DoctorsComponent implements OnInit {
  query = '';
  specialtyFilter = '';
  showAddForm = false;
  newDoctor: Partial<DoctorProfile> = {
    name: '',
    specialty: '',
    location: '',
    rating: 4.5,
    experience: '',
    patientsCount: 0
  };

  constructor(private router: Router, private doctorService: DoctorService) {}

  loading = true;

  get specialties(): string[] {
    return this.doctorService.specialties;
  }

  get filteredDoctors(): DoctorProfile[] {
    const q = this.query.trim().toLowerCase();
    return this.doctorService.doctors().filter(d => {
      const matchesQuery = !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.location.toLowerCase().includes(q);
      const matchesSpecialty = !this.specialtyFilter || d.specialty === this.specialtyFilter;
      return matchesQuery && matchesSpecialty;
    });
  }

  async ngOnInit() {
    await this.doctorService.loadDoctors();
    this.loading = false;
  }

  initials(name: string) {
    return name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  }

  toggleAddDoctor() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.newDoctor = {
      name: '',
      specialty: '',
      location: '',
      rating: 4.5,
      experience: '',
      patientsCount: 0
    };
  }

  async addDoctor() {
    if (!this.newDoctor.name || !this.newDoctor.specialty || !this.newDoctor.location) {
      return;
    }

    await this.doctorService.addDoctor({
      name: this.newDoctor.name,
      specialty: this.newDoctor.specialty,
      location: this.newDoctor.location,
      experience: this.newDoctor.experience || '0 ans'
    });

    this.toggleAddDoctor();
  }

  async deleteDoctor(doctor: DoctorProfile) {
    await this.doctorService.deleteDoctor(doctor.id);
  }

  viewDoctor(d: DoctorProfile) {
    this.router.navigate(['/doctors', d.id]);
  }

  bookDoctor(d: DoctorProfile) {
    this.router.navigate(['/booking']);
  }
}
