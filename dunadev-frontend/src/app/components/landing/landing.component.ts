import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-page">
      <header class="hero">
        <div class="hero-content">
          <h1>Discover Budapest's <span class="text-gradient">Tech Community</span></h1>
          <p>Join local meetups, workshops, and conferences. Stay connected with fellow developers in the heart of Hungary.</p>
          <div class="hero-actions">
            <a routerLink="/calendar" class="btn btn-primary">Browse Calendar</a>
            <button class="btn btn-secondary" (click)="requestInvitation()">Organise an Event</button>
          </div>
        </div>
      </header>

      <div class="container">
        <section class="upcoming-section">
          <div class="section-header">
            <h2>Upcoming Events</h2>
            <a routerLink="/calendar" class="view-all-link">View all events →</a>
          </div>

          <div class="event-grid">
            @for (event of eventService.upcomingEvents(); track event.id) {
              <div class="event-card">
                <div class="event-card-header">
                  <span class="event-badge">Upcoming</span>
                  <span class="event-date">{{ event.date | date: 'MMM d, y' }}</span>
                </div>
                <h3>{{ event.title }}</h3>
                <div class="event-info">
                  <div class="info-item">
                    <span class="icon">📍</span>
                    <span>{{ event.location.name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="icon">🕒</span>
                    <span>{{ event.date | date: 'HH:mm' }}</span>
                  </div>
                </div>
                <div class="event-description">
                  @if (event.description.en) {
                    <p>{{ event.description.en }}</p>
                  } @else if (event.description.hu) {
                    <p>{{ event.description.hu }}</p>
                  }
                </div>
                <div class="event-footer">
                  <a [href]="event.externalLink" target="_blank" class="btn btn-primary btn-sm full-width">View Details</a>
                </div>
              </div>
            } @empty {
              <div class="empty-state">
                <p>No upcoming events at the moment. Check back later!</p>
              </div>
            }
          </div>
        </section>

        <section class="cta-banner">
          <div class="cta-content">
            <h2>Are you an organiser?</h2>
            <p>Get access to our management tools and share your events with the DunaDev community.</p>
            <button class="btn btn-primary" (click)="requestInvitation()">Request an invitation</button>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: `
    .landing-page {
      padding-bottom: 5rem;
    }
    .hero {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      padding: 6rem 1.5rem;
      text-align: center;
      margin-bottom: 4rem;
    }
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    .hero h1 {
      font-size: 3.5rem;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      color: #0f172a;
    }
    .text-gradient {
      background: linear-gradient(to right, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p {
      font-size: 1.25rem;
      color: var(--text-muted);
      margin-bottom: 2.5rem;
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;
    }
    .view-all-link {
      font-weight: 600;
      font-size: 0.875rem;
    }
    .event-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      margin-bottom: 5rem;
    }
    .event-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      transition: var(--transition);
      box-shadow: var(--shadow-sm);
    }
    .event-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }
    .event-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .event-badge {
      background: rgba(37, 99, 235, 0.1);
      color: var(--primary);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .event-date {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .event-card h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      line-height: 1.3;
    }
    .event-info {
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .event-description {
      font-size: 0.9375rem;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
      flex-grow: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .full-width { width: 100%; }
    .btn-sm { padding: 0.5rem 1rem; }
    .cta-banner {
      background: #1e293b;
      color: white;
      padding: 4rem;
      border-radius: 24px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .cta-banner::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle at top right, rgba(37, 99, 235, 0.2), transparent);
    }
    .cta-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
    .cta-banner h2 { color: white; font-size: 2.25rem; margin-bottom: 1rem; }
    .cta-banner p { color: #94a3b8; font-size: 1.125rem; margin-bottom: 2rem; }
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem;
      background: white;
      border-radius: var(--radius);
      border: 2px dashed var(--border);
      color: var(--text-muted);
    }
  `
})
export class LandingComponent {
  protected readonly eventService = inject(EventService);

  requestInvitation() {
    alert('Invitation request sent! We will get back to you soon.');
  }
}
