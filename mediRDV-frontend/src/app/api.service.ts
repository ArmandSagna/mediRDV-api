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

  createPatient(payload: { name: string; email?: string | null; phone?: string | null }) {
    return firstValueFrom(this.http.post<{ success: boolean; data: any }>(`${API_BASE}/patients`, payload));
  }

  createAppointment(payload: { patient_id: number; doctor_id: number; scheduled_at: string; reason?: string }) {
    return firstValueFrom(this.http.post<{ success: boolean; data: any }>(`${API_BASE}/appointments`, payload));
  }
}
