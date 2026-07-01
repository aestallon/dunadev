import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService, EventSummary, EventStatus } from '../../../api/dunadev';
import { SearchBoxComponent } from '../shared/search-box.component';
import { EventCardComponent } from '../shared/event-card.component';
import { EventModalComponent } from '../shared/event-modal.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-admin-organiser-events',
  standalone: true,
  imports: [SearchBoxComponent, EventCardComponent, EventModalComponent, TranslatePipe],
  template: `
    <app-event-modal [event]="previewEvent()" (close)="previewEvent.set(null)" />

    <div class="tab-page">
      <div class="tab-toolbar">
        <app-search-box [placeholder]="'adminEvents.filterPh' | translate"
                        (queryChange)="query.set($event)" />
      </div>

      @if (loading()) {
        <div class="loading-state">{{ 'generic.loading' | translate }}</div>
      } @else if (filtered().length === 0) {
        <div class="empty-state">
          @if (query()) {
            {{ 'adminEvents.noMatch' | translate : { q: query() } }}
          } @else {
            {{ 'adminEvents.noEvents' | translate }}
          }
        </div>
      } @else {
        <div class="events-grid">
          @for (event of filtered(); track event.id) {
            <app-event-card
              [event]="event"
              [editLink]="!isPast(event) ? '/admin/organisers/' + orgId + '/events/' + event.id + '/edit' : null"
              [showPreview]="true"
              (cardClick)="previewEvent.set($event)"
            />
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
    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.125rem;
    }
  `,
})
export class AdminOrganiserEventsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdministrationService);

  readonly query = signal('');
  readonly allEvents = signal<EventSummary[]>([]);
  readonly loading = signal(true);
  readonly previewEvent = signal<EventSummary | null>(null);

  orgId = 0;

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
    this.orgId = Number(this.route.parent!.snapshot.paramMap.get('id'));
    this.adminService.getAdminOrganiserEvents(this.orgId).subscribe({
      next: events => { this.allEvents.set(events); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
