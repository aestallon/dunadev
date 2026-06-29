import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AdministrationService, EventSummary, EventStatus } from '../../../api/dunadev';
import { SearchBoxComponent } from '../shared/search-box.component';

@Component({
  selector: 'app-admin-organiser-events',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, SearchBoxComponent],
  template: `
    <div class="tab-page">
      <div class="tab-toolbar">
        <app-search-box placeholder="Filter events…" (queryChange)="query.set($event)" />
      </div>

      @if (loading()) {
        <div class="loading-state">Loading events…</div>
      } @else if (filtered().length === 0) {
        <div class="empty-state">
          @if (query()) {
            No events match <strong>«{{ query() }}»</strong>.
          } @else {
            No events for this organiser.
          }
        </div>
      } @else {
        <div class="events-list">
          @for (event of filtered(); track event.id) {
            <div class="event-row" [class.past]="isPast(event)" [class.cancelled]="event.status === 'CANCELLED'">
              <div class="event-date">
                <span class="date-day">{{ event.startsAt | date:'d' }}</span>
                <span class="date-mon">{{ event.startsAt | date:'MMM' }}</span>
                <span class="date-year">{{ event.startsAt | date:'yyyy' }}</span>
              </div>
              <div class="event-info">
                <div class="event-title-row">
                  <span class="event-title">{{ event.title }}</span>
                  @if (event.status === 'CANCELLED') {
                    <span class="status-badge cancelled-badge">Cancelled</span>
                  } @else if (event.status === 'RESCHEDULED') {
                    <span class="status-badge rescheduled-badge">Rescheduled</span>
                  }
                </div>
                <div class="event-meta">
                  <span>{{ event.startsAt | date:'HH:mm' }}</span>
                  @if (event.endsAt) { <span>– {{ event.endsAt | date:'HH:mm' }}</span> }
                  @if (event.location) {
                    <span class="sep">·</span>
                    <span>{{ event.location.name }}</span>
                  }
                  <span class="sep">·</span>
                  @if (event.free) {
                    <span class="badge free">Free</span>
                  } @else {
                    <span class="badge paid">Paid</span>
                  }
                </div>
              </div>
              @if (!isPast(event)) {
                <a [routerLink]="[event.id, 'edit']" class="btn btn-secondary btn-sm edit-btn">
                  Edit
                </a>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .tab-page { padding: 1.5rem 2rem 4rem; }
    .tab-toolbar { margin-bottom: 1.25rem; }
    .loading-state, .empty-state {
      text-align: center; padding: 4rem 2rem; color: var(--text-muted); font-size: 0.9375rem;
    }
    .events-list { display: flex; flex-direction: column; gap: 0.625rem; }
    .event-row {
      display: flex; align-items: center; gap: 1.25rem;
      background: white; border: 1px solid var(--border);
      border-radius: var(--radius); padding: 1rem 1.25rem;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .event-row:hover { border-color: var(--primary); box-shadow: var(--shadow); }
    .event-row.past { opacity: 0.55; }
    .event-row.cancelled { opacity: 0.5; }

    .event-date {
      display: flex; flex-direction: column; align-items: center;
      min-width: 36px; color: var(--primary);
    }
    .date-day { font-size: 1.25rem; font-weight: 700; line-height: 1; }
    .date-mon { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .date-year { font-size: 0.625rem; color: var(--text-muted); }

    .event-info { flex: 1; min-width: 0; }
    .event-title-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem; }
    .event-title { font-weight: 600; font-size: 0.9375rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .status-badge { font-size: 0.625rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.125rem 0.4rem; border-radius: 9999px; flex-shrink: 0; }
    .cancelled-badge { background: #fee2e2; color: #dc2626; }
    .rescheduled-badge { background: #fef3c7; color: #d97706; }

    .event-meta { font-size: 0.8125rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.25rem; flex-wrap: wrap; }
    .sep { opacity: 0.4; }
    .badge { font-size: 0.6875rem; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 4px; }
    .free { background: #d1fae5; color: #059669; }
    .paid { background: #ede9fe; color: #7c3aed; }
    .edit-btn { flex-shrink: 0; text-decoration: none; }
    .btn-sm { padding: 0.375rem 0.875rem; font-size: 0.8125rem; }
  `,
})
export class AdminOrganiserEventsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdministrationService);

  readonly query = signal('');
  readonly allEvents = signal<EventSummary[]>([]);
  readonly loading = signal(true);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.allEvents();
    if (!q) return list;
    return list.filter(e =>
      e.title.toLowerCase().includes(q) ||
      (e.location?.name ?? '').toLowerCase().includes(q)
    );
  });

  isPast(event: EventSummary): boolean {
    return new Date(event.startsAt) < new Date();
  }

  ngOnInit() {
    const orgId = Number(this.route.parent!.snapshot.paramMap.get('id'));
    this.adminService.getAdminOrganiserEvents(orgId).subscribe({
      next: events => { this.allEvents.set(events); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
