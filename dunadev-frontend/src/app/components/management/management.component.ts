import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="manage-page">
      <div class="container">
        <header class="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>
              Signed in as
              <span class="role-badge">{{ authService.role() }}</span>
            </p>
          </div>
          <button class="btn btn-secondary" (click)="logout()">Sign out</button>
        </header>

        <div class="dashboard-grid">
          <a routerLink="/manage/events" class="dash-card dash-card-link">
            <div class="dash-card-icon events-icon"></div>
            <h3>My Events</h3>
            <p>Create, edit, cancel, or reschedule your events.</p>
            <span class="dash-card-action">Manage &rarr;</span>
          </a>

          <a routerLink="/manage/locations" class="dash-card dash-card-link">
            <div class="dash-card-icon locations-icon"></div>
            <h3>Locations</h3>
            <p>Manage your saved venues for quick event setup.</p>
            <span class="dash-card-action">Manage &rarr;</span>
          </a>

          @if (authService.isAdmin()) {
            <div class="dash-card">
              <div class="dash-card-icon admin-icon"></div>
              <h3>Administration</h3>
              <p>Manage all organisers, events, and user accounts.</p>
              <span class="dash-card-status">Coming soon</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .manage-page {
      padding: 3rem 0 6rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 3rem;
    }
    .page-header h1 {
      font-size: 2rem;
      margin-bottom: 0.375rem;
    }
    .page-header p {
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    .role-badge {
      display: inline-block;
      background: rgba(37, 99, 235, 0.1);
      color: var(--primary);
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .dash-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 2rem;
      transition: var(--transition);
      position: relative;
    }
    .dash-card:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow);
    }
    .dash-card-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      margin-bottom: 1.25rem;
    }
    .events-icon {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    }
    .locations-icon {
      background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    }
    .admin-icon {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
    }
    .dash-card h3 {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }
    .dash-card p {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 1rem;
    }
    .dash-card-status {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .dash-card-link {
      text-decoration: none;
      color: inherit;
      display: block;
      cursor: pointer;
    }
    .dash-card-action {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--primary);
    }
  `,
})
export class ManagementComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
