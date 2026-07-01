import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService, OrganiserProfile, OrganiserUpdateRequest } from '../../../api/dunadev';
import { I18nService } from '../../services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-admin-organiser-edit',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  template: `
    <div class="tab-page">

      @if (loading()) {
        <div class="card sk-card">
          <div class="sk-line short"></div>
          <div class="sk-line"></div>
          <div class="sk-line medium"></div>
        </div>
      } @else {
        <div class="card">
          @if (saveSuccess()) {
            <div class="success-banner">{{ 'adminProfile.saveSuccess' | translate }}</div>
          }
          @if (saveError()) {
            <div class="error-banner">{{ saveError() }}</div>
          }

          <form (ngSubmit)="save()" class="profile-form">
            <div class="form-group">
              <label for="name">{{ 'adminProfile.nameLabel' | translate }}</label>
              <input id="name" type="text" [(ngModel)]="form.name" name="name"
                     [placeholder]="'adminProfile.namePh' | translate"
                     required [disabled]="saving()" />
            </div>

            <div class="form-group">
              <label for="description">{{ 'adminProfile.descLabel' | translate }}</label>
              <textarea id="description" [(ngModel)]="form.description" name="description"
                        rows="5" [placeholder]="'adminProfile.descPh' | translate"
                        [disabled]="saving()"></textarea>
            </div>

            <div class="form-group">
              <label for="websiteUrl">{{ 'adminProfile.urlLabel' | translate }}</label>
              <input id="websiteUrl" type="url" [(ngModel)]="form.websiteUrl" name="websiteUrl"
                     [placeholder]="'adminProfile.urlPh' | translate" [disabled]="saving()" />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary"
                      [disabled]="saving() || !form.name">
                @if (saving()) {
                  <span class="spinner"></span> {{ 'adminProfile.savingBtn' | translate }}
                } @else {
                  {{ 'adminProfile.saveBtn' | translate }}
                }
              </button>
            </div>
          </form>
        </div>
      }

    </div>
  `,
  styles: `
    .tab-page { padding: 1.5rem 2rem 4rem; max-width: 700px; }
    .card { background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; }
    .profile-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; }
    .required { color: #ef4444; }
    textarea { resize: vertical; }
    .form-actions { padding-top: 0.25rem; }
    .success-banner { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .error-banner { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .sk-card { display: flex; flex-direction: column; gap: 1rem; }
    .sk-line { height: 14px; background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
    .sk-line.short { width: 35%; }
    .sk-line.medium { width: 65%; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 0.375rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,
})
export class AdminOrganiserEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdministrationService);
  private readonly i18n = inject(I18nService);

  private orgId = 0;
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly saveSuccess = signal(false);
  readonly saveError = signal<string | null>(null);

  form: OrganiserUpdateRequest = { name: '' };

  ngOnInit() {
    this.orgId = Number(this.route.parent!.snapshot.paramMap.get('id'));
    this.adminService.getAdminOrganiser(this.orgId).subscribe({
      next: (p: OrganiserProfile) => {
        this.form = { name: p.name, description: p.description ?? undefined, websiteUrl: p.websiteUrl ?? undefined };
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  save() {
    this.saveError.set(null);
    this.saveSuccess.set(false);
    this.saving.set(true);
    this.adminService.updateAdminOrganiser(this.orgId, this.form).subscribe({
      next: (p: OrganiserProfile) => {
        this.form = { name: p.name, description: p.description ?? undefined, websiteUrl: p.websiteUrl ?? undefined };
        this.saving.set(false);
        this.saveSuccess.set(true);
      },
      error: () => { this.saveError.set(this.i18n.t('adminProfile.saveError')); this.saving.set(false); },
    });
  }
}
