import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventSummary } from '../../../api/dunadev';
import { LocalizedDatePipe, DATE_FORMATS } from '../../pipes/localized-date.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [LocalizedDatePipe, TranslatePipe],
  template: `
    <div class="event-card"
         [class.cancelled]="event.status === 'CANCELLED'"
         [class.has-image]="!!event.coverImageUrl"
         (click)="cardClick.emit(event)"
         role="button"
         tabindex="0"
         (keydown.enter)="cardClick.emit(event)">

      @if (event.coverImageUrl) {
        <div class="card-image">
          <img [src]="event.coverImageUrl" [alt]="event.title" loading="lazy">
        </div>
      } @else {
        <div class="card-image card-image-placeholder">
          <span class="placeholder-icon">📅</span>
        </div>
      }

      <div class="card-body">
        <div class="card-datetime">
          <span class="card-date">{{ event.startsAt | localizedDate:fmt.SHORT_DATE }}</span>
          <span class="card-time">{{ event.startsAt | localizedDate:fmt.TIME }}
            @if (event.endsAt) { &ndash; {{ event.endsAt | localizedDate:fmt.TIME }} }
          </span>
        </div>

        <h3 class="card-title">{{ event.title }}</h3>

        <div class="card-meta">
          @if (event.organiser) {
            <span class="meta-org">{{ event.organiser.name }}</span>
          }
          @if (event.location) {
            <span class="meta-sep">·</span>
            <span class="meta-loc">{{ event.location.name }}</span>
          }
        </div>

        <div class="card-badges">
          @if (event.free) {
            <span class="badge badge-free">{{ 'badge.free' | translate }}</span>
          } @else {
            <span class="badge badge-paid">{{ 'badge.paid' | translate }}</span>
          }
          @if (event.registrationRequired) {
            <span class="badge badge-reg">{{ 'badge.regRequired' | translate }}</span>
          }
          @if (event.status === 'CANCELLED') {
            <span class="badge badge-cancelled">{{ 'badge.cancelled' | translate }}</span>
          } @else {
            @if (event.status === 'RESCHEDULED') {
              <span class="badge badge-rescheduled">{{ 'badge.onNewDate' | translate }}</span>
            }
            @if (event.onNewLocation) {
              <span class="badge badge-relocated">{{ 'badge.onNewLocation' | translate }}</span>
            }
          }
        </div>

        @if (editLink || showPreview) {
          <div class="card-actions" (click)="$event.stopPropagation()">
            @if (showPreview) {
              <button class="btn btn-secondary btn-xs" (click)="cardClick.emit(event)">
                {{ 'card.preview' | translate }}
              </button>
            }
            @if (editLink) {
              <a [href]="editLink" class="btn btn-secondary btn-xs" (click)="$event.stopPropagation()">
                {{ 'card.edit' | translate }}
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .event-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
    }
    .event-card:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow);
      transform: translateY(-2px);
    }
    .event-card:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
    .event-card.cancelled { opacity: 0.55; }

    .card-image {
      width: 100%;
      height: 160px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-image-placeholder {
      background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .placeholder-icon { font-size: 2.5rem; opacity: 0.5; }

    .card-body {
      padding: 1.125rem 1.25rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .card-datetime {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .card-date {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--primary);
    }
    .card-time {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.35;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-meta {
      font-size: 0.8125rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.3rem;
      flex-wrap: wrap;
    }
    .meta-org { font-weight: 600; color: var(--text-main); }
    .meta-sep { opacity: 0.4; }

    .card-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-top: 0.125rem;
    }
    .badge {
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
    }
    .badge-free        { background: #d1fae5; color: #065f46; }
    .badge-paid        { background: #ede9fe; color: #5b21b6; }
    .badge-reg         { background: #fff7ed; color: #c2410c; }
    .badge-cancelled   { background: #fee2e2; color: #dc2626; }
    .badge-rescheduled { background: #fef3c7; color: #92400e; }
    .badge-relocated   { background: #ede9fe; color: #7c3aed; }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.375rem;
    }
    .btn-xs { padding: 0.25rem 0.625rem; font-size: 0.75rem; }
  `,
})
export class EventCardComponent {
  protected readonly fmt = DATE_FORMATS;
  @Input({ required: true }) event!: EventSummary;
  @Input() editLink: string | null = null;
  @Input() showPreview = false;
  @Output() cardClick = new EventEmitter<EventSummary>();
}
