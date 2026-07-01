import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizedDatePipe, DATE_FORMATS } from '../../pipes/localized-date.pipe';
import { RouterLink } from '@angular/router';
import { AdministrationService, EventSummary, EventStatus } from '../../../api/dunadev';
import { SearchBoxComponent } from '../shared/search-box.component';
import { EventModalComponent } from '../shared/event-modal.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-admin-upcoming',
  standalone: true,
  imports: [CommonModule, RouterLink, LocalizedDatePipe, SearchBoxComponent, EventModalComponent, TranslatePipe],
  template: `
    <app-event-modal [event]="previewEvent()" (close)="previewEvent.set(null)" />

    <div class="page">
      <div class="container">

        <div class="page-header">
          <h1>{{ 'adminUpcoming.title' | translate }}</h1>
          <div class="day-filter">
            @for (d of dayOptions; track d) {
              <button class="day-btn" [class.active]="days() === d" (click)="setDays(d)">
                {{ d }}{{ 'adminUpcoming.dayAbbrev' | translate }}
              </button>
            }
          </div>
        </div>

        <app-search-box
          [placeholder]="'adminUpcoming.filterPh' | translate"
          (queryChange)="query.set($event)"
          class="search-row"
        />

        @if (loading()) {
          <div class="loading-state">{{ 'generic.loading' | translate }}</div>
        } @else if (filtered().length === 0) {
          <div class="empty-state">
            @if (query()) {
              {{ 'adminUpcoming.noMatch' | translate : { q: query() } }}
            } @else {
              {{ 'adminUpcoming.empty' | translate : { days: days().toString() } }}
            }
          </div>
        } @else {
          <div class="events-list">
            @for (event of filtered(); track event.id) {
              <div class="event-row" [class.cancelled]="event.status === 'CANCELLED'">
                <div class="event-date">
                  <span class="date-day">{{ event.startsAt | localizedDate:fmt.DAY_NUM }}</span>
                  <span class="date-mon">{{ event.startsAt | localizedDate:fmt.SHORT_MONTH }}</span>
                </div>
                <div class="event-info">
                  <div class="event-title-row">
                    <span class="event-title">{{ event.title }}</span>
                    @if (event.status === 'CANCELLED') {
                      <span class="status-badge cancelled-badge">{{ 'badge.cancelled' | translate }}</span>
                    } @else if (event.status === 'RESCHEDULED') {
                      <span class="status-badge rescheduled-badge">{{ 'badge.onNewDate' | translate }}</span>
                    }
                  </div>
                  <div class="event-meta">
                    <span class="org-name">{{ event.organiser.name }}</span>
                    <span class="sep">·</span>
                    <span>{{ event.startsAt | localizedDate:fmt.DAY_TIME }}</span>
                    @if (event.endsAt) { <span>– {{ event.endsAt | localizedDate:fmt.TIME }}</span> }
                    @if (event.location) {
                      <span class="sep">·</span>
                      <span>{{ event.location.name }}</span>
                    }
                    <span class="sep">·</span>
                    @if (event.free) {
                      <span class="badge free">{{ 'badge.free' | translate }}</span>
                    } @else {
                      <span class="badge paid">{{ 'badge.paid' | translate }}</span>
                    }
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm" (click)="previewEvent.set(event)">
                  {{ 'generic.preview' | translate }}
                </button>
                <a [routerLink]="['/admin/organisers', event.organiser.id, 'events', event.id, 'edit']"
                   class="btn btn-secondary btn-sm edit-btn">
                  {{ 'generic.edit' | translate }}
                </a>
              </div>
            }
          </div>
        }

      </div>
    </div>
  `,
  styles: `
    .page { padding: 2rem 0 6rem; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; }
    .page-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 1.25rem;
    }
    .page-header h1 { font-size: 2rem; margin: 0; }

    .day-filter { display: flex; gap: 0.25rem; }
    .day-btn {
      padding: 0.375rem 0.75rem; border-radius: 6px;
      border: 1px solid var(--border); background: white;
      font-size: 0.8125rem; font-weight: 500; color: var(--text-muted);
      cursor: pointer; transition: all 0.15s;
    }
    .day-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
    .day-btn:hover:not(.active) { border-color: var(--primary); color: var(--primary); }

    .search-row { display: block; margin-bottom: 1.5rem; }

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
    .event-row.cancelled { opacity: 0.6; }

    .event-date {
      display: flex; flex-direction: column; align-items: center;
      min-width: 36px; color: var(--primary);
    }
    .date-day { font-size: 1.375rem; font-weight: 700; line-height: 1; }
    .date-mon { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

    .event-info { flex: 1; min-width: 0; }
    .event-title-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem; }
    .event-title { font-weight: 600; font-size: 0.9375rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .status-badge {
      font-size: 0.625rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.05em; padding: 0.125rem 0.4rem; border-radius: 9999px; flex-shrink: 0;
    }
    .cancelled-badge { background: #fee2e2; color: #dc2626; }
    .rescheduled-badge { background: #fef3c7; color: #d97706; }

    .event-meta {
      font-size: 0.8125rem; color: var(--text-muted);
      display: flex; align-items: center; gap: 0.25rem; flex-wrap: wrap;
    }
    .org-name { font-weight: 600; color: var(--text-main); }
    .sep { opacity: 0.4; }
    .badge {
      font-size: 0.6875rem; font-weight: 600;
      padding: 0.1rem 0.4rem; border-radius: 4px;
    }
    .free { background: #d1fae5; color: #059669; }
    .paid { background: #ede9fe; color: #7c3aed; }

    .edit-btn { flex-shrink: 0; text-decoration: none; }
    .btn-sm { padding: 0.375rem 0.875rem; font-size: 0.8125rem; }
  `,
})
export class AdminUpcomingComponent implements OnInit {
  protected readonly fmt = DATE_FORMATS;
  private readonly adminService = inject(AdministrationService);

  readonly dayOptions = [7, 14, 30];
  readonly days = signal(14);
  readonly query = signal('');
  readonly allEvents = signal<EventSummary[]>([]);
  readonly loading = signal(true);
  readonly previewEvent = signal<EventSummary | null>(null);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.allEvents();
    if (!q) return list;
    return list.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.organiser.name.toLowerCase().includes(q) ||
      (e.location?.name ?? '').toLowerCase().includes(q)
    );
  });

  ngOnInit() { this.load(); }

  setDays(d: number) {
    this.days.set(d);
    this.load();
  }

  private load() {
    this.loading.set(true);
    this.adminService.getAdminUpcomingEvents(this.days()).subscribe({
      next: events => { this.allEvents.set(events); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
