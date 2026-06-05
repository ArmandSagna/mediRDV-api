import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';

export interface PatientProfile {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  status: string;
  lastVisit: string;
  age: number;
  assignedDoctor: string;
  nextAppointment: string;
  notes: string;
}

const doctorNames = ['Dr. Moustapha Diouf', 'Dr. Jean Diouf', 'Dr. Marriane Fall', 'Dr. Fatou Ndiaye'];

@Injectable({ providedIn: 'root' })
export class PatientService {
  readonly patients = signal<PatientProfile[]>([]);

  constructor(private api: ApiService) {}

  async loadPatients(): Promise<void> {
    try {
      const response = await this.api.getPatients();
      this.patients.set(response.data.map((patient: any) => this.mapPatient(patient)));
    } catch {
      // ignore failures and keep local state empty
      this.patients.set([]);
    }
  }

  getPatient(id: number): PatientProfile | undefined {
    return this.patients().find(patient => patient.id === id);
  }

  async createPatient(payload: { name: string; email?: string | null; phone?: string | null; location?: string | null; status?: string | null; last_visit?: string | null }): Promise<void> {
    const response = await this.api.createPatient(payload);
    this.patients.set([...this.patients(), this.mapPatient(response.data)]);
  }

  async updatePatient(id: number, payload: { name?: string; email?: string | null; phone?: string | null; location?: string | null; status?: string | null; last_visit?: string | null }): Promise<PatientProfile | undefined> {
    const response = await this.api.updatePatient(id, payload);
    const updated = this.mapPatient(response.data);
    this.patients.set(this.patients().map(patient => patient.id === id ? updated : patient));
    return this.getPatient(id);
  }

  async deletePatient(id: number): Promise<void> {
    await this.api.deletePatient(id);
    this.patients.set(this.patients().filter(patient => patient.id !== id));
  }

  private mapPatient(data: any): PatientProfile {
    const lastVisit = this.formatDate(data.last_visit);
    return {
      id: data.id,
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      location: data.location ?? 'N/A',
      status: data.status ?? 'Actif',
      lastVisit: lastVisit || 'Dates à définir',
      age: this.estimateAge(data.id),
      assignedDoctor: doctorNames[data.id % doctorNames.length],
      nextAppointment: this.nextAppointmentFromLastVisit(lastVisit),
      notes: this.buildNotes(data.status ?? 'Actif')
    };
  }

  private formatDate(dateValue: string | null): string {
    if (!dateValue) {
      return '';
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  private estimateAge(id: number): number {
    return 30 + (id % 5) * 4;
  }

  private nextAppointmentFromLastVisit(lastVisit: string): string {
    if (!lastVisit) {
      return 'En attente';
    }

    return 'À planifier';
  }

  private buildNotes(status: string): string {
    if (status === 'À vérifier') {
      return 'Le dossier nécessite un suivi supplémentaire. Contacter le patient pour confirmation.';
    }

    return 'Suivi régulier : le patient est en bonne voie et le prochain rendez-vous peut être planifié rapidement.';
  }
}
