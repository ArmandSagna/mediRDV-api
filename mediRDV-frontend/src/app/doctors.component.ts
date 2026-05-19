import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface DoctorProfile {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  nextAvailable: string;
  experience: string;
  patientsCount: number;
}

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
      </div>

      <div class="doctor-grid">
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
              <span>Note moyenne</span>
              <strong>{{ doctor.rating.toFixed(1) }}/5</strong>
            </div>
            <div>
              <span>Expérience</span>
              <strong>{{ doctor.experience }}</strong>
            </div>
          </div>

          <div class="doctor-bottom">
            <div>
              <p>Prochain créneau</p>
              <strong>{{ doctor.nextAvailable }}</strong>
            </div>
            <div>
              <p>Patients suivis</p>
              <strong>{{ doctor.patientsCount }}</strong>
            </div>
          </div>

          <footer class="card-actions">
            <button class="button outline" type="button" (click)="viewDoctor(doctor)">Voir</button>
            <button class="button accent" type="button" (click)="bookDoctor(doctor)">Prendre RDV</button>
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
export class DoctorsComponent {
  query = '';
  specialtyFilter = '';

  constructor(private router: Router) {}

  get specialties(): string[] {
    return Array.from(new Set(this.doctors.map(d => d.specialty)));
  }

  get filteredDoctors(): DoctorProfile[] {
    const q = this.query.trim().toLowerCase();
    return this.doctors.filter(d => {
      const matchesQuery = !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.location.toLowerCase().includes(q);
      const matchesSpecialty = !this.specialtyFilter || d.specialty === this.specialtyFilter;
      return matchesQuery && matchesSpecialty;
    });
  }

  initials(name: string) {
    return name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  }

  viewDoctor(d: DoctorProfile) {
    this.router.navigate(['/doctors', d.id]);
  }

  bookDoctor(d: DoctorProfile) {
    this.router.navigate(['/booking']);
  }

  protected readonly doctors: DoctorProfile[] = [
    {
      id: 1,
      name: 'Dr. Moustapha Diouf',
      specialty: 'Médecin Généraliste',
      location: 'Clinique Habib Thiam',
      rating: 4.8,
      nextAvailable: '26 mai • 10h30',
      experience: '15 ans',
      patientsCount: 860
    },
    {
      id: 2,
      name: 'Dr. Jean Diouf',
      specialty: 'Dermatologue',
      location: 'Centre Santé ',
      rating: 4.9,
      nextAvailable: '27 mai • 14h00',
      experience: '12 ans',
      patientsCount: 720
    },
    {
      id: 3,
      name: 'Dr. Marriane Fall',
      specialty: 'Dentiste',
      location: 'Hopital Principal de Dakar',
      rating: 4.7,
      nextAvailable: '26 mai • 09h00',
      experience: '11 ans',
      patientsCount: 540
    }
  ];
}
