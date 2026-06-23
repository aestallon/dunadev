import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="management-page container">
      <div class="form-card">
        <header class="form-header">
          <h1>Create New Event</h1>
          <p>Fill in the details below to publish a new event to the DunaDev calendar.</p>
        </header>

        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="event-form">
          <section class="form-section">
            <div class="form-group">
              <label for="title">Event Title *</label>
              <input id="title" type="text" formControlName="title" placeholder="e.g. Budapest JS Meetup #42" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Description (Hungarian)</label>
                <textarea formControlName="descriptionHu" placeholder="A meetup részletes leírása..." rows="4"></textarea>
              </div>
              <div class="form-group">
                <label>Description (English)</label>
                <textarea formControlName="descriptionEn" placeholder="Detailed description in English..." rows="4"></textarea>
              </div>
            </div>
          </section>

          <section class="form-section">
            <h3 class="section-title">Logistics</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="date">Date & Time *</label>
                <input id="date" type="datetime-local" formControlName="date" />
              </div>
              <div class="form-group">
                <label for="externalLink">External Link *</label>
                <input id="externalLink" type="url" formControlName="externalLink" placeholder="https://meetup.com/event/..." />
              </div>
            </div>
          </section>

          <section class="form-section" formGroupName="location">
            <h3 class="section-title">Location</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="locName">Venue Name *</label>
                <input id="locName" type="text" formControlName="name" placeholder="e.g. Google Ground" />
              </div>
              <div class="form-group">
                <label for="locLink">Google Maps Link *</label>
                <input id="locLink" type="url" formControlName="googleMapsLink" placeholder="https://goo.gl/maps/..." />
              </div>
            </div>
          </section>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="cancel()">Discard</button>
            <button type="submit" class="btn btn-primary" [disabled]="eventForm.invalid">Publish Event</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .management-page {
      padding: 4rem 0 6rem;
      background: var(--bg);
    }
    .form-card {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: var(--shadow-lg);
    }
    .form-header {
      margin-bottom: 3rem;
      text-align: center;
    }
    .form-header h1 {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }
    .form-header p {
      color: var(--text-muted);
    }
    .form-section {
      margin-bottom: 2.5rem;
    }
    .section-title {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--primary);
      margin-bottom: 1.5rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .section-title::after {
      content: '';
      flex-grow: 1;
      height: 1px;
      background: var(--border);
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 2rem;
      border-top: 1px solid var(--border);
    }
    .btn-primary:disabled {
      background-color: var(--border);
      color: var(--text-muted);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  `
})
export class ManagementComponent {
  private readonly fb = inject(FormBuilder);
  private readonly eventService = inject(EventService);
  private readonly router = inject(Router);

  eventForm = this.fb.group({
    title: ['', Validators.required],
    descriptionHu: [''],
    descriptionEn: [''],
    date: ['', Validators.required],
    externalLink: ['', [Validators.required, Validators.pattern('https?://.+')]],
    location: this.fb.group({
      name: ['', Validators.required],
      googleMapsLink: ['', [Validators.required, Validators.pattern('https?://.+')]],
    })
  });

  onSubmit() {
    if (this.eventForm.valid) {
      const val = this.eventForm.value;
      this.eventService.addEvent({
        title: val.title!,
        description: {
          hu: val.descriptionHu || undefined,
          en: val.descriptionEn || undefined,
        },
        date: new Date(val.date!),
        location: {
          name: val.location!.name!,
          googleMapsLink: val.location!.googleMapsLink!,
        },
        externalLink: val.externalLink!,
      });
      alert('Event created successfully!');
      this.router.navigate(['/']);
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
