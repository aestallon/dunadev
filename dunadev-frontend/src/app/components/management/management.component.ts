import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrganiserProfileService } from '../../../api/dunadev';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="manage-layout" [class.sidebar-collapsed]="collapsed()">

      <!-- ===== Sidebar ===== -->
      <aside class="sidebar">
        <nav class="sidebar-nav">

          @if (authService.isOrganiser()) {
            <a routerLink="profile" routerLinkActive="nav-active" (click)="onNavClick()"
               [title]="orgName()">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span class="nav-text">
                @if (loadingProfile()) {
                  <span class="nav-sk"></span>
                } @else {
                  {{ orgName() }}
                }
              </span>
            </a>
          }

          <a routerLink="events" routerLinkActive="nav-active" (click)="onNavClick()" title="Events">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span class="nav-text">Events</span>
          </a>

          <a routerLink="locations" routerLinkActive="nav-active" (click)="onNavClick()" title="Locations">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span class="nav-text">Locations</span>
          </a>

          @if (authService.isAdmin()) {
            <span class="nav-disabled" title="Administration">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span class="nav-text">
                Administration
                <span class="soon-badge">Soon</span>
              </span>
            </span>
          }

        </nav>

        <!-- Footer: role chip + collapse toggle -->
        <div class="sidebar-footer">
          <div class="sidebar-role">
            <span class="role-chip">{{ authService.role() }}</span>
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

      <!-- Mobile backdrop -->
      @if (!collapsed()) {
        <div class="sidebar-backdrop" (click)="toggleSidebar()"></div>
      }

      <!-- ===== Content area ===== -->
      <div class="manage-content">
        <!-- Mobile-only open button -->
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
    /* ===== Layout ===== */
    .manage-layout {
      display: flex;
      min-height: calc(100vh - 57px);
    }

    /* ===== Sidebar ===== */
    .sidebar {
      width: 240px;
      flex-shrink: 0;
      background: white;
      border-right: 1px solid var(--border);
      position: sticky;
      top: 57px;
      height: calc(100vh - 57px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: width 0.25s ease;
      z-index: 50;
    }

    /* ===== Nav ===== */
    .sidebar-nav {
      flex: 1;
      padding: 0.75rem 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      overflow: hidden;
    }

    .sidebar-nav a,
    .nav-disabled {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-muted);
      text-decoration: none;
      transition: background 0.15s, color 0.15s;
      white-space: nowrap;
      overflow: hidden;
    }
    .sidebar-nav a:hover {
      color: var(--primary);
      background: rgba(37, 99, 235, 0.06);
    }
    .sidebar-nav a.nav-active {
      color: var(--primary);
      background: rgba(37, 99, 235, 0.09);
      font-weight: 600;
    }
    .nav-disabled {
      cursor: default;
      color: var(--border);
    }

    /* Icon */
    .nav-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    /* Text label */
    .nav-text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 0;
      flex: 1;
      overflow: hidden;
      transition: opacity 0.15s;
    }

    /* Soon badge */
    .soon-badge {
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: var(--bg);
      color: var(--secondary);
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      border: 1px solid var(--border);
      flex-shrink: 0;
    }

    /* Loading skeleton for org name */
    .nav-sk {
      display: inline-block;
      width: 90px;
      height: 11px;
      background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* ===== Sidebar footer ===== */
    .sidebar-footer {
      border-top: 1px solid var(--border);
      padding: 0.5rem 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      flex-shrink: 0;
    }
    .sidebar-role {
      padding: 0.25rem 0.75rem;
      overflow: hidden;
    }
    .role-chip {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--primary);
      background: rgba(37, 99, 235, 0.08);
      padding: 0.2rem 0.625rem;
      border-radius: 9999px;
      white-space: nowrap;
    }
    .collapse-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 8px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      transition: background 0.15s, color 0.15s;
    }
    .collapse-btn:hover {
      background: var(--bg);
      color: var(--text-main);
    }
    .collapse-chevron {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      transition: transform 0.25s ease;
    }

    /* ===== Mobile backdrop ===== */
    .sidebar-backdrop {
      display: none;
    }

    /* ===== Content area ===== */
    .manage-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    /* Mobile-only open button — hidden on desktop */
    .content-bar {
      display: none;
    }

    /* ===== DESKTOP collapsed state ===== */
    @media (min-width: 768px) {
      .sidebar-collapsed .sidebar {
        width: 56px;
      }

      /* Hide text labels, show icons centered */
      .sidebar-collapsed .sidebar .nav-text {
        opacity: 0;
        pointer-events: none;
      }
      .sidebar-collapsed .sidebar .sidebar-nav a,
      .sidebar-collapsed .sidebar .nav-disabled {
        justify-content: center;
        padding: 0.625rem;
        gap: 0;
      }
      .sidebar-collapsed .sidebar .sidebar-role {
        display: none;
      }
      .sidebar-collapsed .sidebar .collapse-btn {
        justify-content: center;
        padding: 0.625rem;
        gap: 0;
      }
      /* Flip chevron to point right (→ expand) */
      .sidebar-collapsed .sidebar .collapse-chevron {
        transform: rotate(180deg);
      }
    }

    /* ===== MOBILE ===== */
    @media (max-width: 767px) {
      /* Sidebar becomes a fixed overlay, always full-width */
      .sidebar {
        position: fixed;
        top: 57px;
        left: 0;
        height: calc(100vh - 57px);
        width: 272px !important;
        overflow-y: auto;
        overflow-x: hidden;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
        z-index: 200;
        box-shadow: var(--shadow-lg);
      }
      /* Show when NOT collapsed */
      .manage-layout:not(.sidebar-collapsed) .sidebar {
        transform: translateX(0);
      }

      /* Backdrop covers content behind the open sidebar */
      .sidebar-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        top: 57px;
        background: rgba(15, 23, 42, 0.35);
        z-index: 199;
      }

      /* Show mobile open button in content bar */
      .content-bar {
        display: flex;
        align-items: center;
        padding: 0.625rem 1.25rem;
        background: white;
        border-bottom: 1px solid var(--border);
        flex-shrink: 0;
      }

      /* Mobile open button */
      .mobile-open-btn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        width: 34px;
        height: 34px;
        padding: 6px;
        background: none;
        border: 1px solid var(--border);
        border-radius: 8px;
        cursor: pointer;
      }
      .ham-line {
        display: block;
        width: 100%;
        height: 2px;
        background: var(--text-main);
        border-radius: 2px;
      }
    }
  `,
})
export class ManagementComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly profileService = inject(OrganiserProfileService);
  private readonly router = inject(Router);

  readonly collapsed = signal(window.innerWidth < 768);
  readonly orgName = signal('My Organisation');
  readonly loadingProfile = signal(true);

  constructor() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd && window.innerWidth < 768) {
        this.collapsed.set(true);
      }
    });
  }

  ngOnInit() {
    if (this.authService.isOrganiser()) {
      this.profileService.getMyOrganiserProfile().subscribe({
        next: profile => {
          this.orgName.set(profile.name);
          this.loadingProfile.set(false);
        },
        error: () => this.loadingProfile.set(false),
      });
    } else {
      this.loadingProfile.set(false);
    }
  }

  toggleSidebar() {
    this.collapsed.update(v => !v);
  }

  onNavClick() {
    if (window.innerWidth < 768) {
      this.collapsed.set(true);
    }
  }
}
