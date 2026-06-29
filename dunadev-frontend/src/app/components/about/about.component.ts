import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="about-page">
      <div class="container">
        <header class="page-header">
          <span class="eyebrow">About</span>
          <h1>Budapest's Tech Event Calendar</h1>
          <p class="lead">
            DunaDev is a community-driven calendar that aggregates tech meetups, workshops, and
            conferences happening in and around Budapest, Hungary.
          </p>
        </header>

        <div class="about-grid">
          <div class="about-card">
            <div class="about-card-icon mission-icon"></div>
            <h3>Our Mission</h3>
            <p>
              To make it effortless for developers, designers, and tech enthusiasts to discover
              local events, connect with the community, and never miss a great meetup.
            </p>
          </div>
          <div class="about-card">
            <div class="about-card-icon community-icon"></div>
            <h3>For the Community</h3>
            <p>
              Events are submitted and managed by verified organisers. Every listing is curated
              to keep the calendar relevant, accurate, and up to date.
            </p>
          </div>
          <div class="about-card">
            <div class="about-card-icon organiser-icon"></div>
            <h3>Are You an Organiser?</h3>
            <p>
              If you run tech events in Budapest and would like to list them here, get in touch.
              Organiser accounts are invitation-only to maintain quality.
            </p>
            <a routerLink="/contact" class="btn btn-secondary btn-sm">Get in touch</a>
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
