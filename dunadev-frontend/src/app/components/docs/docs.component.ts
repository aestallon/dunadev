import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-docs',
  standalone: true,
  template: `
    <div class="docs-page">
      <div class="docs-header">
        <h1>Documentation</h1>
        <p class="docs-subtitle">Reference materials for DunaDev {{ isAdmin() ? 'administrators' : 'organisers' }}.</p>
      </div>

      <div class="docs-grid">

        <div class="doc-card">
          <div class="doc-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="doc-body">
            <h2 class="doc-title">Functional Specification</h2>
            <p class="doc-desc">
              Full description of DunaDev's features, business rules, and intended behaviour.
              Intended for anyone who wants a deep understanding of how the system works.
            </p>
            <div class="doc-footer">
              <span class="coming-soon-badge">Coming Soon</span>
            </div>
          </div>
        </div>

        <div class="doc-card">
          <div class="doc-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="doc-body">
            <h2 class="doc-title">{{ isAdmin() ? 'Administrator' : 'Organiser' }} User Manual</h2>
            <p class="doc-desc">
              Step-by-step guide covering everything
              {{ isAdmin()
                ? 'administrators need to manage organisers, events, and system configuration.'
                : 'organisers need to create and manage events and locations on DunaDev.' }}
            </p>
            <div class="doc-footer">
              <span class="coming-soon-badge">Coming Soon</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: `
    .docs-page {
      padding: 2rem 2rem 4rem;
      max-width: 860px;
    }

    .docs-header {
      margin-bottom: 2rem;
    }
    .docs-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.375rem;
      color: var(--text-main);
    }
    .docs-subtitle {
      font-size: 0.9375rem;
      color: var(--text-muted);
      margin: 0;
    }

    .docs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .doc-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      transition: box-shadow 0.15s;
    }
    .doc-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.07);
    }

    .doc-icon {
      width: 44px;
      height: 44px;
      background: rgba(37, 99, 235, 0.07);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .doc-icon svg {
      width: 22px;
      height: 22px;
      color: var(--primary);
    }

    .doc-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }
    .doc-title {
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-main);
    }
    .doc-desc {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0;
      flex: 1;
    }

    .doc-footer {
      padding-top: 0.75rem;
      border-top: 1px solid var(--border);
      margin-top: 0.25rem;
    }

    .coming-soon-badge {
      display: inline-flex;
      align-items: center;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #d97706;
      background: #fef3c7;
      border: 1px solid #fde68a;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
    }
  `,
})
export class DocsComponent {
  private readonly authService = inject(AuthService);

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
