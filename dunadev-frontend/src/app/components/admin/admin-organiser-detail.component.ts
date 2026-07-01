import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import { AdministrationService } from '../../../api/dunadev';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-admin-organiser-detail',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  template: `
    <div class="detail-page">

      <div class="detail-header">
        <a routerLink="/admin/organisers" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {{ 'admin.organisers' | translate }}
        </a>
        @if (loadingName()) {
          <div class="name-sk"></div>
        } @else {
          <h1>{{ orgName() }}</h1>
        }
      </div>

      <nav class="tab-bar">
        <a routerLink="events" routerLinkActive="tab-active">{{ 'detailTab.events' | translate }}</a>
        <a routerLink="locations" routerLinkActive="tab-active">{{ 'detailTab.locations' | translate }}</a>
        <a routerLink="edit" routerLinkActive="tab-active">{{ 'detailTab.profile' | translate }}</a>
      </nav>

      <div class="tab-content">
        <router-outlet />
      </div>

    </div>
  `,
  styles: `
    .detail-page { display: flex; flex-direction: column; min-height: 100%; }

    .detail-header {
      padding: 2rem 2rem 1.25rem;
      border-bottom: 1px solid var(--border);
      background: white;
    }
    .back-link {
      display: inline-flex; align-items: center; gap: 0.25rem;
      font-size: 0.8125rem; color: var(--text-muted); text-decoration: none;
      margin-bottom: 0.75rem; transition: color 0.15s;
    }
    .back-link svg { width: 14px; height: 14px; }
    .back-link:hover { color: var(--primary); }
    .detail-header h1 { font-size: 1.75rem; margin: 0; }
    .name-sk {
      height: 28px; width: 200px;
      background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%);
      background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px;
    }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    .tab-bar {
      display: flex; gap: 0; background: white;
      border-bottom: 1px solid var(--border); padding: 0 2rem;
      flex-shrink: 0;
    }
    .tab-bar a {
      padding: 0.75rem 1.25rem; font-size: 0.9375rem; font-weight: 500;
      color: var(--text-muted); text-decoration: none;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
      transition: color 0.15s, border-color 0.15s;
    }
    .tab-bar a:hover { color: var(--text-main); }
    .tab-bar a.tab-active { color: var(--primary); border-bottom-color: var(--primary); font-weight: 600; }

    .tab-content { flex: 1; }
  `,
})
export class AdminOrganiserDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdministrationService);

  readonly orgId = signal(0);
  readonly orgName = signal('');
  readonly loadingName = signal(true);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orgId.set(id);
    this.adminService.getAdminOrganiser(id).subscribe({
      next: p => { this.orgName.set(p.name); this.loadingName.set(false); },
      error: () => { this.orgName.set('Organiser'); this.loadingName.set(false); },
    });
  }
}
