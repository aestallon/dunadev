import {
  Component,
  inject,
  signal,
  OnInit,
  afterNextRender,
  ElementRef,
  viewChild, runInInjectionContext, Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocationsService, LocationSummary, LocationRequest } from '../../../api/dunadev';
import * as L from 'leaflet';

interface LocationForm {
  name: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  websiteUrl: string;
  howToGetThere: string;
}

function emptyForm(): LocationForm {
  return {
    name: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    websiteUrl: '',
    howToGetThere: '',
  };
}

const BUDAPEST_LAT = 47.4979;
const BUDAPEST_LNG = 19.0402;

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="locations-page">
      <div class="container">
        <header class="page-header">
          <div>
            <a routerLink="/manage" class="back-link">&larr; Dashboard</a>
            <h1>My Locations</h1>
          </div>
          @if (!showCreateForm()) {
            <button class="btn btn-primary" (click)="startCreate()">New Location</button>
          }
        </header>

        @if (showCreateForm()) {
          <div class="location-form-card">
            <h3>New Location</h3>
            <ng-container
              *ngTemplateOutlet="locationFormTpl; context: { $implicit: 'create' }"
            ></ng-container>
            <div class="form-actions">
              <button class="btn btn-secondary" (click)="cancelForm()">Cancel</button>
              <button
                class="btn btn-primary"
                (click)="submitCreate()"
                [disabled]="!formData().name.trim()"
              >
                Create
              </button>
            </div>
          </div>
        }

        @if (loading()) {
          <div class="loading-state">Loading locations...</div>
        } @else if (locations().length === 0 && !showCreateForm()) {
          <div class="empty-state">
            <p>You have no locations yet. Create one to get started.</p>
          </div>
        } @else {
          <div class="locations-list">
            @for (loc of locations(); track loc.id) {
              @if (editingId() === loc.id) {
                <div class="location-form-card">
                  <h3>Edit Location</h3>
                  <ng-container
                    *ngTemplateOutlet="locationFormTpl; context: { $implicit: 'edit' }"
                  ></ng-container>
                  <div class="form-actions">
                    <button class="btn btn-secondary" (click)="cancelForm()">Cancel</button>
                    <button
                      class="btn btn-primary"
                      (click)="submitEdit(loc.id)"
                      [disabled]="!formData().name.trim()"
                    >
                      Save
                    </button>
                  </div>
                </div>
              } @else {
                <div class="location-card">
                  <div class="location-info">
                    <h3>{{ loc.name }}</h3>
                    <div class="location-details">
                      @if (loc.address || loc.city) {
                        <span class="detail">{{ formatAddress(loc) }}</span>
                      }
                      @if (loc.websiteUrl) {
                        <a
                          [href]="loc.websiteUrl"
                          target="_blank"
                          rel="noopener"
                          class="detail link"
                          >{{ loc.websiteUrl }}</a
                        >
                      }
                    </div>
                  </div>
                  <div class="location-actions">
                    <button class="btn btn-secondary btn-sm" (click)="startEdit(loc)">Edit</button>
                    <button class="btn btn-danger btn-sm" (click)="confirmDelete(loc)">
                      Delete
                    </button>
                  </div>
                </div>
              }
            }
          </div>
        }

        @if (deletingLocation()) {
          <div class="modal-overlay" (click)="cancelDelete()">
            <div class="modal" (click)="$event.stopPropagation()">
              <h3>Delete Location</h3>
              <p>
                Are you sure you want to delete
                <strong>{{ deletingLocation()!.name }}</strong
                >? If it has been used in events it will be deactivated instead.
              </p>
              <div class="modal-actions">
                <button class="btn btn-secondary" (click)="cancelDelete()">Cancel</button>
                <button class="btn btn-danger" (click)="executeDelete()">Delete</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <ng-template #locationFormTpl let-prefix>
      <div class="form-grid">
        <div class="form-group span-2">
          <label [for]="prefix + '-name'">Name *</label>
          <input
            [id]="prefix + '-name'"
            type="text"
            [(ngModel)]="formData().name"
            placeholder="Venue name"
          />
        </div>
        <div class="form-group">
          <label [for]="prefix + '-address'">Address</label>
          <input
            [id]="prefix + '-address'"
            type="text"
            [(ngModel)]="formData().address"
            placeholder="Street address"
          />
        </div>
        <div class="form-group">
          <label [for]="prefix + '-city'">City</label>
          <input
            [id]="prefix + '-city'"
            type="text"
            [(ngModel)]="formData().city"
            placeholder="City"
          />
        </div>
        <div class="form-group span-2">
          <label [for]="prefix + '-url'">Website URL</label>
          <input
            [id]="prefix + '-url'"
            type="text"
            [(ngModel)]="formData().websiteUrl"
            placeholder="https://..."
          />
        </div>
        <div class="form-group span-2 map-section">
          <label>Pin on map</label>
          <button class="btn btn-secondary btn-sm map-toggle" (click)="toggleMap()">
            {{ mapExpanded() ? 'Hide map' : 'Show map' }}
          </button>
          @if (formData().latitude || formData().longitude) {
            <span class="coords-display">
              {{ formData().latitude }}, {{ formData().longitude }}
              <button class="btn-link" (click)="clearPin()">Clear pin</button>
            </span>
          }
          @if (mapExpanded()) {
            <div class="map-container" #mapContainer></div>
          }
        </div>
        <div class="form-group span-2">
          <label [for]="prefix + '-directions'">How to get there</label>
          <textarea
            [id]="prefix + '-directions'"
            [(ngModel)]="formData().howToGetThere"
            placeholder="e.g. Take tram 4/6 to Nyugati, walk 5 minutes north..."
            rows="3"
          ></textarea>
        </div>
      </div>
    </ng-template>
  `,
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .locations-page {
      padding: 3rem 0 6rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    .page-header h1 {
      font-size: 2rem;
      margin-bottom: 0;
    }
    .back-link {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      display: inline-block;
    }
    .back-link:hover {
      color: var(--primary);
    }

    .locations-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .location-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: var(--transition);
    }
    .location-card:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow);
    }
    .location-info h3 {
      font-size: 1.125rem;
      margin-bottom: 0.375rem;
    }
    .location-details {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }
    .detail.link {
      color: var(--primary);
    }
    .location-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .location-form-card {
      background: white;
      border: 1px solid var(--primary);
      border-radius: var(--radius);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .location-form-card h3 {
      margin-bottom: 1rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .span-2 {
      grid-column: span 2;
    }
    .form-group label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 600;
      margin-bottom: 0.375rem;
      color: var(--text-muted);
    }
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.625rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.875rem;
      font-family: inherit;
      transition: var(--transition);
      box-sizing: border-box;
      resize: vertical;
    }
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }

    .map-section {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }
    .map-section label {
      margin-bottom: 0;
    }
    .map-toggle {
      margin-left: 0.5rem;
    }
    .coords-display {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-left: 0.75rem;
    }
    .btn-link {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 0.8125rem;
      padding: 0;
      margin-left: 0.5rem;
      text-decoration: underline;
    }
    .btn-link:hover {
      color: #dc2626;
    }
    .map-container {
      width: 100%;
      height: 400px;
      border-radius: 8px;
      border: 1px solid var(--border);
      margin-top: 0.5rem;
      z-index: 0;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
    }
    .btn-danger {
      background: #ef4444;
      color: white;
      border: none;
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
    }
    .btn-danger:hover {
      background: #dc2626;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: var(--radius);
      border: 2px dashed var(--border);
      color: var(--text-muted);
    }
    .loading-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal {
      background: white;
      border-radius: var(--radius);
      padding: 2rem;
      max-width: 440px;
      width: 90%;
      box-shadow: var(--shadow-lg);
    }
    .modal h3 {
      margin-bottom: 0.75rem;
    }
    .modal p {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    @media (max-width: 640px) {
      .location-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
      .span-2 {
        grid-column: span 1;
      }
    }
  `,
})
export class LocationsComponent implements OnInit {
  private readonly locationsService = inject(LocationsService);

  readonly mapContainer = viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  readonly locations = signal<LocationSummary[]>([]);
  readonly loading = signal(true);
  readonly showCreateForm = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly formData = signal<LocationForm>(emptyForm());
  readonly deletingLocation = signal<LocationSummary | null>(null);
  readonly mapExpanded = signal(false);

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  readonly injector = inject(Injector);

  constructor() {
    afterNextRender(() => {
      this.initMapIfNeeded();
    });
  }

  ngOnInit() {
    this.loadLocations();
  }

  toggleMap() {
    this.mapExpanded.update((v) => !v);
    if (this.mapExpanded()) {
      runInInjectionContext(this.injector, () => {
        afterNextRender(() => {
          this.initMapIfNeeded();
        });
      });
    } else {
      this.destroyMap();
    }
  }

  clearPin() {
    if (this.marker && this.map) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    const f = this.formData();
    this.formData.set({ ...f, latitude: '', longitude: '' });
  }

  startCreate() {
    this.editingId.set(null);
    this.formData.set(emptyForm());
    this.showCreateForm.set(true);
    this.mapExpanded.set(false);
    this.destroyMap();
  }

  startEdit(loc: LocationSummary) {
    this.showCreateForm.set(false);
    this.editingId.set(loc.id);
    this.formData.set({
      name: loc.name,
      address: loc.address ?? '',
      city: loc.city ?? '',
      latitude: loc.latitude != null ? String(loc.latitude) : '',
      longitude: loc.longitude != null ? String(loc.longitude) : '',
      websiteUrl: loc.websiteUrl ?? '',
      howToGetThere: loc.howToGetThere ?? '',
    });
    this.mapExpanded.set(false);
    this.destroyMap();
  }

  cancelForm() {
    this.showCreateForm.set(false);
    this.editingId.set(null);
    this.formData.set(emptyForm());
    this.mapExpanded.set(false);
    this.destroyMap();
  }

  submitCreate() {
    const req = this.buildRequest();
    this.locationsService.createLocation(req).subscribe({
      next: () => {
        this.cancelForm();
        this.loadLocations();
      },
    });
  }

  submitEdit(id: number) {
    const req = this.buildRequest();
    this.locationsService.updateLocation(id, req).subscribe({
      next: () => {
        this.cancelForm();
        this.loadLocations();
      },
    });
  }

  confirmDelete(loc: LocationSummary) {
    this.deletingLocation.set(loc);
  }

  cancelDelete() {
    this.deletingLocation.set(null);
  }

  executeDelete() {
    const loc = this.deletingLocation();
    if (!loc) return;
    this.locationsService.deleteLocation(loc.id).subscribe({
      next: () => {
        this.deletingLocation.set(null);
        this.loadLocations();
      },
    });
  }

  formatAddress(loc: LocationSummary): string {
    return [loc.address, loc.city].filter((s) => !!s).join(', ');
  }

  private loadLocations() {
    this.loading.set(true);
    this.locationsService.getMyLocations().subscribe({
      next: (locs) => {
        this.locations.set(locs);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private buildRequest(): LocationRequest {
    const f = this.formData();
    return {
      name: f.name.trim(),
      address: f.address.trim() || undefined,
      city: f.city.trim() || undefined,
      latitude: f.latitude ? parseFloat(f.latitude) : undefined,
      longitude: f.longitude ? parseFloat(f.longitude) : undefined,
      websiteUrl: f.websiteUrl.trim() || undefined,
      howToGetThere: f.howToGetThere.trim() || undefined,
    };
  }

  private initMapIfNeeded() {
    const el = this.mapContainer()?.nativeElement;
    if (!el || this.map) return;

    const f = this.formData();
    const hasCoords = !!f.latitude && !!f.longitude;
    const lat = hasCoords ? parseFloat(f.latitude) : BUDAPEST_LAT;
    const lng = hasCoords ? parseFloat(f.longitude) : BUDAPEST_LNG;
    const zoom = hasCoords ? 15 : 12;

    this.map = L.map(el).setView([lat, lng], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    if (hasCoords) {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      if (this.marker && this.map) {
        this.marker.setLatLng(e.latlng);
      } else if (this.map) {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
      const current = this.formData();
      this.formData.set({
        ...current,
        latitude: String(Math.round(clickLat * 1_000_000) / 1_000_000),
        longitude: String(Math.round(clickLng * 1_000_000) / 1_000_000),
      });
    });
  }

  private destroyMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
  }
}
