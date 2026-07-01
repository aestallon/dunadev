import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ElementRef,
  viewChild,
  afterNextRender,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { EventSummary } from '../../../api/dunadev';
import { LocalizedDatePipe, DATE_FORMATS } from '../../pipes/localized-date.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import * as L from 'leaflet';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [LocalizedDatePipe, TranslatePipe],
  template: `
    @if (event) {
      <div class="modal-backdrop" (click)="close.emit()" (keydown.escape)="close.emit()">
        <div class="modal-panel" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">

          <!-- Cover image banner -->
          @if (event.coverImageUrl) {
            <div class="modal-image">
              <img [src]="event.coverImageUrl" [alt]="event.title">
            </div>
          }

          <div class="modal-body">
            <!-- Close button -->
            <button class="close-btn" (click)="close.emit()" [attr.aria-label]="'modal.close' | translate">✕</button>

            <!-- Status badges -->
            <div class="modal-badges">
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

            <!-- Title + organiser -->
            <h2 class="modal-title">{{ event.title }}</h2>
            <p class="modal-organiser">{{ event.organiser.name }}</p>

            <!-- Date, time, location row -->
            <div class="modal-when-where">
              <div class="info-block">
                <span class="info-label">{{ 'modal.when' | translate }}</span>
                <span class="info-value">{{ event.startsAt | localizedDate:fmt.FULL_DATE }}</span>
                <span class="info-value">
                  {{ event.startsAt | localizedDate:fmt.TIME }}
                  @if (event.endsAt) { &ndash; {{ event.endsAt | localizedDate:fmt.TIME }} }
                </span>
              </div>
              @if (event.location) {
                <div class="info-block">
                  <span class="info-label">{{ 'modal.where' | translate }}</span>
                  <span class="info-value location-name">{{ event.location.name }}</span>
                  @if (event.location.address || event.location.city) {
                    <span class="info-value location-addr">
                      {{ [event.location.address, event.location.city].filter(s => !!s).join(', ') }}
                    </span>
                  }
                  @if (event.location.websiteUrl) {
                    <a [href]="event.location.websiteUrl" target="_blank" rel="noopener"
                       class="location-link">{{ 'modal.venueWebsite' | translate }} &rarr;</a>
                  }
                </div>
              }
              <div class="ics-action">
                <button class="btn btn-ics" (click)="exportIcs()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                       stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {{ 'modal.addToCalendar' | translate }}
                </button>
              </div>
            </div>

            <!-- CTA box for paid / registration events -->
            @if (!event.free || event.registrationRequired) {
              <div class="cta-box">
                @if (!event.free && event.registrationRequired) {
                  <p [innerHTML]="'modal.ctaPaidAndReg' | translate"></p>
                } @else if (!event.free) {
                  <p [innerHTML]="'modal.ctaPaidOnly' | translate"></p>
                } @else {
                  <p [innerHTML]="'modal.ctaRegOnly' | translate"></p>
                }
                @if (event.eventUrl || event.registrationUrl) {
                  <a [href]="event.registrationUrl || event.eventUrl" target="_blank" rel="noopener"
                     class="btn btn-primary cta-btn">
                    {{ event.registrationRequired ? ('modal.registerBtn' | translate) : ('modal.getTickets' | translate) }} &rarr;
                  </a>
                }
              </div>
            }

            <!-- Description -->
            @if (event.description) {
              <div class="modal-section">
                <p class="modal-description">{{ event.description }}</p>
              </div>
            }

            <!-- Event page link -->
            @if (event.eventUrl) {
              <div class="modal-section">
                <a [href]="event.eventUrl" target="_blank" rel="noopener" class="event-url-btn">
                  {{ 'modal.viewEventPage' | translate }} &rarr;
                </a>
              </div>
            }

            <!-- Additional links -->
            @if (event.links && event.links.length > 0) {
              <div class="modal-section links-section">
                <h4 class="section-label">{{ 'modal.links' | translate }}</h4>
                <div class="link-list">
                  @for (link of event.links; track link.url) {
                    <a [href]="link.url" target="_blank" rel="noopener" class="extra-link">
                      {{ link.label }} &rarr;
                    </a>
                  }
                </div>
              </div>
            }

            <!-- Map -->
            @if (event.location?.latitude && event.location?.longitude) {
              <div class="modal-section">
                <h4 class="section-label">{{ 'modal.where' | translate }}</h4>
                <div #mapRef class="map-container"></div>
                @if (event.location?.howToGetThere) {
                  <p class="how-to-get-there">{{ event.location!.howToGetThere }}</p>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-panel {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 680px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
    }

    .modal-image {
      width: 100%;
      height: 240px;
      overflow: hidden;
      border-radius: 16px 16px 0 0;
    }
    .modal-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .modal-body {
      padding: 1.75rem 2rem 2rem;
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.8125rem;
      color: var(--text-muted);
      transition: background 0.15s, color 0.15s;
    }
    .close-btn:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

    .modal-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-bottom: 0.875rem;
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

    .modal-title {
      font-size: 1.625rem;
      font-weight: 800;
      line-height: 1.2;
      margin: 0 0 0.25rem;
      padding-right: 2.5rem;
    }
    .modal-organiser {
      font-size: 0.9375rem;
      color: var(--text-muted);
      margin: 0 0 1.5rem;
    }

    .modal-when-where {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.125rem 1.25rem;
      margin-bottom: 1.25rem;
    }
    .info-block {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      min-width: 140px;
    }
    .info-label {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 0.125rem;
    }
    .info-value {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-main);
      line-height: 1.35;
    }
    .location-name { font-weight: 700; }
    .location-addr { font-size: 0.8125rem; font-weight: 400; color: var(--text-muted); }
    .location-link {
      font-size: 0.8125rem;
      color: var(--primary);
      font-weight: 600;
      margin-top: 0.25rem;
    }
    .location-link:hover { text-decoration: underline; }

    .ics-action {
      display: flex;
      align-items: flex-end;
      margin-left: auto;
    }
    .btn-ics {
      display: inline-flex;
      align-items: center;
      gap: 0.4375rem;
      padding: 0.5rem 1rem;
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: var(--radius);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: opacity 0.15s;
    }
    .btn-ics:hover { opacity: 0.88; }
    .btn-ics svg { flex-shrink: 0; }

    .cta-box {
      background: #fff7ed;
      border: 1px solid #fed7aa;
      border-radius: var(--radius);
      padding: 1rem 1.25rem;
      margin-bottom: 1.25rem;
    }
    .cta-box p {
      font-size: 0.9375rem;
      color: #c2410c;
      margin: 0 0 0.75rem;
      line-height: 1.5;
    }
    .cta-btn { text-decoration: none; display: inline-block; }

    .modal-section { margin-bottom: 1.25rem; }
    .modal-description {
      font-size: 0.9375rem;
      color: var(--text-main);
      line-height: 1.7;
      white-space: pre-wrap;
      margin: 0;
    }

    .event-url-btn {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--primary);
    }
    .event-url-btn:hover { text-decoration: underline; }

    .section-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin: 0 0 0.625rem;
    }
    .link-list {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .extra-link {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--primary);
    }
    .extra-link:hover { text-decoration: underline; }

    .map-container {
      height: 240px;
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid var(--border);
    }
    .how-to-get-there {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0.75rem 0 0;
      line-height: 1.5;
    }
  `,
})
export class EventModalComponent implements OnChanges {
  private readonly injector = inject(Injector);
  protected readonly fmt = DATE_FORMATS;

  @Input() event: EventSummary | null = null;
  @Output() close = new EventEmitter<void>();

  private readonly mapRef = viewChild<ElementRef>('mapRef');
  private map: L.Map | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['event'] && this.event) {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
      const loc = this.event.location;
      if (loc?.latitude && loc?.longitude) {
        runInInjectionContext(this.injector, () => {
          afterNextRender(() => {
            this.initMap(loc.latitude!, loc.longitude!, loc.name);
          });
        });
      }
    } else if (changes['event'] && !this.event) {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
    }
  }

  private initMap(lat: number, lng: number, name: string) {
    const el = this.mapRef()?.nativeElement;
    if (!el) return;
    this.map = L.map(el).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    L.marker([lat, lng]).bindPopup(name).addTo(this.map);
  }

  exportIcs() {
    if (!this.event) return;
    const e = this.event;

    const toIcsDate = (iso: string) =>
      new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    const icsEscape = (s: string) =>
      s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

    const now = toIcsDate(new Date().toISOString());
    const dtstart = toIcsDate(e.startsAt);
    const dtend = e.endsAt ? toIcsDate(e.endsAt) : dtstart;

    const locationParts = [
      e.location?.name,
      e.location?.address,
      e.location?.city,
    ].filter(Boolean);

    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DunaDev//DunaDev//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:event-${e.id}@dunadev`,
      `DTSTAMP:${now}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:${icsEscape(e.title)}`,
    ];

    if (e.description) {
      lines.push(`DESCRIPTION:${icsEscape(e.description)}`);
    }
    if (locationParts.length) {
      lines.push(`LOCATION:${icsEscape(locationParts.join(', '))}`);
    }
    if (e.eventUrl) {
      lines.push(`URL:${e.eventUrl}`);
    }
    lines.push(`ORGANIZER;CN="${icsEscape(e.organiser.name)}":mailto:noreply@dunadev.hu`);
    lines.push('END:VEVENT', 'END:VCALENDAR');

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${e.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
