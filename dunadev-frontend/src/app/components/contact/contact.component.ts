import { Component } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="contact-page">
      <div class="container">
        <header class="page-header">
          <span class="eyebrow">{{ 'contact.eyebrow' | translate }}</span>
          <h1>{{ 'contact.title' | translate }}</h1>
          <p class="lead">{{ 'contact.lead' | translate }}</p>
        </header>

        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-icon email-icon"></div>
            <h3>{{ 'contact.emailCard.title' | translate }}</h3>
            <p>{{ 'contact.emailCard.body' | translate }}</p>
            <a href="https://github.com/aestallon" class="contact-link">https://github.com/aestallon</a>
          </div>

          <div class="contact-card">
            <div class="contact-icon events-icon"></div>
            <h3>{{ 'contact.submitCard.title' | translate }}</h3>
            <p>{{ 'contact.submitCard.body' | translate }}</p>
            <a href="https://github.com/aestallon" class="contact-link">https://github.com/aestallon</a>
          </div>

          <div class="contact-card">
            <div class="contact-icon report-icon"></div>
            <h3>{{ 'contact.reportCard.title' | translate }}</h3>
            <p>{{ 'contact.reportCard.body' | translate }}</p>
            <a href="https://github.com/aestallon/dunadev-tracker" class="contact-link">https://github.com/aestallon/dunadev-tracker</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .contact-page {
      padding: 5rem 0 6rem;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .page-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    .eyebrow {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary);
      margin-bottom: 1rem;
    }
    .page-header h1 {
      font-size: 2.5rem;
      margin-bottom: 1.25rem;
      line-height: 1.15;
    }
    .lead {
      font-size: 1.125rem;
      color: var(--text-muted);
      line-height: 1.7;
      max-width: 560px;
      margin: 0 auto;
    }
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }
    .contact-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 2rem;
    }
    .contact-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      margin-bottom: 1.25rem;
    }
    .email-icon { background: linear-gradient(135deg, #dbeafe, #bfdbfe); }
    .events-icon { background: linear-gradient(135deg, #d1fae5, #a7f3d0); }
    .report-icon { background: linear-gradient(135deg, #fce7f3, #fbcfe8); }
    .contact-card h3 {
      font-size: 1.0625rem;
      margin-bottom: 0.625rem;
    }
    .contact-card p {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 1.25rem;
    }
    .contact-link {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--primary);
    }
    .contact-link:hover { text-decoration: underline; }
  `,
})
export class ContactComponent {}
