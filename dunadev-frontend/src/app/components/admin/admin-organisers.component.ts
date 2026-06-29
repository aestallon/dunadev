import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdministrationService, AdminOrganiserSummary } from '../../../api/dunadev';
import { SearchBoxComponent } from '../shared/search-box.component';

const AVATAR_COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2'];

function orgInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function orgColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

@Component({
  selector: 'app-admin-organisers',
  standalone: true,
  imports: [RouterLink, SearchBoxComponent],
  template: `
    <div class="page">
      <div class="container">

        <div class="page-header">
          <h1>Organisers</h1>
          <span class="count-chip">{{ filtered().length }}</span>
        </div>

        <app-search-box
          placeholder="Search by name or email…"
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
              No organisers match <strong>«{{ query() }}»</strong>.
            } @else {
              No organisers found.
            }
          </div>
        } @else {
          <div class="org-grid">
            @for (org of filtered(); track org.id) {
              <div class="org-card">
                <div class="org-avatar" [style.background]="orgColor(org.name)">
                  {{ orgInitials(org.name) }}
                </div>
                <div class="org-name">{{ org.name }}</div>
                @if (org.websiteUrl) {
                  <div class="org-url">{{ org.websiteUrl }}</div>
                }
                <div class="org-counts">
                  <span>{{ org.eventCount }} event{{ org.eventCount !== 1 ? 's' : '' }}</span>
                  <span class="sep">·</span>
                  <span>{{ org.locationCount }} location{{ org.locationCount !== 1 ? 's' : '' }}</span>
                </div>
                <div class="org-email">{{ org.userEmail }}</div>
                <a [routerLink]="['/admin/organisers', org.id]" class="btn btn-secondary btn-sm view-btn">
                  View
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
    .page-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
    .page-header h1 { font-size: 2rem; margin: 0; }
    .count-chip {
      font-size: 0.8125rem; font-weight: 600; color: var(--text-muted);
      background: var(--bg); border: 1px solid var(--border);
      padding: 0.2rem 0.625rem; border-radius: 9999px;
    }
    .search-row { display: block; margin-bottom: 1.75rem; }

    .empty-state { text-align: center; padding: 4rem 2rem; color: var(--text-muted); font-size: 0.9375rem; }

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

    .org-avatar {
      width: 56px; height: 56px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 700; font-size: 1.25rem;
      margin-bottom: 0.5rem; flex-shrink: 0;
    }
    .org-name { font-size: 1.0625rem; font-weight: 700; color: var(--text-main); }
    .org-url { font-size: 0.75rem; color: var(--primary); word-break: break-all; }
    .org-counts { font-size: 0.8125rem; color: var(--text-muted); display: flex; gap: 0.375rem; }
    .sep { opacity: 0.4; }
    .org-email { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; }

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
  `,
})
export class AdminOrganisersComponent implements OnInit {
  private readonly adminService = inject(AdministrationService);

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

  ngOnInit() {
    this.adminService.listAdminOrganisers().subscribe({
      next: orgs => { this.allOrganisers.set(orgs); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
