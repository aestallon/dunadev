import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <nav class="navbar">
    <div class="nav-container">
      <div class="logo" routerLink="/">
        <span class="logo-icon">D</span>
        <span class="logo-text">DunaDev</span>
      </div>
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Events</a>
        <a routerLink="/calendar" routerLinkActive="active">Calendar</a>
        <a routerLink="/manage" routerLinkActive="active" class="nav-cta">Organisers</a>
      </div>
    </div>
  </nav>
  <main class="content">
    <router-outlet />
  </main>`,
  styles: `
  .navbar {
    background: white;
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
    cursor: pointer;
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
  }
  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-main);
  }
  .nav-links {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .nav-links a {
    color: var(--text-muted);
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.9375rem;
  }
  .nav-links a:hover {
    color: var(--primary);
    background: var(--bg);
  }
  .nav-links a.active {
    color: var(--primary);
    background: rgba(37, 99, 235, 0.08);
  }
  .nav-cta {
    border: 1px solid var(--border);
  }
  .content {
    min-height: calc(100vh - 64px);
  }
  `
})
export class App {
  protected readonly title = signal('dunadev-frontend');
}
