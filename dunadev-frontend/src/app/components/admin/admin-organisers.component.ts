import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdministrationService, AdminOrganiserSummary } from '../../../api/dunadev';
import { SearchBoxComponent } from '../shared/search-box.component';
import { I18nService } from '../../services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

const AVATAR_COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2'];

function orgInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function orgColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

@Component({
  selector: 'app-admin-organisers',
  standalone: true,
  imports: [RouterLink, SearchBoxComponent, FormsModule, TranslatePipe],
  template: `
    <div class="page">
      <div class="container">

        <div class="page-header">
          <div class="header-left">
            <h1>{{ 'adminOrgs.title' | translate }}</h1>
            <span class="count-chip">{{ filtered().length }}</span>
          </div>
          <button class="btn btn-primary" (click)="toggleInviteForm()">
            @if (showInviteForm()) {
              {{ 'generic.cancel' | translate }}
            } @else {
              + {{ 'adminOrgs.inviteBtn' | translate }}
            }
          </button>
        </div>

        <!-- Invite form panel -->
        @if (showInviteForm()) {
          <div class="invite-panel">
            <h2 class="invite-title">{{ 'adminOrgs.inviteTitle' | translate }}</h2>
            <p class="invite-hint">{{ 'adminOrgs.inviteHint' | translate }}</p>
            @if (inviteError()) {
              <div class="error-banner">{{ inviteError() }}</div>
            }
            @if (inviteSuccess()) {
              <div class="success-banner"
                   [innerHTML]="'adminOrgs.inviteSent' | translate : { email: inviteSuccess()! }">
              </div>
            }
            <div class="invite-form">
              <div class="form-group">
                <label>{{ 'adminOrgs.nameLabel' | translate }} <span class="required">*</span></label>
                <input type="text" [(ngModel)]="inviteName" [placeholder]="'adminOrgs.namePh' | translate"
                       [disabled]="inviting()" name="inviteName">
              </div>
              <div class="form-group">
                <label>{{ 'adminOrgs.emailLabel' | translate }} <span class="required">*</span></label>
                <input type="email" [(ngModel)]="inviteEmail" [placeholder]="'adminOrgs.emailPh' | translate"
                       [disabled]="inviting()" name="inviteEmail">
              </div>
              <button class="btn btn-primary" (click)="submitInvite()"
                      [disabled]="inviting() || !inviteName.trim() || !inviteEmail.trim()">
                @if (inviting()) {
                  <span class="spinner"></span> {{ 'adminOrgs.sending' | translate }}
                } @else {
                  {{ 'adminOrgs.sendBtn' | translate }}
                }
              </button>
            </div>
          </div>
        }

        <app-search-box
          [placeholder]="'adminOrgs.searchPh' | translate"
          (queryChange)="query.set($event)"
          class="search-row"
        />

        @if (loading()) {
          <div class="org-grid">
            @for (n of skeletons; track n) {
              <div class="org-card sk-card">
                <div class="sk-avatar"></div>
                <div class="sk-line wide"></div>
                <div class="sk-line narrow"></div>
              </div>
            }
          </div>
        } @else if (filtered().length === 0) {
          <div class="empty-state">
            @if (query()) {
              {{ 'adminOrgs.noMatch' | translate : { q: query() } }}
            } @else {
              {{ 'adminOrgs.empty' | translate }}
            }
          </div>
        } @else {
          <div class="org-grid">
            @for (org of filtered(); track org.id) {
              <div class="org-card" [class.card-invited]="org.status === 'INVITED'">
                <div class="card-top">
                  <div class="org-avatar" [style.background]="orgColor(org.name)">
                    {{ orgInitials(org.name) }}
                  </div>
                  <span class="status-badge"
                        [class.badge-invited]="org.status === 'INVITED'"
                        [class.badge-active]="org.status === 'ACTIVE'">
                    {{ (org.status === 'INVITED' ? 'adminOrgs.statusInvited' : 'adminOrgs.statusActive') | translate }}
                  </span>
                </div>
                <div class="org-name">{{ org.name }}</div>
                @if (org.websiteUrl) {
                  <div class="org-url">{{ org.websiteUrl }}</div>
                }
                <div class="org-counts">
                  <span>{{ org.eventCount }} {{ (org.eventCount !== 1 ? 'adminOrgs.events' : 'adminOrgs.event') | translate }}</span>
                  <span class="sep">·</span>
                  <span>{{ org.locationCount }} {{ (org.locationCount !== 1 ? 'adminOrgs.locations' : 'adminOrgs.location') | translate }}</span>
                </div>
                <div class="org-email">{{ org.userEmail }}</div>
                <a [routerLink]="['/admin/organisers', org.id]" class="btn btn-secondary btn-sm view-btn">
                  {{ 'adminOrgs.viewBtn' | translate }}
                </a>
              </div>
            }
          </div>
        }

      </div>
    </div>
  `,
  styles: `
    .page { padding: 2rem 0 6rem; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }

    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
    .header-left { display: flex; align-items: center; gap: 0.75rem; }
    .page-header h1 { font-size: 2rem; margin: 0; }
    .count-chip {
      font-size: 0.8125rem; font-weight: 600; color: var(--text-muted);
      background: var(--bg); border: 1px solid var(--border);
      padding: 0.2rem 0.625rem; border-radius: 9999px;
    }

    /* Invite panel */
    .invite-panel {
      background: white; border: 1px solid var(--border); border-radius: var(--radius);
      padding: 1.5rem; margin-bottom: 1.5rem;
    }
    .invite-title { font-size: 1.125rem; font-weight: 700; margin: 0 0 0.375rem; }
    .invite-hint { font-size: 0.875rem; color: var(--text-muted); margin: 0 0 1.25rem; }
    .invite-form { display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; min-width: 200px; }
    label { font-size: 0.8125rem; font-weight: 600; }
    .required { color: #dc2626; }
    input[type='text'], input[type='email'] {
      padding: 0.5rem 0.75rem; border: 1px solid var(--border);
      border-radius: calc(var(--radius) - 2px); font-size: 0.875rem;
      background: white; box-sizing: border-box; transition: border-color 0.15s;
    }
    input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    input:disabled { background: var(--bg); }
    .error-banner   { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; border-radius: calc(var(--radius) - 2px); padding: 0.75rem 1rem; font-size: 0.875rem; margin-bottom: 1rem; }
    .success-banner { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; border-radius: calc(var(--radius) - 2px); padding: 0.75rem 1rem; font-size: 0.875rem; margin-bottom: 1rem; }

    .search-row { display: block; margin-bottom: 1.75rem; }
    .empty-state { text-align: center; padding: 4rem 2rem; color: var(--text-muted); font-size: 0.9375rem; }

    /* Grid */
    .org-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.25rem;
    }
    .org-card {
      background: white; border: 1px solid var(--border); border-radius: var(--radius);
      padding: 1.75rem 1.5rem; display: flex; flex-direction: column;
      align-items: center; text-align: center; gap: 0.5rem;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .org-card:hover { border-color: var(--primary); box-shadow: var(--shadow); }
    .card-invited { border-style: dashed; }

    .card-top { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; width: 100%; }

    .org-avatar {
      width: 56px; height: 56px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 700; font-size: 1.25rem;
      flex-shrink: 0;
    }

    /* Status badge */
    .status-badge {
      font-size: 0.625rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; padding: 0.2rem 0.6rem; border-radius: 9999px;
    }
    .badge-invited { background: #fef3c7; color: #92400e; }
    .badge-active  { background: #d1fae5; color: #065f46; }

    .org-name  { font-size: 1.0625rem; font-weight: 700; color: var(--text-main); margin-top: 0.25rem; }
    .org-url   { font-size: 0.75rem; color: var(--primary); word-break: break-all; }
    .org-counts { font-size: 0.8125rem; color: var(--text-muted); display: flex; gap: 0.375rem; }
    .sep { opacity: 0.4; }
    .org-email { font-size: 0.75rem; color: var(--text-muted); }

    .view-btn { margin-top: 0.75rem; text-decoration: none; }
    .btn-sm { padding: 0.375rem 1rem; font-size: 0.8125rem; }

    /* Skeletons */
    .sk-card { pointer-events: none; }
    .sk-avatar {
      width: 56px; height: 56px; border-radius: 14px; margin-bottom: 0.5rem;
      background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%);
      background-size: 200% 100%; animation: shimmer 1.5s infinite;
    }
    .sk-line {
      height: 12px; border-radius: 4px;
      background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%);
      background-size: 200% 100%; animation: shimmer 1.5s infinite;
    }
    .sk-line.wide { width: 70%; }
    .sk-line.narrow { width: 45%; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 0.375rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,
})
export class AdminOrganisersComponent implements OnInit {
  private readonly adminService = inject(AdministrationService);
  private readonly i18n = inject(I18nService);

  readonly skeletons = [1, 2, 3, 4, 5, 6];
  readonly query = signal('');
  readonly allOrganisers = signal<AdminOrganiserSummary[]>([]);
  readonly loading = signal(true);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.allOrganisers();
    if (!q) return list;
    return list.filter(o =>
      o.name.toLowerCase().includes(q) ||
      o.userEmail.toLowerCase().includes(q)
    );
  });

  readonly orgInitials = orgInitials;
  readonly orgColor = orgColor;

  // ── Invite form state ──────────────────────────────────────────────────────
  readonly showInviteForm = signal(false);
  readonly inviting       = signal(false);
  readonly inviteError    = signal<string | null>(null);
  readonly inviteSuccess  = signal<string | null>(null);

  inviteName  = '';
  inviteEmail = '';

  ngOnInit() {
    this.loadOrganisers();
  }

  toggleInviteForm() {
    this.showInviteForm.update(v => !v);
    this.inviteError.set(null);
    this.inviteSuccess.set(null);
    this.inviteName  = '';
    this.inviteEmail = '';
  }

  submitInvite() {
    if (!this.inviteName.trim() || !this.inviteEmail.trim()) return;
    this.inviting.set(true);
    this.inviteError.set(null);
    this.inviteSuccess.set(null);

    this.adminService.createAdminOrganiser({ name: this.inviteName.trim(), email: this.inviteEmail.trim() })
      .subscribe({
        next: org => {
          this.allOrganisers.update(list => [org, ...list]);
          this.inviteSuccess.set(this.inviteEmail.trim());
          this.inviteName  = '';
          this.inviteEmail = '';
          this.inviting.set(false);
        },
        error: err => {
          this.inviteError.set(
            err?.status === 409
              ? this.i18n.t('adminOrgs.emailExists')
              : this.i18n.t('adminOrgs.inviteError')
          );
          this.inviting.set(false);
        },
      });
  }

  private loadOrganisers() {
    this.adminService.listAdminOrganisers().subscribe({
      next: orgs => { this.allOrganisers.set(orgs); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
