import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a class="logo" routerLink="/" (click)="closeMenu()">
          <span class="logo-icon">D</span>
          <span class="logo-text">DunaDev</span>
        </a>

        <!-- Desktop links -->
        <div class="nav-links">
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
          @if (auth.isLoggedIn()) {
            <a routerLink="/manage" routerLinkActive="active" class="nav-dashboard">
              <span class="nav-user-dot"></span>
              Dashboard
            </a>
            <button class="btn btn-secondary btn-sm" (click)="logout()">Sign out</button>
          } @else {
            <a routerLink="/login" routerLinkActive="active" class="btn btn-primary btn-sm nav-signin">
              Sign in
            </a>
          }
        </div>

        <!-- Hamburger button (mobile only) -->
        <button class="hamburger" (click)="toggleMenu()" [attr.aria-expanded]="menuOpen()"
                aria-label="Toggle navigation menu">
          <span class="ham-bar" [class.open]="menuOpen()"></span>
          <span class="ham-bar" [class.open]="menuOpen()"></span>
          <span class="ham-bar" [class.open]="menuOpen()"></span>
        </button>
      </div>

      <!-- Mobile dropdown -->
      @if (menuOpen()) {
        <div class="mobile-menu">
          <a routerLink="/about" routerLinkActive="mobile-active" (click)="closeMenu()">About</a>
          <a routerLink="/contact" routerLinkActive="mobile-active" (click)="closeMenu()">Contact</a>
          @if (auth.isLoggedIn()) {
            <a routerLink="/manage" routerLinkActive="mobile-active" class="mobile-dashboard"
               (click)="closeMenu()">
              <span class="nav-user-dot"></span>
              Dashboard
            </a>
            <button class="btn btn-secondary mobile-signout" (click)="logout()">Sign out</button>
          } @else {
            <a routerLink="/login" routerLinkActive="mobile-active" class="btn btn-primary mobile-signin"
               (click)="closeMenu()">Sign in</a>
          }
        </div>
        <div class="mobile-backdrop" (click)="closeMenu()"></div>
      }
    </nav>

    <main class="content">
      <router-outlet />
    </main>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-brand">
            <span class="footer-logo-icon">D</span>
            <span class="footer-name">DunaDev</span>
          </div>
          <p class="footer-tagline">Budapest's tech event calendar — never miss a meetup.</p>
        </div>
        <nav class="footer-links">
          <a routerLink="/">Events</a>
          <a routerLink="/about">About</a>
          <a routerLink="/contact">Contact</a>
        </nav>
        <p class="footer-copy">&copy; {{ year }} DunaDev. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: `
    /* --- Navbar --- */
    .navbar {
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 0.75rem 0;
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }
    .logo-icon {
      background: var(--primary);
      color: white;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-weight: 800;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
    }

    /* Desktop links */
    .nav-links {
      display: flex;
      gap: 0.25rem;
      align-items: center;
    }
    .nav-links a {
      color: var(--text-muted);
      font-weight: 500;
      padding: 0.5rem 0.875rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      text-decoration: none;
    }
    .nav-links a:hover {
      color: var(--primary);
      background: var(--bg);
    }
    .nav-links a.active {
      color: var(--primary) !important;
      background: rgba(37, 99, 235, 0.08);
    }
    .nav-dashboard {
      border: 1px solid var(--border);
      display: flex !important;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-user-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      flex-shrink: 0;
    }
    .nav-signin {
      padding: 0.5rem 1.125rem !important;
      color: white !important;
      background: var(--primary);
      border: none !important;
    }
    .nav-signin:hover {
      background: var(--primary-hover) !important;
      color: white !important;
    }

    /* Hamburger button */
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 36px;
      height: 36px;
      padding: 6px;
      background: none;
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      transition: var(--transition);
    }
    .hamburger:hover {
      background: var(--bg);
    }
    .ham-bar {
      display: block;
      width: 100%;
      height: 2px;
      background: var(--text-main);
      border-radius: 2px;
      transform-origin: center;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }
    /* Animate bars into an X when open */
    .ham-bar:nth-child(1).open { transform: translateY(7px) rotate(45deg); }
    .ham-bar:nth-child(2).open { opacity: 0; transform: scaleX(0); }
    .ham-bar:nth-child(3).open { transform: translateY(-7px) rotate(-45deg); }

    /* Mobile dropdown */
    .mobile-menu {
      display: flex;
      flex-direction: column;
      padding: 0.75rem 1.25rem 1rem;
      border-top: 1px solid var(--border);
      gap: 0.25rem;
      background: rgba(255, 255, 255, 0.98);
      position: relative;
      z-index: 101;
    }
    .mobile-menu a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      font-weight: 500;
      font-size: 1rem;
      padding: 0.75rem 0.875rem;
      border-radius: 8px;
      text-decoration: none;
      transition: var(--transition);
    }
    .mobile-menu a.mobile-active {
      color: var(--primary);
      background: rgba(37, 99, 235, 0.08);
    }
    .mobile-dashboard {
      border: 1px solid var(--border);
    }
    .mobile-signin {
      justify-content: center;
      color: white !important;
      margin-top: 0.25rem;
    }
    .mobile-signout {
      width: 100%;
      margin-top: 0.25rem;
      justify-content: center;
    }

    /* Transparent backdrop to close menu on outside click */
    .mobile-backdrop {
      position: fixed;
      inset: 0;
      z-index: 99;
    }

    /* --- Content area --- */
    .content {
      min-height: calc(100vh - 57px - 180px);
    }

    /* --- Footer --- */
    .footer {
      background: #0f172a;
      padding: 3rem 1.5rem 2rem;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      text-align: center;
    }
    .footer-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.625rem;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .footer-logo-icon {
      background: var(--primary);
      color: white;
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 7px;
      font-weight: 800;
      font-size: 0.875rem;
    }
    .footer-name {
      font-size: 1.125rem;
      font-weight: 700;
      color: white;
    }
    .footer-tagline {
      font-size: 0.875rem;
      color: #64748b;
    }
    .footer-links {
      display: flex;
      gap: 2rem;
    }
    .footer-links a {
      color: #94a3b8;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.15s;
    }
    .footer-links a:hover {
      color: white;
    }
    .footer-copy {
      font-size: 0.8125rem;
      color: #334155;
    }

    /* --- Responsive breakpoint --- */
    @media (max-width: 640px) {
      .nav-links { display: none; }
      .hamburger { display: flex; }
    }
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly year = new Date().getFullYear();
  readonly menuOpen = signal(false);

  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.menuOpen.set(false);
      }
    });
  }

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.auth.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
