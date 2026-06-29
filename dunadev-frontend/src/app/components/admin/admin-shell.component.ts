import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="manage-layout" [class.sidebar-collapsed]="collapsed()">

      <aside class="sidebar">
        <nav class="sidebar-nav">

          <a routerLink="upcoming" routerLinkActive="nav-active" (click)="onNavClick()"
             title="Upcoming Events">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span class="nav-text">Upcoming</span>
          </a>

          <a routerLink="organisers" routerLinkActive="nav-active" (click)="onNavClick()"
             title="Organisers">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="nav-text">Organisers</span>
          </a>

        </nav>

        <a routerLink="password" routerLinkActive="nav-active" (click)="onNavClick()"
           class="change-pwd-link" title="Change Password">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span class="nav-text">Change Password</span>
        </a>

        <div class="sidebar-footer">
          <div class="sidebar-role">
            <span class="role-chip">ADMIN</span>
          </div>
          <button class="collapse-btn" (click)="toggleSidebar()"
                  [title]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'">
            <svg class="collapse-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            <span class="nav-text">Collapse</span>
          </button>
        </div>
      </aside>

      @if (!collapsed()) {
        <div class="sidebar-backdrop" (click)="toggleSidebar()"></div>
      }

      <div class="manage-content">
        <div class="content-bar">
          <button class="mobile-open-btn" (click)="toggleSidebar()" aria-label="Open navigation">
            <span class="ham-line"></span>
            <span class="ham-line"></span>
            <span class="ham-line"></span>
          </button>
        </div>
        <router-outlet />
      </div>

    </div>
  `,
  styles: `
    .manage-layout { display: flex; min-height: calc(100vh - 57px); }

    .sidebar {
      width: 240px; flex-shrink: 0; background: white;
      border-right: 1px solid var(--border);
      position: sticky; top: 57px; height: calc(100vh - 57px);
      overflow: hidden; display: flex; flex-direction: column;
      transition: width 0.25s ease; z-index: 50;
    }
    .sidebar-nav {
      flex: 1; padding: 0.75rem 0.5rem;
      display: flex; flex-direction: column; gap: 0.125rem; overflow: hidden;
    }
    .sidebar-nav a {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.625rem 0.75rem; border-radius: 8px;
      font-size: 0.9375rem; font-weight: 500; color: var(--text-muted);
      text-decoration: none; transition: background 0.15s, color 0.15s;
      white-space: nowrap; overflow: hidden;
    }
    .sidebar-nav a:hover { color: var(--primary); background: rgba(37,99,235,0.06); }
    .sidebar-nav a.nav-active {
      color: var(--primary); background: rgba(37,99,235,0.09); font-weight: 600;
    }
    .nav-icon { width: 18px; height: 18px; flex-shrink: 0; }
    .nav-text {
      display: flex; align-items: center; gap: 0.5rem;
      min-width: 0; flex: 1; overflow: hidden; transition: opacity 0.15s;
    }

    .change-pwd-link {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.625rem 1.25rem; font-size: 0.875rem; font-weight: 500;
      color: var(--text-muted); text-decoration: none;
      white-space: nowrap; overflow: hidden;
      border-top: 1px solid var(--border);
      transition: background 0.15s, color 0.15s; flex-shrink: 0;
    }
    .change-pwd-link:hover { color: var(--primary); background: rgba(37,99,235,0.06); }
    .change-pwd-link.nav-active { color: var(--primary); background: rgba(37,99,235,0.09); font-weight: 600; }

    .sidebar-footer {
      border-top: 1px solid var(--border); padding: 0.5rem;
      display: flex; flex-direction: column; gap: 0.125rem; flex-shrink: 0;
    }
    .sidebar-role { padding: 0.25rem 0.75rem; overflow: hidden; }
    .role-chip {
      font-size: 0.6875rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.05em; color: #dc2626; background: rgba(220,38,38,0.08);
      padding: 0.2rem 0.625rem; border-radius: 9999px; white-space: nowrap;
    }
    .collapse-btn {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.625rem 0.75rem; border-radius: 8px;
      background: none; border: none; cursor: pointer;
      color: var(--text-muted); font-size: 0.875rem; font-weight: 500;
      width: 100%; overflow: hidden; white-space: nowrap;
      transition: background 0.15s, color 0.15s;
    }
    .collapse-btn:hover { background: var(--bg); color: var(--text-main); }
    .collapse-chevron { width: 18px; height: 18px; flex-shrink: 0; transition: transform 0.25s ease; }

    .sidebar-backdrop { display: none; }
    .manage-content { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .content-bar { display: none; }

    @media (min-width: 768px) {
      .sidebar-collapsed .sidebar { width: 56px; }
      .sidebar-collapsed .sidebar .nav-text { opacity: 0; pointer-events: none; }
      .sidebar-collapsed .sidebar .sidebar-nav a { justify-content: center; padding: 0.625rem; gap: 0; }
      .sidebar-collapsed .sidebar .change-pwd-link { justify-content: center; padding: 0.625rem; gap: 0; }
      .sidebar-collapsed .sidebar .sidebar-role { display: none; }
      .sidebar-collapsed .sidebar .collapse-btn { justify-content: center; padding: 0.625rem; gap: 0; }
      .sidebar-collapsed .sidebar .collapse-chevron { transform: rotate(180deg); }
    }

    @media (max-width: 767px) {
      .sidebar {
        position: fixed; top: 57px; left: 0; height: calc(100vh - 57px);
        width: 272px !important; overflow-y: auto; overflow-x: hidden;
        transform: translateX(-100%); transition: transform 0.25s ease;
        z-index: 200; box-shadow: var(--shadow-lg);
      }
      .manage-layout:not(.sidebar-collapsed) .sidebar { transform: translateX(0); }
      .sidebar-backdrop {
        display: block; position: fixed; inset: 0; top: 57px;
        background: rgba(15,23,42,0.35); z-index: 199;
      }
      .content-bar {
        display: flex; align-items: center; padding: 0.625rem 1.25rem;
        background: white; border-bottom: 1px solid var(--border); flex-shrink: 0;
      }
      .mobile-open-btn {
        display: flex; flex-direction: column; justify-content: center; gap: 5px;
        width: 34px; height: 34px; padding: 6px;
        background: none; border: 1px solid var(--border); border-radius: 8px; cursor: pointer;
      }
      .ham-line { display: block; width: 100%; height: 2px; background: var(--text-main); border-radius: 2px; }
    }
  `,
})
export class AdminShellComponent {
  private readonly router = inject(Router);

  readonly collapsed = signal(window.innerWidth < 768);

  constructor() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd && window.innerWidth < 768) {
        this.collapsed.set(true);
      }
    });
  }

  toggleSidebar() { this.collapsed.update(v => !v); }

  onNavClick() {
    if (window.innerWidth < 768) this.collapsed.set(true);
  }
}
