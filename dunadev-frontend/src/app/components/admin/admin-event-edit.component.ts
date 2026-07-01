import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizedDatePipe, DATE_FORMATS } from '../../pipes/localized-date.pipe';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AdministrationService, EventSummary, EventUpdateRequest, EventLinkRequest, LocationSummary } from '../../../api/dunadev';
import { ImageUploadComponent } from '../shared/image-upload.component';
import { I18nService } from '../../services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface EditForm {
  title: string; description: string; eventUrl: string;
  free: boolean; registrationRequired: boolean; registrationUrl: string; visibleFrom: string;
}

@Component({
  selector: 'app-admin-event-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LocalizedDatePipe, ImageUploadComponent, TranslatePipe],
  template: `
    <div class="event-edit-page">
      <div class="container">
        <header class="page-header">
          <div>
            <a [routerLink]="['..']" class="back-link">
              &larr; {{ 'sidebar.events' | translate }}
            </a>
            <h1>{{ 'eventEdit.title' | translate }}</h1>
          </div>
        </header>

        @if (loadError()) {
          <div class="error-banner">{{ loadError() }}</div>
        } @else if (loading()) {
          <div class="loading-state">{{ 'generic.loading' | translate }}</div>
        } @else {
          @if (saveError()) { <div class="error-banner">{{ saveError() }}</div> }

          <div class="edit-layout">
            <div class="context-card">
              <h3 class="section-title">{{ 'eventEdit.fixedDetails' | translate }}</h3>
              <p class="context-hint">{{ 'eventEdit.fixedHint' | translate }}</p>
              <dl class="detail-list">
                <dt>{{ 'eventEdit.organiser' | translate }}</dt>
                <dd>{{ event()!.organiser.name }}</dd>
                <dt>{{ 'eventForm.startsAt' | translate }}</dt>
                <dd>{{ event()!.startsAt | localizedDate:fmt.SHORT_DATE_TIME }}</dd>
                @if (event()!.endsAt) {
                  <dt>{{ 'eventForm.endsAt' | translate }}</dt>
                  <dd>{{ event()!.endsAt | localizedDate:fmt.TIME }}</dd>
                }
                @if (event()!.location) {
                  <dt>{{ 'eventEdit.location' | translate }}</dt>
                  <dd>{{ event()!.location!.name }}@if (event()!.location!.city) {<span class="muted">, {{ event()!.location!.city }}</span>}</dd>
                }
              </dl>
            </div>

            <div class="form-panel">
              <div class="form-card">
                <h3 class="section-title">{{ 'eventCreate.basicInfo' | translate }}</h3>
                <div class="form-group">
                  <label>{{ 'eventForm.titleLabel' | translate }} <span class="required">*</span></label>
                  <input type="text" [(ngModel)]="form.title" name="title"
                         [placeholder]="'eventForm.titlePh' | translate" autocomplete="off">
                </div>
                <div class="form-group">
                  <label>{{ 'eventForm.descLabel' | translate }}</label>
                  <textarea [(ngModel)]="form.description" name="description" rows="4"
                            [placeholder]="'eventForm.descPh' | translate"></textarea>
                </div>
                <div class="form-group">
                  <label>{{ 'eventForm.urlLabel' | translate }}</label>
                  <input type="url" [(ngModel)]="form.eventUrl" name="eventUrl"
                         [placeholder]="'eventForm.urlPh' | translate">
                </div>
              </div>

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

              <div class="form-card">
                <h3 class="section-title">{{ 'eventEdit.visibility' | translate }}</h3>
                <div class="form-group">
                  <label>{{ 'eventForm.visibleFrom' | translate }}</label>
                  <input type="datetime-local" [(ngModel)]="form.visibleFrom" name="visibleFrom">
                  <span class="hint">{{ 'eventForm.visibleFromHint' | translate }}</span>
                </div>
              </div>

              <div class="form-card">
                <div class="section-header">
                  <h3 class="section-title">{{ 'eventCreate.links' | translate }}</h3>
                  <button type="button" class="btn btn-secondary btn-sm" (click)="addLink()">
                    + {{ 'eventCreate.addLink' | translate }}
                  </button>
                </div>
                @if (links().length === 0) {
                  <p class="muted">{{ 'eventEdit.noLinks' | translate }}</p>
                } @else {
                  @for (link of links(); track $index; let i = $index) {
                    <div class="link-row">
                      <input type="text" [ngModel]="link.label" (ngModelChange)="updateLink(i,'label',$event)"
                             [name]="'ll'+i" [placeholder]="'eventForm.linkLabelPh' | translate">
                      <input type="url" [ngModel]="link.url" (ngModelChange)="updateLink(i,'url',$event)"
                             [name]="'lu'+i" [placeholder]="'eventForm.linkUrlPh' | translate">
                      <button type="button" class="btn-icon" (click)="removeLink(i)"
                              [title]="'eventCreate.removeLink' | translate">✕</button>
                    </div>
                  }
                }
              </div>

              <!-- Cover Image -->
              <div class="form-card">
                <h3 class="section-title">{{ 'eventCreate.coverImage' | translate }}</h3>
                @if (imageError()) {
                  <div class="error-banner" style="margin-bottom:0.75rem">{{ imageError() }}</div>
                }
                @if (imageSuccess()) {
                  <div class="success-banner">{{ 'eventEdit.imageSuccess' | translate }}</div>
                }
                <app-image-upload
                  [currentImageUrl]="event()?.coverImageUrl ?? null"
                  [uploading]="uploadingImage"
                  (fileSelected)="uploadImage($event)"
                />
              </div>

              <!-- Event Controls -->
              @if (isFuture(event()!.startsAt) && event()!.status !== 'CANCELLED') {
                <div class="form-card controls-card">
                  <h3 class="section-title">{{ 'eventControls.title' | translate }}</h3>
                  <p class="context-hint">{{ 'eventControls.hint' | translate }}</p>

                  @if (alterError()) { <div class="error-banner" style="margin-bottom:0.75rem">{{ alterError() }}</div> }
                  @if (alterSuccess()) { <div class="success-banner">{{ alterSuccess() }}</div> }

                  <div class="control-block">
                    <div class="control-label">{{ 'eventControls.reschedule' | translate }}</div>
                    <div class="control-body">
                      <div class="control-fields">
                        <div class="form-group">
                          <label>{{ 'eventControls.newStart' | translate }}</label>
                          <input type="datetime-local" [(ngModel)]="rescheduleStartsAt" name="rescStartsAt">
                        </div>
                        <div class="form-group">
                          <label>{{ 'eventControls.newEnd' | translate }}</label>
                          <input type="datetime-local" [(ngModel)]="rescheduleEndsAt" name="rescEndsAt">
                        </div>
                      </div>
                      <button type="button" class="btn btn-warning"
                              [disabled]="altering() || !rescheduleStartsAt" (click)="doReschedule()">
                        {{ (altering() ? 'generic.saving' : 'eventControls.reschedule') | translate }}
                      </button>
                    </div>
                  </div>

                  <div class="control-block">
                    <div class="control-label">{{ 'eventControls.relocate' | translate }}</div>
                    <div class="control-body">
                      <div class="form-group">
                        <label>{{ 'eventControls.newLoc' | translate }}</label>
                        <select [(ngModel)]="relocateLocationId" name="relocLoc">
                          <option [ngValue]="null" disabled>{{ 'eventForm.selectLoc' | translate }}</option>
                          @for (loc of availableLocations(); track loc.id) {
                            <option [ngValue]="loc.id">{{ loc.name }}</option>
                          }
                        </select>
                      </div>
                      <button type="button" class="btn btn-secondary"
                              [disabled]="altering() || relocateLocationId === null" (click)="doRelocate()">
                        {{ (altering() ? 'generic.saving' : 'eventControls.relocate') | translate }}
                      </button>
                    </div>
                  </div>

                  <div class="control-block danger-block">
                    <div class="control-label">{{ 'eventControls.cancelLabel' | translate }}</div>
                    <div class="control-body">
                      @if (!cancelConfirm()) {
                        <p class="control-hint">{{ 'eventControls.cancelHint' | translate }}</p>
                        <button type="button" class="btn btn-danger" (click)="cancelConfirm.set(true)">
                          {{ 'eventControls.cancelBtn' | translate }}
                        </button>
                      } @else {
                        <p class="control-hint" [innerHTML]="'eventControls.cancelConfirm' | translate"></p>
                        <div class="confirm-row">
                          <button type="button" class="btn btn-secondary" (click)="cancelConfirm.set(false)">
                            {{ 'eventControls.keepBtn' | translate }}
                          </button>
                          <button type="button" class="btn btn-danger" [disabled]="altering()" (click)="doCancel()">
                            {{ (altering() ? 'eventControls.cancelling' : 'eventControls.confirmCancel') | translate }}
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" (click)="cancel()" [disabled]="saving()">
                  {{ 'generic.cancel' | translate }}
                </button>
                <button type="button" class="btn btn-primary" (click)="submit()"
                        [disabled]="saving() || !form.title.trim()">
                  {{ (saving() ? 'generic.saving' : 'eventEdit.saveBtn') | translate }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .container { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; }
    .event-edit-page { padding: 2rem 0 6rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-size: 2rem; margin: 0.25rem 0 0; }
    .back-link { font-size: 0.875rem; color: var(--text-muted); text-decoration: none; display: block; }
    .back-link:hover { color: var(--primary); }
    .error-banner { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; border-radius: var(--radius); padding: 0.875rem 1.25rem; margin-bottom: 1.5rem; font-size: 0.875rem; }
    .loading-state { text-align: center; padding: 4rem; color: var(--text-muted); }

    .edit-layout { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
    @media (min-width: 760px) { .edit-layout { grid-template-columns: 240px 1fr; align-items: start; } }
    .form-panel { display: flex; flex-direction: column; gap: 1.25rem; }

    .context-card { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; }
    .context-hint { font-size: 0.8125rem; color: var(--text-muted); margin: 0 0 1rem; line-height: 1.5; }
    .detail-list { margin: 0; }
    .detail-list dt { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-top: 0.75rem; }
    .detail-list dt:first-child { margin-top: 0; }
    .detail-list dd { margin: 0.125rem 0 0; font-size: 0.875rem; font-weight: 500; }
    .muted { color: var(--text-muted); }

    .form-card { background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
    .section-title { font-size: 1rem; font-weight: 700; margin: 0 0 1.25rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .section-header .section-title { margin: 0; }
    .form-group { margin-bottom: 1rem; }
    .form-group:last-child { margin-bottom: 0; }
    label { display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 0.375rem; }
    .required { color: #dc2626; }
    input[type='text'], input[type='url'], input[type='datetime-local'], textarea {
      width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border);
      border-radius: calc(var(--radius) - 2px); font-size: 0.875rem;
      background: white; box-sizing: border-box; transition: border-color 0.15s;
    }
    input:focus, textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    textarea { resize: vertical; font-family: inherit; }
    .hint { display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.375rem; }
    .mt-1 { margin-top: 0.75rem; }
    .check-group { display: flex; flex-direction: column; gap: 0.625rem; }
    .check-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 400; cursor: pointer; }
    .check-label input[type='checkbox'] { width: 1rem; height: 1rem; cursor: pointer; flex-shrink: 0; }
    .link-row { display: grid; grid-template-columns: 1fr 2fr auto; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
    .btn-icon { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 0.875rem; padding: 0.375rem; border-radius: 4px; transition: color 0.15s, background 0.15s; }
    .btn-icon:hover { color: #dc2626; background: #fee2e2; }
    .btn-sm { padding: 0.375rem 0.875rem; font-size: 0.8125rem; }
    .form-actions { display: flex; gap: 0.75rem; }
    .success-banner { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; border-radius: calc(var(--radius) - 2px); padding: 0.75rem 1rem; font-size: 0.875rem; margin-bottom: 0.75rem; }
    select { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: calc(var(--radius) - 2px); font-size: 0.875rem; background: white; color: var(--text); box-sizing: border-box; }
    select:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    .controls-card { border-left: 3px solid #f59e0b; }
    .control-block { padding: 1rem 0; border-top: 1px solid var(--border); }
    .control-block:first-of-type { border-top: none; padding-top: 0.25rem; }
    .danger-block { border-top-color: #fca5a5; }
    .control-label { font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-main); margin-bottom: 0.625rem; }
    .danger-block .control-label { color: #dc2626; }
    .control-body { display: flex; flex-direction: column; gap: 0.625rem; }
    .control-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    @media (max-width: 640px) { .control-fields { grid-template-columns: 1fr; } }
    .control-hint { font-size: 0.8125rem; color: var(--text-muted); margin: 0; }
    .confirm-row { display: flex; gap: 0.5rem; }
    .btn-warning { background: #f59e0b; color: white; border: none; border-radius: var(--radius); padding: 0.5625rem 1.125rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: background 0.15s; align-self: flex-start; }
    .btn-warning:hover:not(:disabled) { background: #d97706; }
    .btn-warning:disabled { opacity: 0.5; cursor: default; }
    .btn-danger { background: #dc2626; color: white; border: none; border-radius: var(--radius); padding: 0.5625rem 1.125rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: background 0.15s; align-self: flex-start; }
    .btn-danger:hover:not(:disabled) { background: #b91c1c; }
    .btn-danger:disabled { opacity: 0.5; cursor: default; }
  `,
})
export class AdminEventEditComponent implements OnInit {
  protected readonly fmt = DATE_FORMATS;
  private readonly adminService = inject(AdministrationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly i18n = inject(I18nService);

  event = signal<EventSummary | null>(null);
  loading = signal(true);
  loadError = signal<string | null>(null);
  saveError = signal<string | null>(null);
  saving = signal(false);
  uploadingImage = signal(false);
  imageError = signal<string | null>(null);
  imageSuccess = signal(false);
  links = signal<{ label: string; url: string }[]>([]);

  altering = signal(false);
  alterError = signal<string | null>(null);
  alterSuccess = signal<string | null>(null);
  cancelConfirm = signal(false);
  rescheduleStartsAt = '';
  rescheduleEndsAt = '';
  relocateLocationId: number | null = null;
  availableLocations = signal<LocationSummary[]>([]);

  form: EditForm = { title: '', description: '', eventUrl: '', free: true, registrationRequired: false, registrationUrl: '', visibleFrom: '' };

  ngOnInit() {
    const eid = Number(this.route.snapshot.paramMap.get('eid'));
    const orgId = Number(this.route.parent!.snapshot.paramMap.get('id'));
    this.adminService.getAdminEvent(eid).subscribe({
      next: ev => {
        this.event.set(ev);
        this.form = { title: ev.title, description: ev.description ?? '', eventUrl: ev.eventUrl ?? '', free: ev.free, registrationRequired: ev.registrationRequired, registrationUrl: ev.registrationUrl ?? '', visibleFrom: '' };
        this.links.set((ev.links ?? []).map(l => ({ label: l.label, url: l.url })));
        this.relocateLocationId = ev.location?.id ?? null;
        this.loading.set(false);
      },
      error: () => { this.loadError.set(this.i18n.t('eventEdit.loadError')); this.loading.set(false); },
    });
    this.adminService.getAdminOrganiserLocations(orgId).subscribe({
      next: locs => this.availableLocations.set(locs),
    });
  }

  addLink() { this.links.update(l => [...l, { label: '', url: '' }]); }
  removeLink(i: number) { this.links.update(l => l.filter((_, idx) => idx !== i)); }
  updateLink(i: number, field: 'label' | 'url', value: string) {
    this.links.update(l => l.map((link, idx) => idx === i ? { ...link, [field]: value } : link));
  }

  submit() {
    if (!this.form.title.trim()) return;
    this.saving.set(true);
    this.saveError.set(null);
    const validLinks = this.links().filter(l => l.label.trim() && l.url.trim()).map(l => ({ label: l.label, url: l.url }) as EventLinkRequest);
    const eid = Number(this.route.snapshot.paramMap.get('eid'));
    const request: EventUpdateRequest = {
      title: this.form.title, description: this.form.description || null,
      eventUrl: this.form.eventUrl || null, free: this.form.free,
      registrationRequired: this.form.registrationRequired, registrationUrl: this.form.registrationUrl || null,
      visibleFrom: this.form.visibleFrom ? new Date(this.form.visibleFrom).toISOString() : null,
      links: validLinks,
    };
    this.adminService.updateAdminEvent(eid, request).subscribe({
      next: () => this.cancel(),
      error: err => { this.saveError.set(err?.error?.message ?? this.i18n.t('eventEdit.saveError')); this.saving.set(false); },
    });
  }

  uploadImage(file: File) {
    const eid = Number(this.route.snapshot.paramMap.get('eid'));
    this.uploadingImage.set(true);
    this.imageError.set(null);
    this.imageSuccess.set(false);
    this.adminService.uploadAdminEventImage(eid, file).subscribe({
      next: updated => {
        this.event.set(updated);
        this.uploadingImage.set(false);
        this.imageSuccess.set(true);
      },
      error: () => {
        this.imageError.set(this.i18n.t('eventEdit.imageError'));
        this.uploadingImage.set(false);
      },
    });
  }

  cancel() {
    const orgId = this.route.parent!.snapshot.paramMap.get('id');
    this.router.navigate(['/admin/organisers', orgId, 'events']);
  }

  isFuture(startsAt: string): boolean {
    return new Date(startsAt) > new Date();
  }

  doReschedule() {
    if (!this.rescheduleStartsAt) return;
    const eid = Number(this.route.snapshot.paramMap.get('eid'));
    this.altering.set(true);
    this.alterError.set(null);
    this.alterSuccess.set(null);
    this.adminService.rescheduleAdminEvent(eid, {
      startsAt: new Date(this.rescheduleStartsAt).toISOString(),
      endsAt: this.rescheduleEndsAt ? new Date(this.rescheduleEndsAt).toISOString() : null,
    }).subscribe({
      next: updated => {
        this.event.set(updated);
        this.rescheduleStartsAt = '';
        this.rescheduleEndsAt = '';
        this.altering.set(false);
        this.alterSuccess.set(this.i18n.t('eventControls.rescheduled'));
      },
      error: err => {
        this.alterError.set(err?.error?.message ?? this.i18n.t('eventControls.rescheduleError'));
        this.altering.set(false);
      },
    });
  }

  doRelocate() {
    if (this.relocateLocationId === null) return;
    const eid = Number(this.route.snapshot.paramMap.get('eid'));
    this.altering.set(true);
    this.alterError.set(null);
    this.alterSuccess.set(null);
    this.adminService.relocateAdminEvent(eid, { locationId: this.relocateLocationId }).subscribe({
      next: updated => {
        this.event.set(updated);
        this.altering.set(false);
        this.alterSuccess.set(this.i18n.t('eventControls.relocated'));
      },
      error: err => {
        this.alterError.set(err?.error?.message ?? this.i18n.t('eventControls.relocateError'));
        this.altering.set(false);
      },
    });
  }

  doCancel() {
    const eid = Number(this.route.snapshot.paramMap.get('eid'));
    this.altering.set(true);
    this.alterError.set(null);
    this.adminService.cancelAdminEvent(eid).subscribe({
      next: () => this.cancel(),
      error: err => {
        this.alterError.set(err?.error?.message ?? this.i18n.t('eventControls.cancelError'));
        this.altering.set(false);
        this.cancelConfirm.set(false);
      },
    });
  }
}
