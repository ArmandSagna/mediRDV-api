import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Plateforme médicale</span>
        <h1>Réservez votre rendez-vous médical en quelques clics.</h1>
        <p>
          Trouvez un medecin, choisissez une date et confirmez votre consultation en toute confiance.
          Un parcours clair, une gestion des disponibilités et un aperçu du dossier patient.
        </p>
        <div class="hero-actions">
          <a routerLink="/booking" class="button primary">Commencer</a>
          <a routerLink="/doctors" class="button secondary">Voir les médecins</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="card-preview">
          <div class="card-title">Rendez-vous rapide</div>
          <div class="card-row">
            <span>Patient :</span>
            <strong>Armand Sagna</strong>
          </div>
          <div class="card-row">
            <span>Spécialité :</span>
            <strong>Généraliste</strong>
          </div>
          <div class="card-row">
            <span>Date :</span>
            <strong>26 mai, 10h30</strong>
          </div>
          <div class="card-status">Confirmation en cours</div>
        </div>
      </div>
    </section>

    <section class="features">
      <article>
        <h2>Une prise en main fluide</h2>
        <p>Suivez un parcours pas à pas pour réserver un rendez-vous, visualiser les disponibilités et confirmer votre consultation.</p>
      </article>
      <article>
        <h2>Des profils de praticiens clairs</h2>
        <p>Consultez les spécialités, avis et temps d’attente pour choisir le praticien adapté.</p>
      </article>
      <article>
        <h2>Gestion des utilisateurs</h2>
        <p>Un espace patient sécurisé, une interface administrateur et un historique de rendez-vous.</p>
      </article>
    </section>
  `,
  styles: [`
    .hero {
      display: grid;
      gap: 2rem;
      padding: 3rem 1.5rem;
      max-width: 1080px;
      margin: 0 auto;
      align-items: center;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    }

    .eyebrow {
      color: #2563eb;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-size: 0.85rem;
      display: inline-block;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: clamp(2.5rem, 4vw, 4.25rem);
      line-height: 1.05;
      margin: 0;
      max-width: 42rem;
    }

    p {
      color: #475569;
      max-width: 40rem;
      font-size: 1.05rem;
      line-height: 1.8;
      margin: 1.5rem 0;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.95rem 1.5rem;
      border-radius: 999px;
      font-weight: 700;
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .button:hover {
      transform: translateY(-1px);
      box-shadow: 0 18px 35px rgba(15, 23, 42, 0.08);
    }

    .button.primary {
      background: #2563eb;
      color: white;
    }

    .button.secondary {
      background: white;
      color: #0f172a;
      border: 1px solid #cbd5e1;
    }

    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .card-preview {
      width: min(420px, 100%);
      background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 35%), white;
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 28px;
      padding: 2rem;
      box-shadow: 0 24px 80px rgba(15, 23, 42, 0.08);
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      margin-bottom: 1.5rem;
    }

    .card-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
      color: #334155;
      font-size: 0.98rem;
    }

    .card-row strong {
      color: #0f172a;
    }

    .card-status {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 18px;
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 700;
    }

    .features {
      display: grid;
      gap: 1.5rem;
      padding: 0 1.5rem 3rem;
      max-width: 1080px;
      margin: 0 auto;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .features article {
      background: white;
      border-radius: 24px;
      border: 1px solid rgba(148, 163, 184, 0.18);
      padding: 1.75rem;
      box-shadow: 0 12px 40px rgba(15, 23, 42, 0.04);
    }

    .features h2 {
      margin: 0 0 1rem;
      font-size: 1.25rem;
      color: #0f172a;
    }

    .features p {
      margin: 0;
      color: #475569;
      line-height: 1.7;
    }

    @media (max-width: 940px) {
      .hero {
        grid-template-columns: 1fr;
      }

      .features {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {}
