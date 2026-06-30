import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  OrganiserEventsService,
  LocationsService,
  PublicEventsService,
  LocationSummary,
  LocationRequest,
  EventSummary,
  EventRequest,
  EventLinkRequest,
} from '../../../api/dunadev';
import { ImageUploadComponent } from '../shared/image-upload.component';
import { I18nService } from '../../services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface EventForm {
  title: string;
  description: string;
  eventUrl: string;
  startsAt: string;
  endsAt: string;
  free: boolean;
  registrationRequired: boolean;
  registrationUrl: string;
  visibleFrom: string;
  locationId: number | null;
}

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe, ImageUploadComponent, TranslatePipe],
  template: `
    <div class="event-create-page">
      <div class="container">
        <header class="page-header">
          <div>
            <a routerLink="/manage/events" class="back-link">
              &larr; {{ 'sidebar.events' | translate }}
            </a>
            <h1>{{ 'eventCreate.title' | translate }}</h1>
          </div>
        </header>

        @if (error()) {
          <div class="error-banner">{{ error() }}</div>
        }

        <div class="create-layout">
          <!-- ── Main form ── -->
          <div class="form-panel">

            <!-- Basic Info -->
            <div class="form-card">
              <h3 class="section-title">{{ 'eventCreate.basicInfo' | translate }}</h3>

              <div class="form-group">
                <label>{{ 'eventForm.titleLabel' | translate }}</label>
                <input type="text" [(ngModel)]="form.title" name="title"
                       [placeholder]="'eventForm.titlePh' | translate" autocomplete="off">
              </div>

              <div class="form-group">
                <label>{{ 'eventForm.descLabel' | translate }}</label>
                <textarea [(ngModel)]="form.description" name="description"
                          rows="4" [placeholder]="'eventForm.descPh' | translate"></textarea>
              </div>

              <div class="form-group">
                <label>{{ 'eventForm.urlLabel' | translate }}</label>
                <input type="url" [(ngModel)]="form.eventUrl" name="eventUrl"
                       [placeholder]="'eventForm.urlPh' | translate">
              </div>
            </div>

            <!-- Date & Time -->
            <div class="form-card">
              <h3 class="section-title">{{ 'eventCreate.dateTime' | translate }}</h3>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ 'eventForm.startsAt' | translate }} <span class="required">*</span></label>
                  <input type="datetime-local" [(ngModel)]="form.startsAt" name="startsAt"
                         (ngModelChange)="onStartsAtChange()">
                </div>
                <div class="form-group">
                  <label>{{ 'eventForm.endsAt' | translate }}</label>
                  <input type="datetime-local" [(ngModel)]="form.endsAt" name="endsAt">
                </div>
              </div>

              <div class="form-group">
                <label>{{ 'eventForm.visibleFrom' | translate }}</label>
                <input type="datetime-local" [(ngModel)]="form.visibleFrom" name="visibleFrom">
                <span class="hint">{{ 'eventForm.visibleFromHint' | translate }}</span>
              </div>
            </div>

            <!-- Registration -->
            <div class="form-card">
              <h3 class="section-title">{{ 'eventCreate.attendance' | translate }}</h3>

              <div class="check-group">
                <label class="check-label">
                  <input type="checkbox" [(ngModel)]="form.free" name="free">
                  <span>{{ 'eventForm.freeEntry' | translate }}</span>
                </label>
                <label class="check-label">
                  <input type="checkbox" [(ngModel)]="form.registrationRequired" name="registrationRequired">
                  <span>{{ 'eventForm.regRequired' | translate }}</span>
                </label>
              </div>

              @if (form.registrationRequired) {
                <div class="form-group mt-1">
                  <label>{{ 'eventForm.regUrl' | translate }}</label>
                  <input type="url" [(ngModel)]="form.registrationUrl" name="registrationUrl"
                         [placeholder]="'eventForm.regUrlPh' | translate">
                </div>
              }
            </div>

            <!-- Location -->
            <div class="form-card">
              <h3 class="section-title">{{ 'eventCreate.location' | translate }}</h3>

              @if (loadingLocations()) {
                <p class="muted">{{ 'eventCreate.loadingLocs' | translate }}</p>
              } @else {
                @if (locations().length > 0) {
                  <div class="form-group">
                    <label>{{ 'eventForm.selectLoc' | translate }}</label>
                    <select [(ngModel)]="form.locationId" name="locationId">
                      <option [ngValue]="null">{{ 'eventForm.pickLoc' | translate }}</option>
                      @for (loc of locations(); track loc.id) {
                        <option [ngValue]="loc.id">
                          {{ loc.name }}{{ loc.city ? ' — ' + loc.city : '' }}
                        </option>
                      }
                    </select>
                  </div>
                }

                @if (!showQuickLocation()) {
                  <button type="button" class="btn btn-secondary btn-sm"
                          (click)="showQuickLocation.set(true)">
                    + {{ 'eventCreate.newLoc' | translate }}
                  </button>
                } @else {
                  <div class="quick-location">
                    <p class="quick-location-title">{{ 'eventCreate.quickLoc' | translate }}</p>
                    <div class="form-group">
                      <label>{{ 'loc.nameLabel' | translate }}</label>
                      <input type="text" [(ngModel)]="quickLoc.name" name="qlName"
                             [placeholder]="'loc.namePh' | translate" autocomplete="off">
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label>{{ 'loc.cityLabel' | translate }}</label>
                        <input type="text" [(ngModel)]="quickLoc.city" name="qlCity"
                               placeholder="Budapest" autocomplete="off">
                      </div>
                      <div class="form-group">
                        <label>{{ 'loc.addressLabel' | translate }}</label>
                        <input type="text" [(ngModel)]="quickLoc.address" name="qlAddress"
                               [placeholder]="'loc.addressPh' | translate" autocomplete="off">
                      </div>
                    </div>
                    <div class="inline-actions">
                      <button type="button" class="btn btn-secondary btn-sm"
                              (click)="cancelQuickLocation()" [disabled]="savingLocation()">
                        {{ 'generic.cancel' | translate }}
                      </button>
                      <button type="button" class="btn btn-primary btn-sm"
                              (click)="saveQuickLocation()"
                              [disabled]="!quickLoc.name.trim() || savingLocation()">
                        {{ (savingLocation() ? 'generic.saving' : 'eventCreate.saveLoc') | translate }}
                      </button>
                    </div>
                  </div>
                }
              }
            </div>

            <!-- Cover Image -->
            <div class="form-card">
              <h3 class="section-title">{{ 'eventCreate.coverImage' | translate }}</h3>
              <p class="hint">{{ 'eventCreate.coverImageHint' | translate }}</p>
              <app-image-upload
                [uploading]="uploadingImage"
                (fileSelected)="pendingImageFile.set($event)"
                (removed)="pendingImageFile.set(null)"
              />
            </div>

            <!-- Additional Links -->
            <div class="form-card">
              <div class="section-header">
                <h3 class="section-title">{{ 'eventCreate.links' | translate }}</h3>
                <button type="button" class="btn btn-secondary btn-sm" (click)="addLink()">
                  + {{ 'eventCreate.addLink' | translate }}
                </button>
              </div>

              @if (links().length === 0) {
                <p class="muted">{{ 'eventCreate.noLinks' | translate }}</p>
              } @else {
                @for (link of links(); track $index; let i = $index) {
                  <div class="link-row">
                    <input type="text"
                           [ngModel]="link.label"
                           (ngModelChange)="updateLink(i, 'label', $event)"
                           name="linkLabel{{ i }}"
                           [placeholder]="'eventForm.linkLabelPh' | translate">
                    <input type="url"
                           [ngModel]="link.url"
                           (ngModelChange)="updateLink(i, 'url', $event)"
                           name="linkUrl{{ i }}"
                           placeholder="https://…">
                    <button type="button" class="btn-icon" (click)="removeLink(i)"
                            [title]="'eventCreate.removeLink' | translate">✕</button>
                  </div>
                }
              }
            </div>

            <!-- Form actions -->
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancel()"
                      [disabled]="saving()">
                {{ 'generic.cancel' | translate }}
              </button>
              <button type="button" class="btn btn-primary" (click)="submit()"
                      [disabled]="saving() || !isValid()">
                {{ (saving() ? 'eventCreate.creating' : 'eventCreate.createBtn') | translate }}
              </button>
            </div>
          </div>

          <!-- ── Sidebar ── -->
          <aside class="sidebar">
            <div class="sidebar-card">
              <h3>{{ 'eventCreate.weekTitle' | translate }}</h3>
              @if (!form.startsAt) {
                <p class="sidebar-hint">{{ 'eventCreate.weekHint' | translate }}</p>
              } @else if (loadingWeek()) {
                <p class="sidebar-hint">{{ 'generic.loading' | translate }}</p>
              } @else if (weekEvents().length === 0) {
                <p class="sidebar-hint">{{ 'eventCreate.weekEmpty' | translate }}</p>
              } @else {
                <ul class="week-list">
                  @for (ev of weekEvents(); track ev.id) {
                    <li class="week-item">
                      <span class="week-time">{{ ev.startsAt | date:'EEE d MMM · HH:mm' }}</span>
                      <span class="week-title">{{ ev.title }}</span>
                      <span class="week-org">{{ ev.organiser.name }}</span>
                    </li>
                  }
                </ul>
              }
            </div>
          </aside>
        </div>
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .event-create-page {
      padding: 3rem 0 6rem;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .page-header h1 {
      font-size: 2rem;
      margin: 0.25rem 0 0;
    }
    .back-link {
      font-size: 0.875rem;
      color: var(--text-muted);
      text-decoration: none;
    }
    .back-link:hover { color: var(--primary); }
    .error-banner {
      background: #fee2e2;
      color: #dc2626;
      border: 1px solid #fca5a5;
      border-radius: var(--radius);
      padding: 0.875rem 1.25rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }

    /* Layout */
    .create-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 900px) {
      .create-layout {
        grid-template-columns: 2fr 1fr;
        align-items: start;
      }
    }
    .form-panel {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    /* Cards */
    .form-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
    }
    .section-title {
      font-size: 1rem;
      font-weight: 700;
      margin: 0 0 1.25rem;
      color: var(--text);
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .section-header .section-title {
      margin: 0;
    }

    /* Form controls */
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group:last-child {
      margin-bottom: 0;
    }
    label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 600;
      margin-bottom: 0.375rem;
      color: var(--text);
    }
    .required {
      color: #dc2626;
    }
    input[type='text'],
    input[type='url'],
    input[type='datetime-local'],
    select,
    textarea {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: calc(var(--radius) - 2px);
      font-size: 0.875rem;
      background: white;
      color: var(--text);
      transition: border-color 0.15s;
      box-sizing: border-box;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    textarea { resize: vertical; font-family: inherit; }
    .hint {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.375rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .mt-1 { margin-top: 0.75rem; }

    /* Checkboxes */
    .check-group {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }
    .check-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 400;
      cursor: pointer;
    }
    .check-label input[type='checkbox'] {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
      flex-shrink: 0;
    }

    /* Quick location */
    .quick-location {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: calc(var(--radius) - 2px);
      padding: 1rem;
      margin-top: 0.75rem;
    }
    .quick-location-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin: 0 0 0.75rem;
    }
    .inline-actions {
      display: flex;
      gap: 0.625rem;
      justify-content: flex-end;
      margin-top: 0.75rem;
    }

    /* Links */
    .link-row {
      display: grid;
      grid-template-columns: 1fr 2fr auto;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .link-row:last-child { margin-bottom: 0; }


    /* Sidebar */
    .sidebar-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      position: sticky;
      top: 1.5rem;
    }
    .sidebar-card h3 {
      font-size: 0.9375rem;
      font-weight: 700;
      margin: 0 0 1rem;
    }
    .sidebar-hint {
      font-size: 0.8125rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0;
    }
    .week-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }
    .week-item {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .week-time {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--primary);
    }
    .week-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text);
      line-height: 1.3;
    }
    .week-org {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .muted {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0;
    }
  `,
})
export class EventCreateComponent implements OnInit {
  private readonly eventsService = inject(OrganiserEventsService);
  private readonly locationsService = inject(LocationsService);
  private readonly publicEventsService = inject(PublicEventsService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  // Form state (plain mutable — works cleanly with ngModel)
  form: EventForm = {
    title: '',
    description: '',
    eventUrl: '',
    startsAt: '',
    endsAt: '',
    free: true,
    registrationRequired: false,
    registrationUrl: '',
    visibleFrom: '',
    locationId: null,
  };

  quickLoc = { name: '', city: '', address: '' };

  // Async signals
  locations = signal<LocationSummary[]>([]);
  loadingLocations = signal(true);
  weekEvents = signal<EventSummary[]>([]);
  loadingWeek = signal(false);
  links = signal<{ label: string; url: string }[]>([]);
  showQuickLocation = signal(false);
  savingLocation = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  pendingImageFile = signal<File | null>(null);
  uploadingImage = signal(false);

  ngOnInit() {
    this.locationsService.getMyLocations().subscribe({
      next: locs => {
        this.locations.set(locs);
        this.loadingLocations.set(false);
      },
      error: () => this.loadingLocations.set(false),
    });
  }

  onStartsAtChange() {
    const startsAt = this.form.startsAt;
    if (!startsAt) {
      this.weekEvents.set([]);
      return;
    }
    const date = new Date(startsAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    this.loadingWeek.set(true);
    this.publicEventsService.getEventsByMonth(year, month).subscribe({
      next: events => {
        const weekStart = this.mondayOf(date);
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        this.weekEvents.set(
          events.filter(e => {
            const d = new Date(e.startsAt);
            return d >= weekStart && d < weekEnd;
          }),
        );
        this.loadingWeek.set(false);
      },
      error: () => this.loadingWeek.set(false),
    });
  }

  addLink() {
    this.links.update(l => [...l, { label: '', url: '' }]);
  }

  removeLink(i: number) {
    this.links.update(l => l.filter((_, idx) => idx !== i));
  }

  updateLink(i: number, field: 'label' | 'url', value: string) {
    this.links.update(l => l.map((link, idx) => (idx === i ? { ...link, [field]: value } : link)));
  }

  cancelQuickLocation() {
    this.quickLoc = { name: '', city: '', address: '' };
    this.showQuickLocation.set(false);
  }

  saveQuickLocation() {
    if (!this.quickLoc.name.trim()) return;
    this.savingLocation.set(true);

    const req: LocationRequest = {
      name: this.quickLoc.name,
      city: this.quickLoc.city || null,
      address: this.quickLoc.address || null,
    };
    this.locationsService.createLocation(req).subscribe({
      next: loc => {
        this.locations.update(locs => [...locs, loc]);
        this.form.locationId = loc.id;
        this.cancelQuickLocation();
        this.savingLocation.set(false);
      },
      error: () => this.savingLocation.set(false),
    });
  }

  isValid(): boolean {
    return (
      !!this.form.title.trim() &&
      !!this.form.startsAt &&
      this.form.locationId !== null
    );
  }

  submit() {
    if (!this.isValid()) return;
    this.saving.set(true);
    this.error.set(null);

    const validLinks = this.links()
      .filter(l => l.label.trim() && l.url.trim())
      .map(l => ({ label: l.label, url: l.url }) as EventLinkRequest);

    const request: EventRequest = {
      title: this.form.title,
      description: this.form.description || null,
      eventUrl: this.form.eventUrl || null,
      startsAt: new Date(this.form.startsAt).toISOString(),
      endsAt: this.form.endsAt ? new Date(this.form.endsAt).toISOString() : null,
      free: this.form.free,
      registrationRequired: this.form.registrationRequired,
      registrationUrl: this.form.registrationUrl || null,
      visibleFrom: this.form.visibleFrom ? new Date(this.form.visibleFrom).toISOString() : null,
      locationId: this.form.locationId!,
      links: validLinks,
    };

    this.eventsService.createEvent(request).subscribe({
      next: created => {
        const file = this.pendingImageFile();
        if (file) {
          this.uploadingImage.set(true);
          this.eventsService.uploadEventImage(created.id, file).subscribe({
            next: () => this.router.navigate(['/manage/events']),
            error: () => this.router.navigate(['/manage/events']),
          });
        } else {
          this.router.navigate(['/manage/events']);
        }
      },
      error: () => {
        this.error.set(this.i18n.t('eventCreate.error'));
        this.saving.set(false);
      },
    });
  }

  cancel() {
    this.router.navigate(['/manage/events']);
  }

  private mondayOf(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sun
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
