import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Login page component
 * - improved UX: centered card, input validation, loading state
 * - remembers username when `rememberMe` is enabled
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="login-root">
      <section class="login-card card">
        <header class="login-header">
          <div class="brand-badge-lg">M</div>
          <div>
            <h1>Connexion</h1>
            <p>Connectez-vous pour accéder au tableau de bord</p>
          </div>
        </header>

        <form #f="ngForm" (ngSubmit)="onSubmit(f)">
          <label>
            Nom d'utilisateur
            <input name="username" [(ngModel)]="username" required maxlength="80" autofocus />
          </label>

          <label>
            Mot de passe
            <input name="password" type="password" [(ngModel)]="password" required />
          </label>

          <div class="login-actions">
            <label class="remember">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" /> Se souvenir
            </label>

            <div class="buttons">
              <button class="button" type="button" (click)="fillDemo()">Compte demo</button>
              <button class="button accent" type="submit" [disabled]="loading || f.invalid">
                <span *ngIf="!loading">Se connecter</span>
                <span *ngIf="loading">Connexion...</span>
              </button>
            </div>
          </div>

          <p *ngIf="error" class="error">{{ error }}</p>
        </form>
      </section>
    </main>
  `,
  styles: [
    `
    .login-root { display:flex; align-items:center; justify-content:center; min-height:calc(100vh - 64px); padding:2rem; }
    .login-card { width:100%; max-width:460px; padding:1.5rem; border-radius:16px; }
    .login-header { display:flex; gap:1rem; align-items:center; margin-bottom:1rem; }
    .brand-badge-lg { width:48px; height:48px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:var(--button-bg); color:var(--button-text); font-weight:800; font-size:1.15rem; }
    h1 { margin:0 0 0.25rem 0; font-size:1.6rem; }
    p { margin:0; color:var(--subtext); }
    label { display:block; margin-top:0.9rem; color:var(--subtext); }
    input { width:100%; padding:0.6rem; border-radius:8px; border:1px solid var(--border); background:var(--surface); color:var(--text); margin-top:0.35rem; }
    .login-actions { display:flex; align-items:center; justify-content:space-between; margin-top:1rem; }
    .remember { display:flex; align-items:center; gap:0.4rem; color:var(--subtext); }
    .buttons { display:flex; gap:0.5rem; }
    .button { padding:0.6rem 1rem; border-radius:999px; border:none; cursor:pointer; }
    .button.accent { background:var(--button-bg); color:var(--button-text); }
    .error { color:#fecaca; margin-top:0.75rem; }
    @media (max-width:520px) { .login-card { padding:1rem; } }
    `
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  rememberMe = false;
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {
    // If already authenticated, redirect to dashboard
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    // Load remembered username if present
    const remembered = localStorage.getItem('remember_username');
    if (remembered) {
      this.username = remembered;
      this.rememberMe = true;
    }
  }

  // Handle form submit; use the injected AuthService
  async onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.error = '';
    this.loading = true;

    try {
      const ok = await this.auth.login(this.username.trim(), this.password);
      if (ok) {
        // Save remembered username when requested
        if (this.rememberMe) {
          localStorage.setItem('remember_username', this.username.trim());
        } else {
          localStorage.removeItem('remember_username');
        }
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Identifiants invalides';
      }
    } catch (err) {
      this.error = 'Erreur lors de la connexion';
    } finally {
      this.loading = false;
    }
  }

  // Fill demo credentials for local testing
  fillDemo() {
    this.username = 'admin';
    this.password = 'password';
  }
}
