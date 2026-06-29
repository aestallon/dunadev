import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  OrganiserProfileService,
  OrganiserProfile,
  OrganiserUpdateRequest,
} from '../../../api/dunadev';

@Component({
  selector: 'app-organiser-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="profile-page">
      <div class="container">

        <div class="page-header">
          <div class="breadcrumb">
            <a routerLink="/manage">Dashboard</a>
            <span class="breadcrumb-sep">/</span>
            <span>My Organisation</span>
          </div>
          <h1>My Organisation</h1>
        </div>

        @if (loading()) {
          <div class="card skeleton-card">
            <div class="sk-line short"></div>
            <div class="sk-line"></div>
            <div class="sk-line medium"></div>
          </div>
        } @else if (loadError()) {
          <div class="error-banner">{{ loadError() }}</div>
        } @else {
          <div class="card">
            @if (saveSuccess()) {
              <div class="success-banner">Profile saved successfully.</div>
            }
            @if (saveError()) {
              <div class="error-banner">{{ saveError() }}</div>
            }

            <form (ngSubmit)="save()" class="profile-form">
              <div class="form-group">
                <label for="name">Organisation name <span class="required">*</span></label>
                <input
                  id="name"
                  type="text"
                  [(ngModel)]="form.name"
                  name="name"
                  placeholder="e.g. Budapest.js"
                  required
                  [disabled]="saving()"
                />
              </div>

              <div class="form-group">
                <label for="description">Description</label>
                <textarea
                  id="description"
                  [(ngModel)]="form.description"
                  name="description"
                  rows="5"
                  placeholder="A short description of your organisation and the events you run…"
                  [disabled]="saving()"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="websiteUrl">Website URL</label>
                <input
                  id="websiteUrl"
                  type="url"
                  [(ngModel)]="form.websiteUrl"
                  name="websiteUrl"
                  placeholder="https://example.com"
                  [disabled]="saving()"
                />
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="saving() || !form.name"
                >
                  @if (saving()) {
                    <span class="spinner"></span> Saving…
                  } @else {
                    Save changes
                  }
                </button>
                <a routerLink="/manage" class="btn btn-secondary">Cancel</a>
              </div>
            </form>
          </div>
        }

      </div>
    </div>
  `,
  styles: `
    .profile-page {
      padding: 3rem 0 6rem;
    }
    .container {
      max-width: 680px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }
    .breadcrumb a {
      color: var(--primary);
      font-weight: 500;
    }
    .breadcrumb-sep {
      color: var(--border);
    }
    .page-header h1 {
      font-size: 1.75rem;
    }
    .card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 2rem;
    }
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .required {
      color: #ef4444;
    }
    textarea {
      resize: vertical;
    }
    .form-actions {
      display: flex;
      gap: 0.75rem;
      padding-top: 0.5rem;
    }
    .success-banner {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .error-banner {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    /* Skeleton */
    .skeleton-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .sk-line {
      height: 14px;
      background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }
    .sk-line.short { width: 35%; }
    .sk-line.medium { width: 65%; }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    /* Spinner */
    .spinner {
      display: inline-block;
      width: 13px;
      height: 13px;
      border: 2px solid rgba(255, 255, 255, 0.35);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin-right: 0.375rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,
})
export class OrganiserProfileComponent implements OnInit {
  private readonly profileService = inject(OrganiserProfileService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);
  readonly saveSuccess = signal(false);

  form: OrganiserUpdateRequest = { name: '' };

  ngOnInit() {
    this.profileService.getMyOrganiserProfile().subscribe({
      next: (profile: OrganiserProfile) => {
        this.form = {
          name: profile.name,
          description: profile.description ?? undefined,
          websiteUrl: profile.websiteUrl ?? undefined,
        };
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Failed to load profile. Please try again.');
        this.loading.set(false);
      },
    });
  }

  save() {
    this.saveError.set(null);
    this.saveSuccess.set(false);
    this.saving.set(true);
    this.profileService.updateMyOrganiserProfile(this.form).subscribe({
      next: (profile: OrganiserProfile) => {
        this.form = {
          name: profile.name,
          description: profile.description ?? undefined,
          websiteUrl: profile.websiteUrl ?? undefined,
        };
        this.saving.set(false);
        this.saveSuccess.set(true);
      },
      error: () => {
        this.saveError.set('Failed to save profile. Please try again.');
        this.saving.set(false);
      },
    });
  }
}
