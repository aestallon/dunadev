import { Component, inject, signal, computed, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../api/dunadev';

interface PasswordRule {
  label: string;
  passed: Signal<boolean>;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page">
      <div class="card">
        <h1 class="page-title">Change Password</h1>

        @if (success()) {
          <div class="banner success-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" class="banner-icon">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Password changed successfully. You can continue working.
          </div>
        }

        @if (serverError()) {
          <div class="banner error-banner">{{ serverError() }}</div>
        }

        <form (ngSubmit)="submit()" class="form" autocomplete="off">

          <div class="form-group">
            <label for="current">Current password</label>
            <input id="current" type="password"
                   [ngModel]="current()" (ngModelChange)="current.set($event)"
                   name="current" autocomplete="current-password"
                   placeholder="Enter your current password"
                   [disabled]="saving()">
          </div>

          <div class="form-group">
            <label for="newPwd">New password</label>
            <input id="newPwd" type="password"
                   [ngModel]="newPwd()" (ngModelChange)="newPwd.set($event)"
                   name="newPwd" autocomplete="new-password"
                   placeholder="Choose a new password"
                   [disabled]="saving()">

            @if (newPwd().length > 0) {
              <ul class="rules-list">
                @for (rule of passwordRules; track rule.label) {
                  <li class="rule" [class.rule-ok]="rule.passed()" [class.rule-fail]="!rule.passed()">
                    <svg class="rule-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      @if (rule.passed()) {
                        <polyline points="20 6 9 17 4 12"/>
                      } @else {
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      }
                    </svg>
                    {{ rule.label }}
                  </li>
                }
              </ul>
            }
          </div>

          <div class="form-group">
            <label for="confirm">Confirm new password</label>
            <input id="confirm" type="password"
                   [ngModel]="confirm()" (ngModelChange)="confirm.set($event)"
                   name="confirm" autocomplete="new-password"
                   placeholder="Repeat your new password"
                   [disabled]="saving()">
            @if (confirm().length > 0 && !passwordsMatch()) {
              <span class="mismatch-hint">Passwords do not match.</span>
            }
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary"
                    [disabled]="saving() || !canSubmit()">
              @if (saving()) { <span class="spinner"></span> Saving… }
              @else { Change Password }
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: `
    .page { padding: 2rem 1.5rem 6rem; }
    .card {
      max-width: 480px; margin: 0 auto;
      background: white; border: 1px solid var(--border);
      border-radius: var(--radius); padding: 2rem;
    }
    .page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 1.75rem; }

    .form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    label { font-size: 0.8125rem; font-weight: 600; }
    input[type='password'] {
      padding: 0.5rem 0.75rem; border: 1px solid var(--border);
      border-radius: calc(var(--radius) - 2px); font-size: 0.875rem;
      background: white; width: 100%; box-sizing: border-box;
      transition: border-color 0.15s;
    }
    input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    input:disabled { background: var(--bg); cursor: not-allowed; }

    .rules-list { list-style: none; margin: 0.625rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.3rem; }
    .rule { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8125rem; transition: color 0.15s; }
    .rule-ok   { color: #059669; }
    .rule-fail { color: var(--text-muted); }
    .rule-icon { width: 13px; height: 13px; flex-shrink: 0; }

    .mismatch-hint { font-size: 0.75rem; color: #dc2626; }

    .form-actions { padding-top: 0.25rem; }

    .banner {
      display: flex; align-items: flex-start; gap: 0.625rem;
      border-radius: calc(var(--radius) - 2px); padding: 0.875rem 1rem;
      font-size: 0.875rem; margin-bottom: 1.5rem;
    }
    .banner-icon { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }
    .success-banner { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .error-banner   { background: #fee2e2; color: #dc2626;  border: 1px solid #fca5a5; }

    .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 0.375rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,
})
export class ChangePasswordComponent {
  private readonly accountService = inject(AccountService);

  readonly current = signal('');
  readonly newPwd  = signal('');
  readonly confirm = signal('');

  readonly saving      = signal(false);
  readonly success     = signal(false);
  readonly serverError = signal<string | null>(null);

  private readonly ruleMinLength = computed(() => this.newPwd().length >= 8);
  private readonly ruleHasDigit  = computed(() => /\d/.test(this.newPwd()));
  private readonly ruleHasUpper  = computed(() => /[A-Z]/.test(this.newPwd()));
  private readonly ruleHasLower  = computed(() => /[a-z]/.test(this.newPwd()));

  readonly passwordRules: PasswordRule[] = [
    { label: 'At least 8 characters',        passed: this.ruleMinLength },
    { label: 'Contains a number',             passed: this.ruleHasDigit  },
    { label: 'Contains an uppercase letter',  passed: this.ruleHasUpper  },
    { label: 'Contains a lowercase letter',   passed: this.ruleHasLower  },
  ];

  readonly passwordsMatch = computed(() => this.newPwd() === this.confirm());

  readonly canSubmit = computed(() =>
    this.current().length > 0 &&
    this.ruleMinLength() && this.ruleHasDigit() && this.ruleHasUpper() && this.ruleHasLower() &&
    this.passwordsMatch() && this.confirm().length > 0
  );

  submit() {
    if (!this.canSubmit()) return;
    this.saving.set(true);
    this.serverError.set(null);
    this.success.set(false);

    this.accountService.changePassword({ currentPassword: this.current(), newPassword: this.newPwd() })
      .subscribe({
        next: () => {
          this.success.set(true);
          this.current.set('');
          this.newPwd.set('');
          this.confirm.set('');
          this.saving.set(false);
        },
        error: err => {
          this.serverError.set(
            err?.status === 400
              ? 'Current password is incorrect.'
              : 'Something went wrong. Please try again.'
          );
          this.saving.set(false);
        },
      });
  }
}
