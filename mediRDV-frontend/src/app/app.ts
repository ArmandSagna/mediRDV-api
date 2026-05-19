import { Component, signal } from '@angular/core';
import { NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { filter } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgIf, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('mediRDV');
  protected readonly currentUrl = signal('');
  protected readonly theme = signal<'dark' | 'light'>(this.readTheme());

  constructor(router: Router, protected readonly auth: AuthService) {
    this.currentUrl.set(router.url);
    this.setTheme(this.theme());

    router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  private readTheme(): 'dark' | 'light' {
    const saved = localStorage.getItem('theme');
    return saved === 'light' ? 'light' : 'dark';
  }

  protected toggleTheme() {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    localStorage.setItem('theme', nextTheme);
    this.setTheme(nextTheme);
  }

  private setTheme(theme: 'dark' | 'light') {
    document.documentElement.setAttribute('data-theme', theme);
  }

  protected isLoginPage() {
    return this.currentUrl() === '/login';
  }
}
