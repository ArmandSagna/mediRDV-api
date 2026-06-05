import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';

export interface DoctorProfile {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  nextAvailable: string;
  experience: string;
  patientsCount: number;
  bio: string;
  status: string;
}

const initialDoctors: DoctorProfile[] = [
  {
    id: 1,
    name: 'Dr. Moustapha Diouf',
    specialty: 'Médecin Généraliste',
    location: 'Clinique du Parc',
    rating: 4.8,
    nextAvailable: '26 mai • 10h30',
    experience: '15 ans',
    patientsCount: 860,
    bio: 'Spécialiste des consultations de médecine générale, suivi préventif et gestion des pathologies chroniques.',
    status: 'available'
  },
  {
    id: 2,
    name: 'Dr. Jean Diouf',
    specialty: 'Dermatologue',
    location: 'Centre Santé cherif',
    rating: 4.9,
    nextAvailable: '27 mai • 14h00',
    experience: '12 ans',
    patientsCount: 720,
    bio: 'Expert en soins de la peau, traitement des maladies dermatologiques et consultations esthétiques.',
    status: 'available'
  },
  {
    id: 3,
    name: 'Dr. Marriane Fall',
    specialty: 'Dentiste',
    location: 'Cabinet Dentaire Montaigne',
    rating: 4.7,
    nextAvailable: '26 mai • 09h00',
    experience: '11 ans',
    patientsCount: 540,
    bio: 'Dentiste expérimentée en soins conservateurs, implants et traitements esthétiques du sourire.',
    status: 'available'
  }
];

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private api = inject(ApiService);
  private nextId = initialDoctors.length + 1;
  readonly doctors = signal<DoctorProfile[]>(initialDoctors);

  get specialties(): string[] {
    return Array.from(new Set(this.doctors().map(d => d.specialty)));
  }

  getDoctor(id: number): DoctorProfile | undefined {
    return this.doctors().find(d => d.id === id);
  }

  async loadDoctors(): Promise<void> {
    try {
      const response = await this.api.getDoctors();
      this.doctors.set(response.data.map(d => this.mapDoctor(d)));
    } catch {
      // keep fallback data when API is unavailable
    }
  }

  async addDoctor(input: {
    name: string;
    specialty: string;
    location: string;
    experience: string;
  }): Promise<void> {
    const payload = {
      name: input.name,
      specialty: input.specialty,
      location: input.location,
      rating: 4.5,
      status: 'available'
    };

    try {
      const response = await this.api.createDoctor(payload);
      const doctor = this.mapDoctor(response.data, input.experience);
      this.doctors.set([...this.doctors(), doctor]);
    } catch {
      const doctor: DoctorProfile = {
        id: this.nextId++,
        name: input.name,
        specialty: input.specialty,
        location: input.location,
        rating: 4.5,
        nextAvailable: this.getNextAvailableSlot(),
        experience: input.experience || '0 ans',
        patientsCount: 0,
        bio: 'Nouveau médecin ajouté au répertoire, disponible pour prise de rendez-vous.',
        status: 'available'
      };
      this.doctors.set([...this.doctors(), doctor]);
    }
  }

  async updateDoctor(id: number, updates: Partial<DoctorProfile>): Promise<DoctorProfile | undefined> {
    const payload: Record<string, any> = {};
    if (updates.name) payload['name'] = updates.name;
    if (updates.specialty) payload['specialty'] = updates.specialty;
    if (updates.location) payload['location'] = updates.location;
    if (typeof updates.rating === 'number') payload['rating'] = updates.rating;
    if (updates.status) payload['status'] = updates.status;

    try {
      const response = await this.api.updateDoctor(id, payload);
      const doctor = this.mapDoctor(response.data, updates.experience);
      this.doctors.set(this.doctors().map(d => d.id === id ? { ...d, ...doctor } : d));
      return this.getDoctor(id);
    } catch {
      const existing = this.getDoctor(id);
      if (!existing) return undefined;
      const updated = { ...existing, ...updates };
      this.doctors.set(this.doctors().map(d => d.id === id ? updated : d));
      return updated;
    }
  }

  async deleteDoctor(id: number): Promise<void> {
    try {
      await this.api.deleteDoctor(id);
    } catch {
      // ignore API failures and remove locally anyway
    }
    this.doctors.set(this.doctors().filter(d => d.id !== id));
  }

  private mapDoctor(data: any, experienceOverride?: string): DoctorProfile {
    const experience = experienceOverride ?? data.experience ?? `${10 + (data.id || 0)} ans`;
    const nextAvailable = data.nextAvailable ?? this.getNextAvailableSlot();
    const patientsCount = data.patientsCount ?? Math.max(0, (data.id || 0) * 20);

    return {
      id: data.id,
      name: data.name,
      specialty: data.specialty,
      location: data.location,
      rating: parseFloat(data.rating) || 4.5,
      status: data.status || 'available',
      nextAvailable,
      experience,
      patientsCount,
      bio: data.bio ?? 'Disponible pour consultation et suivi personnalisé.'
    };
  }

  private monthNames: Record<string, string> = {
    janvier: '01',
    février: '02',
    fevrier: '02',
    mars: '03',
    avril: '04',
    mai: '05',
    juin: '06',
    juillet: '07',
    août: '08',
    aout: '08',
    septembre: '09',
    octobre: '10',
    novembre: '11',
    décembre: '12',
    decembre: '12'
  };

  private parseFrenchSlot(slot: string): Date | null {
    const match = slot.match(/(\d{1,2}) (\w+) • (\d{1,2})h(\d{2})/);
    if (!match) {
      return null;
    }

    const [, day, monthName, hour, minute] = match;
    const month = this.monthNames[monthName.toLowerCase()];
    if (!month) {
      return null;
    }

    const year = new Date().getFullYear();
    const date = new Date(`${year}-${month}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute}:00`);
    return isNaN(date.getTime()) ? null : date;
  }

  private formatFrenchSlot(date: Date): string {
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} • ${hours}h${minutes}`;
  }

  private getNextAvailableSlot(): string {
    const slots = this.doctors()
      .map(d => this.parseFrenchSlot(d.nextAvailable))
      .filter((date): date is Date => date instanceof Date);

    if (!slots.length) {
      return 'À définir';
    }

    const latest = slots.reduce((max, current) => (current.getTime() > max.getTime() ? current : max));
    latest.setDate(latest.getDate() + 1);
    latest.setHours(9, 0, 0, 0);

    return this.formatFrenchSlot(latest);
  }
}
