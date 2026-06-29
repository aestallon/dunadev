import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrganiserEventsService, EventSummary, EventStatus } from '../../../api/dunadev';

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="events-page">
      <div class="container">
        <header class="page-header">
          <h1>Events</h1>
          <a routerLink="/manage/events/new" class="btn btn-primary">+ New Event</a>
        </header>

        @if (loading()) {
          <div class="loading-state">Loading events...</div>
        } @else if (events().length === 0) {
          <div class="empty-state">
            <div class="empty-icon"></div>
            <h3>No events yet</h3>
            <p>Create your first event to get started.</p>
            <a routerLink="/manage/events/new" class="btn btn-primary">Create Event</a>
          </div>
        } @else {
          <div class="events-list">
            @for (event of events(); track event.id) {
              <div class="event-row" [class.event-cancelled]="event.status === 'CANCELLED'">
                <div class="event-date">
                  <span class="date-day">{{ event.startsAt | date:'d' }}</span>
                  <span class="date-mon">{{ event.startsAt | date:'MMM' }}</span>
                </div>
                <div class="event-info">
                  <div class="event-title-row">
                    <span class="event-title">{{ event.title }}</span>
                    @if (event.status === 'CANCELLED') {
                      <span class="status-badge cancelled">Cancelled</span>
                    } @else if (event.status === 'RESCHEDULED') {
                      <span class="status-badge rescheduled">Rescheduled</span>
                    }
                  </div>
                  <div class="event-meta">
                    <span>{{ event.startsAt | date:'HH:mm' }}</span>
                    @if (event.endsAt) {
                      <span>– {{ event.endsAt | date:'HH:mm' }}</span>
                    }
                    @if (event.location) {
                      <span class="sep">·</span>
                      <span>{{ event.location.name }}</span>
                      @if (event.location.city) {
                        <span>, {{ event.location.city }}</span>
                      }
                    }
                    <span class="sep">·</span>
                    @if (event.free) {
                      <span class="badge free">Free</span>
                    } @else {
                      <span class="badge paid">Paid</span>
                    }
                  </div>
                </div>
                @if (isFutureEditable(event)) {
                  <a [routerLink]="['/manage/events', event.id, 'edit']"
                     class="btn btn-secondary btn-sm edit-btn">
                    Edit
                  </a>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .events-page {
      padding: 3rem 0 6rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2.5rem;
    }
    .page-header h1 {
      font-size: 2rem;
      margin-bottom: 0;
    }
    .loading-state, .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted);
    }
    .empty-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      margin: 0 auto 1.25rem;
    }
    .empty-state h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: var(--text);
    }
    .empty-state p {
      margin-bottom: 1.5rem;
    }
    .events-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .event-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.25rem 1.5rem;
      transition: var(--transition);
    }
    .event-row:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow);
    }
    .event-cancelled {
      opacity: 0.6;
    }
    .event-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 40px;
      color: var(--primary);
    }
    .date-day {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1;
    }
    .date-mon {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .event-info {
      flex: 1;
      min-width: 0;
    }
    .event-title-row {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      margin-bottom: 0.25rem;
    }
    .event-title {
      font-weight: 600;
      font-size: 1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .status-badge {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      flex-shrink: 0;
    }
    .cancelled { background: #fee2e2; color: #dc2626; }
    .rescheduled { background: #fef3c7; color: #d97706; }
    .event-meta {
      font-size: 0.8125rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex-wrap: wrap;
    }
    .sep { opacity: 0.4; }
    .badge {
      font-size: 0.6875rem;
      font-weight: 600;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
    }
    .free { background: #d1fae5; color: #059669; }
    .paid { background: #ede9fe; color: #7c3aed; }
    .edit-btn {
      flex-shrink: 0;
      margin-left: auto;
      text-decoration: none;
    }
  `,
})
export class ManageEventsComponent implements OnInit {
  private readonly eventsService = inject(OrganiserEventsService);

  events = signal<EventSummary[]>([]);
  loading = signal(true);

  isFutureEditable(event: EventSummary): boolean {
    return (
      event.status !== EventStatus.CANCELLED &&
      new Date(event.startsAt) > new Date()
    );
  }

  ngOnInit() {
    this.eventsService.getMyEvents().subscribe({
      next: events => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
