import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calendar-page container">
      <header class="page-header">
        <h1>Event Calendar</h1>
        <p>Explore all upcoming and past meetups in the city.</p>
      </header>

      <div class="calendar-layout">
        <aside class="filters-sidebar">
          <div class="filter-card">
            <h3>Filters</h3>
            <div class="filter-group">
              <label>Month</label>
              <select [(ngModel)]="selectedMonth">
                @for (month of months; track month.value) {
                  <option [value]="month.value">{{ month.name }}</option>
                }
              </select>
            </div>
            <div class="filter-group">
              <label>Year</label>
              <input type="number" [(ngModel)]="selectedYear" />
            </div>
            <div class="filter-info">
              <p>Showing events for {{ months[selectedMonth()].name }} {{ selectedYear() }}</p>
            </div>
          </div>
        </aside>

        <main class="events-main">
          <div class="event-timeline">
            @for (event of filteredEvents(); track event.id) {
              <div class="timeline-item">
                <div class="timeline-date">
                  <span class="day">{{ event.date | date: 'd' }}</span>
                  <span class="month">{{ event.date | date: 'MMM' }}</span>
                </div>
                <div class="timeline-content">
                  <div class="event-meta">
                    <span class="time">🕒 {{ event.date | date: 'HH:mm' }}</span>
                    <span class="location">📍 {{ event.location.name }}</span>
                  </div>
                  <h3>{{ event.title }}</h3>
                  <div class="event-actions">
                    <a [href]="event.externalLink" target="_blank" class="link-btn">View Event Details →</a>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="empty-state">
                <div class="empty-icon">📅</div>
                <p>No events found for the selected timeframe.</p>
                <button class="btn btn-secondary btn-sm" (click)="resetFilters()">Reset to Today</button>
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .calendar-page {
      padding-top: 4rem;
      padding-bottom: 6rem;
    }
    .page-header {
      margin-bottom: 3rem;
    }
    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .page-header p {
      color: var(--text-muted);
      font-size: 1.125rem;
    }
    .calendar-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 3rem;
    }
    @media (max-width: 992px) {
      .calendar-layout {
        grid-template-columns: 1fr;
      }
    }
    .filters-sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }
    .filter-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
    }
    .filter-card h3 {
      font-size: 1.125rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }
    .filter-group {
      margin-bottom: 1.25rem;
    }
    .filter-info {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      font-size: 0.875rem;
      color: var(--text-muted);
      font-style: italic;
    }
    .event-timeline {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .timeline-item {
      display: flex;
      gap: 2rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      transition: var(--transition);
    }
    .timeline-item:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow);
    }
    .timeline-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      border-radius: 12px;
      min-width: 80px;
      height: 80px;
      border: 1px solid var(--border);
    }
    .timeline-date .day {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--primary);
      line-height: 1;
    }
    .timeline-date .month {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }
    .timeline-content {
      flex-grow: 1;
    }
    .event-meta {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .timeline-content h3 {
      font-size: 1.375rem;
      margin-bottom: 1rem;
    }
    .link-btn {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--primary);
    }
    .link-btn:hover {
      text-decoration: underline;
    }
    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
      background: white;
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .empty-state p {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }
  `
})
export class CalendarComponent {
  private readonly eventService = inject(EventService);

  readonly months = [
    { name: 'January', value: 0 }, { name: 'February', value: 1 },
    { name: 'March', value: 2 }, { name: 'April', value: 3 },
    { name: 'May', value: 4 }, { name: 'June', value: 5 },
    { name: 'July', value: 6 }, { name: 'August', value: 7 },
    { name: 'September', value: 8 }, { name: 'October', value: 9 },
    { name: 'November', value: 10 }, { name: 'December', value: 11 }
  ];

  selectedMonth = signal(new Date().getMonth());
  selectedYear = signal(new Date().getFullYear());

  filteredEvents = computed(() => {
    const month = this.selectedMonth();
    const year = this.selectedYear();
    return this.eventService.allEvents().filter(event => {
      return event.date.getMonth() === Number(month) && event.date.getFullYear() === Number(year);
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  resetFilters() {
    this.selectedMonth.set(new Date().getMonth());
    this.selectedYear.set(new Date().getFullYear());
  }
}
