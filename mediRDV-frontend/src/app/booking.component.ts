import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Moustapha Diouf',
    specialty: 'Généraliste',
    location: 'Clinique du Parc',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Dr. Jean Diouf',
    specialty: 'Dermatologue',
    location: 'Centre Santé cherif',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Dr. Marriane Fall',
    specialty: 'Dentiste',
    location: 'Servante des Pauvres',
    rating: 4.7
  },
  {
    id: 4,
    name: 'Dr. Claire Dupuis',
    specialty: 'Pédiatre',
    location: 'Hôpital de l’Enfance',
    rating: 4.6
  }
];

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="panel booking-panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Réservation</p>
          <h1>Simulateur de prise de rendez-vous</h1>
          <p>Choisissez votre spécialité, sélectionnez un praticien et confirmez le créneau le plus adapté.</p>
        </div>
      </div>

      <div class="booking-grid">
        <div class="booking-form">
          <div class="step-indicator">Étape {{ step() }} / 4</div>

          <div class="control-group">
            <label for="specialty">Spécialité</label>
            <select id="specialty" [value]="selectedSpecialty()" (change)="selectSpecialty($any($event.target).value)">
              <option value="">Sélectionner</option>
              <option *ngFor="let specialty of specialties" [value]="specialty">{{ specialty }}</option>
            </select>
          </div>

          <div class="control-group" *ngIf="selectedSpecialty()">
            <label>Praticiens disponibles</label>
            <div class="doctor-list">
              <button
                *ngFor="let doctor of availableDoctors()"
                type="button"
                class="doctor-choice"
                [class.active]="selectedDoctor() === doctor.id"
                (click)="selectDoctor(doctor.id)">
                <span>{{ doctor.name }}</span>
                <small>{{ doctor.location }} • {{ doctor.rating.toFixed(1) }}/5</small>
              </button>
            </div>
          </div>

          <div class="control-group" *ngIf="selectedDoctor()">
            <label>Choisissez un créneau</label>
            <div class="date-grid">
              <button
                *ngFor="let date of availableDates()"
                type="button"
                class="date-pill"
                [class.active]="selectedDate() === date.iso"
                (click)="selectDate(date.iso)">
                <span>{{ date.weekday }}</span>
                <strong>{{ date.day }}</strong>
                <small>{{ date.month }}</small>
              </button>
            </div>
          </div>

          <div class="control-group" *ngIf="selectedDate()">
            <label for="time">Heure</label>
            <select id="time" [value]="selectedTime()" (change)="selectTime($any($event.target).value)">
              <option value="">Sélectionner</option>
              <option *ngFor="let time of availableTimes()" [value]="time">{{ time }}</option>
            </select>
          </div>

          <div class="control-group" *ngIf="selectedTime()">
            <label for="patientName">Nom du patient</label>
            <input id="patientName" type="text" [value]="patientName()" (input)="patientName.set($any($event.target).value)" placeholder="Nom complet" />
          </div>

          <div class="control-group" *ngIf="selectedTime()">
            <label for="patientPhone">Téléphone</label>
            <input id="patientPhone" type="text" [value]="patientPhone()" (input)="patientPhone.set($any($event.target).value)" placeholder="+221 77 000 00 00" />
          </div>

          <div class="summary-card" *ngIf="canConfirm() && !confirmed()">
            <h2>Récapitulatif</h2>
            <p><strong>Spécialité :</strong> {{ selectedSpecialty() }}</p>
            <p><strong>Praticien :</strong> {{ selectedDoctorObject()?.name }}</p>
            <p><strong>Date :</strong> {{ selectedDate() }}</p>
            <p><strong>Heure :</strong> {{ selectedTime() }}</p>
            <button class="button primary" type="button" [disabled]="isLoading()" (click)="confirmBooking()">
              {{ isLoading() ? 'Confirmation...' : 'Confirmer le rendez-vous' }}
            </button>
          </div>

          <div class="alert success" *ngIf="confirmed()">
            <p class="alert-title">✅ Rendez-vous confirmé !</p>
            <p>Votre rendez-vous avec <strong>{{ selectedDoctorObject()?.name }}</strong> est bien enregistré pour le <strong>{{ selectedDate() }}</strong> à <strong>{{ selectedTime() }}</strong>.</p>
            <p>Un SMS de confirmation a été envoyé sur le numéro lié à votre compte.</p>
            <div class="confirmation-actions">
              <button class="button outline" type="button" (click)="resetBooking()">Prendre un autre RDV</button>
              <button class="button accent" type="button" (click)="goBack()">Retour au dashboard</button>
            </div>
          </div>

          <div class="alert error" *ngIf="errorMessage()">{{ errorMessage() }}</div>
        </div>

        <aside class="booking-preview">
          <div class="preview-card">
            <h2>Votre parcours</h2>
            <ol>
              <li>Sélectionner une spécialité</li>
              <li>Choisir un Médecin</li>
              <li>Fixer une date</li>
              <li>Valider le créneau</li>
            </ol>
            <div class="preview-note">
            </div>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .panel {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 4rem;
    }

    .panel-header {
      margin-bottom: 2rem;
    }

    .eyebrow {
      display: inline-block;
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 3vw, 2.75rem);
      line-height: 1.05;
    }

    .booking-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) minmax(280px, 1fr);
      gap: 2rem;
      align-items: start;
    }

    .booking-form {
      background: white;
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 28px;
      padding: 2rem;
      box-shadow: 0 20px 55px rgba(15, 23, 42, 0.05);
    }

    .step-indicator {
      color: #0f172a;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    .control-group {
      display: grid;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    label {
      font-weight: 700;
      color: #0f172a;
    }

    select,
    input[type='date'] {
      width: 100%;
      padding: 0.95rem 1rem;
      border-radius: 16px;
      border: 1px solid rgba(148, 163, 184, 0.35);
      font-size: 1rem;
      color: #0f172a;
      background: #f8fafc;
    }

    .doctor-list {
      display: grid;
      gap: 0.9rem;
    }

    .date-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .date-pill {
      border-radius: 18px;
      border: 1px solid rgba(148, 163, 184, 0.25);
      background: #f8fafc;
      padding: 1rem;
      display: grid;
      gap: 0.4rem;
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }

    .date-pill:hover,
    .date-pill.active {
      transform: translateY(-1px);
      border-color: #2563eb;
      background: #eff6ff;
    }

    .date-pill span {
      font-size: 0.78rem;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .date-pill strong {
      font-size: 1.25rem;
      color: #0f172a;
    }

    .date-pill small {
      color: #475569;
    }

    @media (max-width: 720px) {
      .date-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .doctor-choice {
      display: grid;
      gap: 0.25rem;
      padding: 1rem 1.25rem;
      border-radius: 18px;
      border: 1px solid rgba(148, 163, 184, 0.25);
      background: #f8fafc;
      color: #0f172a;
      text-align: left;
      font-size: 0.98rem;
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }

    .doctor-choice:hover,
    .doctor-choice.active {
      transform: translateX(2px);
      border-color: #2563eb;
      background: #eff6ff;
    }

    .doctor-choice small {
      color: #475569;
      font-size: 0.92rem;
    }

    .summary-card,
    .preview-card {
      border-radius: 24px;
      border: 1px solid rgba(148, 163, 184, 0.14);
      background: white;
      padding: 1.75rem;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
    }

    .summary-card h2,
    .preview-card h2 {
      margin-top: 0;
      font-size: 1.3rem;
      color: #0f172a;
    }

    .summary-card p {
      margin: 0.75rem 0;
      color: #334155;
      line-height: 1.7;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 1.25rem;
      padding: 0.95rem 1.4rem;
      border-radius: 999px;
      color: white;
      background: #2563eb;
      border: none;
      cursor: pointer;
      font-weight: 700;
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .button:hover {
      transform: translateY(-1px);
    }

    .button.outline {
      background: transparent;
      color: #2563eb;
      border: 1px solid rgba(37, 99, 235, 0.35);
    }

    .preview-note {
      margin-top: 1.5rem;
      color: #475569;
      line-height: 1.75;
    }

    .alert.success {
      margin-top: 1.5rem;
      padding: 1rem 1.25rem;
      border-radius: 18px;
      background: #ecfdf5;
      color: #166534;
      border: 1px solid #a7f3d0;
      font-weight: 700;
    }

    .alert.error {
      margin-top: 1.5rem;
      padding: 1rem 1.25rem;
      border-radius: 18px;
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fecaca;
      font-weight: 700;
    }

    .alert-title {
      margin: 0 0 0.65rem;
      font-size: 1.05rem;
    }

    .confirmation-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    @media (max-width: 900px) {
      .booking-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookingComponent {
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);

  protected readonly specialties = ['Généraliste', 'Dermatologue', 'Dentiste', 'Pédiatre'];
  protected readonly selectedSpecialty = signal('');
  protected readonly selectedDoctor = signal<number | null>(null);
  protected readonly selectedDate = signal('');
  protected readonly selectedTime = signal('');
  protected readonly step = signal(1);
  protected readonly confirmed = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly patientId = signal<number | null>(null);
  protected readonly patientName = signal('');
  protected readonly patientPhone = signal('');

  protected readonly availableDoctors = computed(() => {
    const specialty = this.selectedSpecialty();
    return doctors.filter((doctor) => doctor.specialty === specialty);
  });

  protected readonly selectedDoctorObject = computed(() =>
    doctors.find((doctor) => doctor.id === this.selectedDoctor())
  );

  protected readonly availableDates = computed(() => {
    const dates = [] as Array<{ iso: string; weekday: string; day: string; month: string }>;
    const today = new Date();

    for (let offset = 0; offset < 14; offset += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const iso = date.toISOString().slice(0, 10);
      const weekday = date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
      const day = date.toLocaleDateString('fr-FR', { day: '2-digit' });
      const month = date.toLocaleDateString('fr-FR', { month: 'short' });

      dates.push({ iso, weekday, day, month });
    }

    return dates;
  });

  protected readonly availableTimes = computed(() => {
    if (!this.selectedDoctor()) {
      return [];
    }
    return ['09:00', '09:30', '10:30', '11:15', '14:00'];
  });

  protected selectSpecialty(value: string) {
    this.selectedSpecialty.set(value);
    this.selectedDoctor.set(null);
    this.selectedDate.set('');
    this.selectedTime.set('');
    this.step.set(value ? 2 : 1);
    this.confirmed.set(false);
    this.errorMessage.set('');
  }

  protected selectDoctor(id: number) {
    this.selectedDoctor.set(id);
    this.selectedDate.set('');
    this.selectedTime.set('');
    this.step.set(3);
    this.confirmed.set(false);
    this.errorMessage.set('');
  }

  protected selectDate(value: string) {
    this.selectedDate.set(value);
    if (value) {
      this.step.set(4);
    }
    this.selectedTime.set('');
    this.confirmed.set(false);
  }

  protected selectTime(value: string) {
    this.selectedTime.set(value);
    this.confirmed.set(false);
    this.errorMessage.set('');
  }

  protected canConfirm() {
    return !!this.selectedSpecialty() && !!this.selectedDoctor() && !!this.selectedDate() && !!this.selectedTime() && (!!this.patientId() || !!this.patientName());
  }

  protected async confirmBooking() {
    if (!this.canConfirm()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      let pid = this.patientId();

      if (!pid) {
        const resp = await this.api.createPatient({
          name: this.patientName(),
          phone: this.patientPhone() || null,
        });
        pid = resp?.data?.id ?? null;
        this.patientId.set(pid);
      }

      if (!pid) {
        throw new Error('Impossible de créer le patient');
      }

      await this.api.createAppointment({
        patient_id: pid,
        doctor_id: this.selectedDoctor()!,
        scheduled_at: `${this.selectedDate()} ${this.selectedTime()}`,
        reason: `${this.selectedSpecialty()} consultation`,
      });

      this.confirmed.set(true);
    } catch (_error) {
      this.errorMessage.set('Impossible de confirmer le rendez-vous. Réessayez plus tard.');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected resetBooking() {
    this.selectedSpecialty.set('');
    this.selectedDoctor.set(null);
    this.selectedDate.set('');
    this.selectedTime.set('');
    this.step.set(1);
    this.confirmed.set(false);
    this.errorMessage.set('');
  }

  protected goBack() {
    this.router.navigate(['/dashboard']);
  }
}
