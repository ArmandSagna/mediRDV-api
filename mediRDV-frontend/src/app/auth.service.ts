import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authState = signal<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient, private router: Router) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  async login(username: string, password: string): Promise<boolean> {
    // Attempt real API login; fall back to mock if API not available.
    try {
      const res = await lastValueFrom(this.http.post<{ token: string }>('/api/login', { username, password }));
      if (res && res.token) {
        localStorage.setItem('auth_token', res.token);
        this.authState.set(true);
        return true;
      }
    } catch (err) {
      // fallback mock for local/dev: replace with real backend in production
      if (username === 'admin' && password === 'password') {
        localStorage.setItem('auth_token', 'mock-token');
        this.authState.set(true);
        return true;
      }
      return false;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.authState.set(false);
    this.router.navigate(['/login']);
  }
}
