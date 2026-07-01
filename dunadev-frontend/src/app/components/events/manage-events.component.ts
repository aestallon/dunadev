import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrganiserEventsService, EventSummary, EventStatus } from '../../../api/dunadev';
import { EventCardComponent } from '../shared/event-card.component';
import { EventModalComponent } from '../shared/event-modal.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [RouterLink, EventCardComponent, EventModalComponent, TranslatePipe],
  template: `
    <app-event-modal [event]="previewEvent()" (close)="previewEvent.set(null)" />

    <div class="events-page">
      <div class="container">
        <header class="page-header">
          <h1>{{ 'manageEvents.title' | translate }}</h1>
          <a routerLink="/manage/events/new" class="btn btn-primary">
            + {{ 'manageEvents.newBtn' | translate }}
          </a>
        </header>

        @if (loading()) {
          <div class="loading-state">{{ 'generic.loading' | translate }}</div>
        } @else if (events().length === 0) {
          <div class="empty-state">
            <div class="empty-icon"></div>
            <h3>{{ 'manageEvents.empty' | translate }}</h3>
            <p>{{ 'manageEvents.newFirst' | translate }}</p>
            <a routerLink="/manage/events/new" class="btn btn-primary">
              {{ 'manageEvents.newBtn' | translate }}
            </a>
          </div>
        } @else {
          <div class="events-grid">
            @for (event of events(); track event.id) {
              <app-event-card
                [event]="event"
                [editLink]="isFutureEditable(event) ? '/manage/events/' + event.id + '/edit' : null"
                [showPreview]="true"
                (cardClick)="previewEvent.set($event)"
              />
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 1100px;
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
    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
  `,
})
export class ManageEventsComponent implements OnInit {
  private readonly eventsService = inject(OrganiserEventsService);

  events = signal<EventSummary[]>([]);
  loading = signal(true);
  previewEvent = signal<EventSummary | null>(null);

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
