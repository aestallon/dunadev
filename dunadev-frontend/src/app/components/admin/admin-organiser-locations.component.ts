import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService, LocationSummary, LocationRequest } from '../../../api/dunadev';

interface LocForm {
  name: string; address: string; city: string;
  latitude: string; longitude: string; websiteUrl: string; howToGetThere: string;
}

function emptyForm(): LocForm {
  return { name: '', address: '', city: '', latitude: '', longitude: '', websiteUrl: '', howToGetThere: '' };
}

@Component({
  selector: 'app-admin-organiser-locations',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="tab-page">

      @if (loading()) {
        <div class="loading-state">Loading locations…</div>
      } @else if (locations().length === 0) {
        <div class="empty-state">No locations for this organiser.</div>
      } @else {
        <div class="locations-list">
          @for (loc of locations(); track loc.id) {
            @if (editingId() === loc.id) {
              <div class="location-form-card">
                <h3>Edit Location</h3>
                <div class="form-grid">
                  <div class="form-group span-2">
                    <label>Name <span class="required">*</span></label>
                    <input type="text" [(ngModel)]="formData().name" placeholder="Venue name" />
                  </div>
                  <div class="form-group">
                    <label>Address</label>
                    <input type="text" [(ngModel)]="formData().address" placeholder="Street address" />
                  </div>
                  <div class="form-group">
                    <label>City</label>
                    <input type="text" [(ngModel)]="formData().city" placeholder="City" />
                  </div>
                  <div class="form-group span-2">
                    <label>Website URL</label>
                    <input type="url" [(ngModel)]="formData().websiteUrl" placeholder="https://…" />
                  </div>
                  <div class="form-group">
                    <label>Latitude</label>
                    <input type="text" [(ngModel)]="formData().latitude" placeholder="47.4979" />
                  </div>
                  <div class="form-group">
                    <label>Longitude</label>
                    <input type="text" [(ngModel)]="formData().longitude" placeholder="19.0402" />
                  </div>
                  <div class="form-group span-2">
                    <label>How to get there</label>
                    <textarea [(ngModel)]="formData().howToGetThere" rows="3"
                              placeholder="e.g. Take tram 4/6 to Nyugati…"></textarea>
                  </div>
                </div>
                @if (saveError()) {
                  <div class="error-banner">{{ saveError() }}</div>
                }
                <div class="form-actions">
                  <button class="btn btn-secondary" (click)="cancelEdit()">Cancel</button>
                  <button class="btn btn-primary" (click)="submitEdit(loc.id)"
                          [disabled]="saving() || !formData().name.trim()">
                    @if (saving()) { <span class="spinner"></span> Saving… } @else { Save }
                  </button>
                </div>
              </div>
            } @else {
              <div class="location-card">
                <div class="location-info">
                  <h3>{{ loc.name }}</h3>
                  <div class="location-meta">
                    @if (loc.address || loc.city) {
                      <span>{{ formatAddress(loc) }}</span>
                    }
                    @if (loc.websiteUrl) {
                      <a [href]="loc.websiteUrl" target="_blank" rel="noopener" class="loc-url">
                        {{ loc.websiteUrl }}
                      </a>
                    }
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm" (click)="startEdit(loc)">Edit</button>
              </div>
            }
          }
        </div>
      }
    </div>
  `,
  styles: `
    .tab-page { padding: 1.5rem 2rem 4rem; }
    .loading-state, .empty-state { text-align: center; padding: 4rem 2rem; color: var(--text-muted); font-size: 0.9375rem; }
    .locations-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .location-card {
      background: white; border: 1px solid var(--border); border-radius: var(--radius);
      padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .location-card:hover { border-color: var(--primary); box-shadow: var(--shadow); }
    .location-info h3 { font-size: 1rem; margin-bottom: 0.25rem; }
    .location-meta { display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.8125rem; color: var(--text-muted); }
    .loc-url { color: var(--primary); }
    .btn-sm { padding: 0.375rem 0.875rem; font-size: 0.8125rem; flex-shrink: 0; }

    .location-form-card { background: white; border: 1px solid var(--primary); border-radius: var(--radius); padding: 1.5rem; }
    .location-form-card h3 { margin-bottom: 1rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .span-2 { grid-column: span 2; }
    .form-group { display: flex; flex-direction: column; gap: 0.25rem; }
    .form-group label { font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); }
    .required { color: #ef4444; }
    .form-group input, .form-group textarea {
      padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px;
      font-size: 0.875rem; font-family: inherit; box-sizing: border-box; resize: vertical;
      transition: border-color 0.15s;
    }
    .form-group input:focus, .form-group textarea:focus {
      outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
    .error-banner { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; margin-bottom: 1rem; }
    .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 0.375rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .span-2 { grid-column: span 1; } }
  `,
})
export class AdminOrganiserLocationsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdministrationService);

  private orgId = 0;
  readonly locations = signal<LocationSummary[]>([]);
  readonly loading = signal(true);
  readonly editingId = signal<number | null>(null);
  readonly formData = signal<LocForm>(emptyForm());
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);

  ngOnInit() {
    this.orgId = Number(this.route.parent!.snapshot.paramMap.get('id'));
    this.loadLocations();
  }

  startEdit(loc: LocationSummary) {
    this.editingId.set(loc.id);
    this.saveError.set(null);
    this.formData.set({
      name: loc.name,
      address: loc.address ?? '',
      city: loc.city ?? '',
      latitude: loc.latitude != null ? String(loc.latitude) : '',
      longitude: loc.longitude != null ? String(loc.longitude) : '',
      websiteUrl: loc.websiteUrl ?? '',
      howToGetThere: loc.howToGetThere ?? '',
    });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.formData.set(emptyForm());
    this.saveError.set(null);
  }

  submitEdit(id: number) {
    const f = this.formData();
    const req: LocationRequest = {
      name: f.name.trim(),
      address: f.address.trim() || undefined,
      city: f.city.trim() || undefined,
      latitude: f.latitude ? parseFloat(f.latitude) : undefined,
      longitude: f.longitude ? parseFloat(f.longitude) : undefined,
      websiteUrl: f.websiteUrl.trim() || undefined,
      howToGetThere: f.howToGetThere.trim() || undefined,
    };
    this.saving.set(true);
    this.saveError.set(null);
    this.adminService.updateAdminLocation(id, req).subscribe({
      next: () => { this.saving.set(false); this.cancelEdit(); this.loadLocations(); },
      error: () => { this.saveError.set('Failed to save. Please try again.'); this.saving.set(false); },
    });
  }

  formatAddress(loc: LocationSummary): string {
    return [loc.address, loc.city].filter(s => !!s).join(', ');
  }

  private loadLocations() {
    this.loading.set(true);
    this.adminService.getAdminOrganiserLocations(this.orgId).subscribe({
      next: locs => { this.locations.set(locs); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
