import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AdministrationService, EventSummary, EventUpdateRequest, EventLinkRequest } from '../../../api/dunadev';
import { ImageUploadComponent } from '../shared/image-upload.component';

interface EditForm {
  title: string; description: string; eventUrl: string;
  free: boolean; registrationRequired: boolean; registrationUrl: string; visibleFrom: string;
}

@Component({
  selector: 'app-admin-event-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe, ImageUploadComponent],
  template: `
    <div class="event-edit-page">
      <div class="container">
        <header class="page-header">
          <div>
            <a [routerLink]="['..']" class="back-link">&larr; Events</a>
            <h1>Edit Event</h1>
          </div>
        </header>

        @if (loadError()) {
          <div class="error-banner">{{ loadError() }}</div>
        } @else if (loading()) {
          <div class="loading-state">Loading event…</div>
        } @else {
          @if (saveError()) { <div class="error-banner">{{ saveError() }}</div> }

          <div class="edit-layout">
            <div class="context-card">
              <h3 class="section-title">Fixed details</h3>
              <p class="context-hint">Date, time, and location cannot be changed here.</p>
              <dl class="detail-list">
                <dt>Organiser</dt>
                <dd>{{ event()!.organiser.name }}</dd>
                <dt>Starts at</dt>
                <dd>{{ event()!.startsAt | date:'EEE, d MMM yyyy · HH:mm' }}</dd>
                @if (event()!.endsAt) {
                  <dt>Ends at</dt><dd>{{ event()!.endsAt | date:'HH:mm' }}</dd>
                }
                @if (event()!.location) {
                  <dt>Location</dt>
                  <dd>{{ event()!.location!.name }}@if (event()!.location!.city) {<span class="muted">, {{ event()!.location!.city }}</span>}</dd>
                }
              </dl>
            </div>

            <div class="form-panel">
              <div class="form-card">
                <h3 class="section-title">Basic Info</h3>
                <div class="form-group">
                  <label>Title <span class="required">*</span></label>
                  <input type="text" [(ngModel)]="form.title" name="title" placeholder="Event title" autocomplete="off">
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea [(ngModel)]="form.description" name="description" rows="4" placeholder="What's this event about?"></textarea>
                </div>
                <div class="form-group">
                  <label>Event page URL</label>
                  <input type="url" [(ngModel)]="form.eventUrl" name="eventUrl" placeholder="https://example.com/event">
                </div>
              </div>

              <div class="form-card">
                <h3 class="section-title">Attendance</h3>
                <div class="check-group">
                  <label class="check-label">
                    <input type="checkbox" [(ngModel)]="form.free" name="free">
                    <span>Free entry</span>
                  </label>
                  <label class="check-label">
                    <input type="checkbox" [(ngModel)]="form.registrationRequired" name="registrationRequired">
                    <span>Registration required</span>
                  </label>
                </div>
                @if (form.registrationRequired) {
                  <div class="form-group mt-1">
                    <label>Registration URL</label>
                    <input type="url" [(ngModel)]="form.registrationUrl" name="registrationUrl" placeholder="https://example.com/register">
                  </div>
                }
              </div>

              <div class="form-card">
                <h3 class="section-title">Visibility</h3>
                <div class="form-group">
                  <label>Visible from</label>
                  <input type="datetime-local" [(ngModel)]="form.visibleFrom" name="visibleFrom">
                  <span class="hint">Leave empty to publish immediately.</span>
                </div>
              </div>

              <div class="form-card">
                <div class="section-header">
                  <h3 class="section-title">Additional Links</h3>
                  <button type="button" class="btn btn-secondary btn-sm" (click)="addLink()">+ Add link</button>
                </div>
                @if (links().length === 0) {
                  <p class="muted">No additional links.</p>
                } @else {
                  @for (link of links(); track $index; let i = $index) {
                    <div class="link-row">
                      <input type="text" [ngModel]="link.label" (ngModelChange)="updateLink(i,'label',$event)" [name]="'ll'+i" placeholder="Label">
                      <input type="url" [ngModel]="link.url" (ngModelChange)="updateLink(i,'url',$event)" [name]="'lu'+i" placeholder="https://…">
                      <button type="button" class="btn-icon" (click)="removeLink(i)" title="Remove">✕</button>
                    </div>
                  }
                }
              </div>

              <!-- Cover Image -->
              <div class="form-card">
                <h3 class="section-title">Cover Image</h3>
                @if (imageError()) {
                  <div class="error-banner" style="margin-bottom:0.75rem">{{ imageError() }}</div>
                }
                @if (imageSuccess()) {
                  <div class="success-banner">Image updated successfully.</div>
                }
                <app-image-upload
                  [currentImageUrl]="event()?.coverImageUrl ?? null"
                  [uploading]="uploadingImage"
                  (fileSelected)="uploadImage($event)"
                />
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" (click)="cancel()" [disabled]="saving()">Cancel</button>
                <button type="button" class="btn btn-primary" (click)="submit()"
                        [disabled]="saving() || !form.title.trim()">
                  {{ saving() ? 'Saving…' : 'Save Changes' }}
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
  `,
})
export class AdminEventEditComponent implements OnInit {
  private readonly adminService = inject(AdministrationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  event = signal<EventSummary | null>(null);
  loading = signal(true);
  loadError = signal<string | null>(null);
  saveError = signal<string | null>(null);
  saving = signal(false);
  uploadingImage = signal(false);
  imageError = signal<string | null>(null);
  imageSuccess = signal(false);
  links = signal<{ label: string; url: string }[]>([]);

  form: EditForm = { title: '', description: '', eventUrl: '', free: true, registrationRequired: false, registrationUrl: '', visibleFrom: '' };

  ngOnInit() {
    const eid = Number(this.route.snapshot.paramMap.get('eid'));
    this.adminService.getAdminEvent(eid).subscribe({
      next: ev => {
        this.event.set(ev);
        this.form = { title: ev.title, description: ev.description ?? '', eventUrl: ev.eventUrl ?? '', free: ev.free, registrationRequired: ev.registrationRequired, registrationUrl: ev.registrationUrl ?? '', visibleFrom: '' };
        this.links.set((ev.links ?? []).map(l => ({ label: l.label, url: l.url })));
        this.loading.set(false);
      },
      error: () => { this.loadError.set('Event not found.'); this.loading.set(false); },
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
      error: err => { this.saveError.set(err?.error?.message ?? 'Failed to save.'); this.saving.set(false); },
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
        this.imageError.set('Failed to upload image. Please try again.');
        this.uploadingImage.set(false);
      },
    });
  }

  cancel() {
    const orgId = this.route.parent!.snapshot.paramMap.get('id');
    this.router.navigate(['/admin/organisers', orgId, 'events']);
  }
}
