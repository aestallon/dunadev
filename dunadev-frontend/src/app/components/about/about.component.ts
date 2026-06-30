import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="about-page">
      <div class="container">
        <header class="page-header">
          <span class="eyebrow">{{ 'about.eyebrow' | translate }}</span>
          <h1>{{ 'about.title' | translate }}</h1>
          <p class="lead">{{ 'about.lead' | translate }}</p>
        </header>

        <div class="about-grid">
          <div class="about-card">
            <div class="about-card-icon mission-icon"></div>
            <h3>{{ 'about.mission.title' | translate }}</h3>
            <p>{{ 'about.mission.body' | translate }}</p>
          </div>
          <div class="about-card">
            <div class="about-card-icon community-icon"></div>
            <h3>{{ 'about.community.title' | translate }}</h3>
            <p>{{ 'about.community.body' | translate }}</p>
          </div>
          <div class="about-card">
            <div class="about-card-icon organiser-icon"></div>
            <h3>{{ 'about.organiser.title' | translate }}</h3>
            <p>{{ 'about.organiser.body' | translate }}</p>
            <a routerLink="/contact" class="btn btn-secondary btn-sm">
              {{ 'about.organiser.cta' | translate }}
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .about-page {
      padding: 5rem 0 6rem;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .page-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    .eyebrow {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary);
      margin-bottom: 1rem;
    }
    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 1.25rem;
      line-height: 1.15;
    }
    .lead {
      font-size: 1.125rem;
      color: var(--text-muted);
      line-height: 1.7;
      max-width: 640px;
      margin: 0 auto;
    }
    .about-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }
    .about-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 2rem;
    }
    .about-card-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      margin-bottom: 1.25rem;
    }
    .mission-icon { background: linear-gradient(135deg, #dbeafe, #bfdbfe); }
    .community-icon { background: linear-gradient(135deg, #d1fae5, #a7f3d0); }
    .organiser-icon { background: linear-gradient(135deg, #fef3c7, #fde68a); }
    .about-card h3 {
      font-size: 1.0625rem;
      margin-bottom: 0.625rem;
    }
    .about-card p {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 1.25rem;
    }
    .about-card p:last-child { margin-bottom: 0; }
    .btn-sm { padding: 0.4375rem 1rem; font-size: 0.875rem; }
  `,
})
export class AboutComponent {}
