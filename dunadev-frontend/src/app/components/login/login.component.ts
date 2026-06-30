import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../api/dunadev';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">D</div>
          <h1>{{ 'login.title' | translate }}</h1>
          <p>{{ 'login.subtitle' | translate }}</p>
        </div>

        @if (error()) {
          <div class="error-banner">{{ error() }}</div>
        }

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">{{ 'login.emailLabel' | translate }}</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              [placeholder]="'login.emailPlaceholder' | translate"
              required
              [disabled]="loading()"
            />
          </div>

          <div class="form-group">
            <label for="password">{{ 'login.passwordLabel' | translate }}</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              [disabled]="loading()"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary login-btn"
            [disabled]="loading() || !email || !password"
          >
            @if (loading()) {
              <span class="spinner"></span>
              {{ 'login.submitting' | translate }}
            } @else {
              {{ 'login.submitBtn' | translate }}
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: `
    .login-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      background: var(--bg);
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
    }
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .login-icon {
      width: 48px;
      height: 48px;
      background: var(--primary);
      color: white;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.5rem;
      margin-bottom: 1.25rem;
    }
    .login-header h1 {
      font-size: 1.5rem;
      margin-bottom: 0.375rem;
    }
    .login-header p {
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    .error-banner {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.8125rem;
      margin-bottom: 1.5rem;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .login-btn {
      width: 100%;
      padding: 0.75rem;
      font-size: 0.9375rem;
      margin-top: 0.5rem;
    }
    .login-btn:disabled {
      background-color: var(--border);
      color: var(--text-muted);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin-right: 0.5rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,
})
export class LoginComponent {
  private readonly authApi = inject(AuthenticationService);
  private readonly authService = inject(AuthService);
  private readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  onSubmit() {
    this.error.set(null);
    this.loading.set(true);

    this.authApi.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.authService.storeTokens(response);
        this.loading.set(false);
        const dest = response.role === 'ADMIN' ? '/admin/upcoming' : '/manage/events';
        this.router.navigate([dest]);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.error.set(this.i18n.t('login.invalidCredentials'));
        } else {
          this.error.set(this.i18n.t('login.genericError'));
        }
      },
    });
  }
}
