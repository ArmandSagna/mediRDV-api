import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const API_BASE = '/api';

export interface DashboardApiResponse {
  success: boolean;
  data: {
    users_count: number;
    doctors_count: number | null;
    appointments_count: number | null;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  getDashboard() {
    return firstValueFrom(this.http.get<DashboardApiResponse>(`${API_BASE}/dashboard`));
  }

  getDoctors() {
    return firstValueFrom(this.http.get<{ success: boolean; data: any[] }>(`${API_BASE}/doctors`));
  }

  getAppointments() {
    return firstValueFrom(this.http.get<{ success: boolean; data: any[] }>(`${API_BASE}/appointments`));
  }

  getPatients() {
    return firstValueFrom(this.http.get<{ success: boolean; data: any[] }>(`${API_BASE}/patients`));
  }

  getPatient(id: number) {
    return firstValueFrom(this.http.get<{ success: boolean; data: any }>(`${API_BASE}/patients/${id}`));
  }

  createPatient(payload: { name: string; email?: string | null; phone?: string | null; location?: string | null; status?: string | null; last_visit?: string | null }) {
    return firstValueFrom(this.http.post<{ success: boolean; data: any }>(`${API_BASE}/patients`, payload));
  }

  updatePatient(id: number, payload: { name?: string; email?: string | null; phone?: string | null; location?: string | null; status?: string | null; last_visit?: string | null }) {
    return firstValueFrom(this.http.put<{ success: boolean; data: any }>(`${API_BASE}/patients/${id}`, payload));
  }

  deletePatient(id: number) {
    return firstValueFrom(this.http.delete<{ success: boolean; data: any }>(`${API_BASE}/patients/${id}`));
  }

  getDoctor(id: number) {
    return firstValueFrom(this.http.get<{ success: boolean; data: any }>(`${API_BASE}/doctors/${id}`));
  }

  createDoctor(payload: { name: string; specialty: string; location: string; rating?: number; status?: string }) {
    return firstValueFrom(this.http.post<{ success: boolean; data: any }>(`${API_BASE}/doctors`, payload));
  }

  updateDoctor(id: number, payload: { name?: string; specialty?: string; location?: string; rating?: number; status?: string }) {
    return firstValueFrom(this.http.put<{ success: boolean; data: any }>(`${API_BASE}/doctors/${id}`, payload));
  }

  deleteDoctor(id: number) {
    return firstValueFrom(this.http.delete<{ success: boolean; data: any }>(`${API_BASE}/doctors/${id}`));
  }

  createAppointment(payload: { patient_id: number; doctor_id: number; scheduled_at: string; reason?: string }) {
    return firstValueFrom(this.http.post<{ success: boolean; data: any }>(`${API_BASE}/appointments`, payload));
  }
}
