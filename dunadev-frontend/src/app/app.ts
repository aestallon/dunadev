import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a class="logo" routerLink="/">
          <span class="logo-icon">D</span>
          <span class="logo-text">DunaDev</span>
        </a>
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
      </div>
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
      color: var(--primary);
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
    .btn-sm {
      padding: 0.4375rem 1rem;
      font-size: 0.875rem;
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
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly year = new Date().getFullYear();

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
