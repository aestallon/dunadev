import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicEventsService, EventSummary, EventStatus } from '../../../api/dunadev';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="landing-page">
      <header class="hero">
        <div class="hero-content">
          <h1>Discover Budapest's <span class="text-gradient">Tech Community</span></h1>
          <p>
            Join local meetups, workshops, and conferences. Stay connected with fellow developers in
            the heart of Hungary.
          </p>
        </div>
      </header>

      <div class="container">
        <!-- Hero cards: next upcoming events -->
        <section class="upcoming-section">
          <div class="section-header">
            <h2>Coming Up Next</h2>
          </div>

          @if (loadingUpcoming()) {
            <div class="loading-grid">
              @for (i of [1, 2, 3]; track i) {
                <div class="skeleton-card">
                  <div class="skeleton-line short"></div>
                  <div class="skeleton-line"></div>
                  <div class="skeleton-line medium"></div>
                </div>
              }
            </div>
          } @else if (upcomingEvents().length === 0) {
            <div class="empty-state">
              <p>No upcoming events at the moment. Check back later!</p>
            </div>
          } @else {
            <div class="event-grid">
              @for (event of upcomingEvents(); track event.id) {
                <div class="event-card">
                  <div class="event-card-header">
                    <span class="event-badge">{{ statusLabel(event) }}</span>
                    <span class="event-date">{{ event.startsAt | date: 'MMM d, y' }}</span>
                  </div>
                  <h3>{{ event.title }}</h3>
                  <div class="event-info">
                    <div class="info-item">
                      <span class="info-icon organiser-icon"></span>
                      <span>{{ event.organiser.name }}</span>
                    </div>
                    @if (event.location) {
                      <div class="info-item">
                        <span class="info-icon location-icon"></span>
                        <span>{{ event.location.name }}@if (event.location.city) {, {{ event.location.city }}}</span>
                      </div>
                    }
                    <div class="info-item">
                      <span class="info-icon time-icon"></span>
                      <span>{{ event.startsAt | date: 'HH:mm' }}@if (event.endsAt) { &ndash; {{ event.endsAt | date: 'HH:mm' }}}</span>
                    </div>
                    @if (!event.free) {
                      <div class="info-item">
                        <span class="info-icon paid-icon"></span>
                        <span>Paid event</span>
                      </div>
                    }
                  </div>
                  @if (event.description) {
                    <div class="event-description">
                      <p>{{ event.description }}</p>
                    </div>
                  }
                  <div class="event-footer">
                    @if (event.registrationRequired && event.registrationUrl) {
                      <a [href]="event.registrationUrl" target="_blank" rel="noopener"
                         class="btn btn-primary btn-sm full-width">Register</a>
                    } @else if (event.eventUrl) {
                      <a [href]="event.eventUrl" target="_blank" rel="noopener"
                         class="btn btn-primary btn-sm full-width">View Details</a>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </section>

        <!-- Monthly event list -->
        <section class="monthly-section">
          <div class="section-header">
            <h2>{{ monthLabel() }}</h2>
            <div class="month-nav">
              <button class="btn btn-secondary btn-icon" (click)="prevMonth()"
                      [disabled]="!canGoPrev()">
                <span class="chevron-left"></span>
              </button>
              <button class="btn btn-secondary btn-sm" (click)="goToCurrentMonth()">Today</button>
              <button class="btn btn-secondary btn-icon" (click)="nextMonth()">
                <span class="chevron-right"></span>
              </button>
              <div class="view-toggle">
                <button class="toggle-btn" [class.active]="viewMode() === 'list'"
                        (click)="viewMode.set('list')">List</button>
                <button class="toggle-btn" [class.active]="viewMode() === 'calendar'"
                        (click)="viewMode.set('calendar')">Calendar</button>
              </div>
            </div>
          </div>

          @if (loadingMonthly()) {
            <div class="loading-timeline">
              @for (i of [1, 2, 3]; track i) {
                <div class="skeleton-timeline-item">
                  <div class="skeleton-date-box"></div>
                  <div class="skeleton-content">
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (monthlyEvents().length === 0) {
            <div class="empty-state">
              <p>No events scheduled for {{ monthLabel() }}.</p>
            </div>
          } @else if (viewMode() === 'list') {
            <div class="event-timeline">
              @for (event of monthlyEvents(); track event.id) {
                <div class="timeline-item" [class.cancelled]="event.status === cancelledStatus">
                  <div class="timeline-date">
                    <span class="day">{{ event.startsAt | date: 'd' }}</span>
                    <span class="month">{{ event.startsAt | date: 'EEE' }}</span>
                  </div>
                  <div class="timeline-content">
                    <div class="event-meta">
                      <span class="meta-item time-meta">{{ event.startsAt | date: 'HH:mm' }}@if (event.endsAt) { &ndash; {{ event.endsAt | date: 'HH:mm' }}}</span>
                      @if (event.location) {
                        <span class="meta-item location-meta">{{ event.location.name }}</span>
                      }
                      <span class="meta-item organiser-meta">{{ event.organiser.name }}</span>
                      @if (!event.free) {
                        <span class="meta-item paid-meta">Paid</span>
                      }
                    </div>
                    <h3>{{ event.title }}</h3>
                    @if (event.description) {
                      <p class="timeline-description">{{ event.description }}</p>
                    }
                    <div class="timeline-actions">
                      @if (event.registrationRequired && event.registrationUrl) {
                        <a [href]="event.registrationUrl" target="_blank" rel="noopener"
                           class="link-btn">Register &rarr;</a>
                      } @else if (event.eventUrl) {
                        <a [href]="event.eventUrl" target="_blank" rel="noopener"
                           class="link-btn">View Details &rarr;</a>
                      }
                      @if (event.links && event.links.length > 0) {
                        @for (link of event.links; track link.url) {
                          <a [href]="link.url" target="_blank" rel="noopener"
                             class="link-btn link-btn-secondary">{{ link.label }}</a>
                        }
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <!-- Calendar grid view -->
            <div class="calendar-grid">
              <div class="calendar-header-row">
                @for (day of weekDays; track day) {
                  <div class="calendar-header-cell">{{ day }}</div>
                }
              </div>
              <div class="calendar-body">
                @for (week of calendarWeeks(); track $index) {
                  <div class="calendar-week">
                    @for (cell of week; track $index) {
                      <div class="calendar-cell" [class.other-month]="!cell.currentMonth"
                           [class.today]="cell.isToday">
                        <span class="cell-day">{{ cell.day }}</span>
                        @for (event of cell.events; track event.id) {
                          <div class="calendar-event"
                               [class.cancelled]="event.status === cancelledStatus"
                               [title]="event.title">
                            <span class="calendar-event-time">{{ event.startsAt | date: 'HH:mm' }}</span>
                            <span class="calendar-event-title">{{ event.title }}</span>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </section>

        <section class="cta-banner">
          <div class="cta-content">
            <h2>Are you an organiser?</h2>
            <p>
              Get access to our management tools and share your events with the DunaDev community.
            </p>
            <a routerLink="/manage" class="btn btn-primary">Manage your events</a>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: `
    .landing-page {
      padding-bottom: 5rem;
    }

    /* --- Hero --- */
    .hero {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      padding: 5rem 1.5rem;
      text-align: center;
      margin-bottom: 3rem;
    }
    .hero-content {
      max-width: 720px;
      margin: 0 auto;
    }
    .hero h1 {
      font-size: 3rem;
      line-height: 1.1;
      margin-bottom: 1.25rem;
    }
    .text-gradient {
      background: linear-gradient(to right, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p {
      font-size: 1.125rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    /* --- Layout --- */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    /* --- Upcoming event cards --- */
    .event-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 4rem;
    }
    .event-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      transition: var(--transition);
      box-shadow: var(--shadow-sm);
    }
    .event-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }
    .event-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .event-badge {
      background: rgba(37, 99, 235, 0.1);
      color: var(--primary);
      padding: 0.2rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    .event-date {
      font-size: 0.8125rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .event-card h3 {
      font-size: 1.125rem;
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }
    .event-info {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }
    .info-icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      background-size: contain;
      background-repeat: no-repeat;
      opacity: 0.5;
    }
    .organiser-icon {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpath d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='9' cy='7' r='4'/%3E%3C/svg%3E");
    }
    .location-icon {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E");
    }
    .time-icon {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpolyline points='12 6 12 12 16 14'/%3E%3C/svg%3E");
    }
    .paid-icon {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cline x1='12' y1='1' x2='12' y2='23'/%3E%3Cpath d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E");
    }
    .event-description {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
      flex-grow: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .event-footer {
      margin-top: auto;
    }
    .full-width { width: 100%; }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.8125rem; }

    /* --- Month nav --- */
    .month-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-icon {
      padding: 0.5rem 0.625rem;
      line-height: 1;
    }
    .chevron-left, .chevron-right {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-top: 2px solid var(--text-muted);
      border-right: 2px solid var(--text-muted);
    }
    .chevron-left { transform: rotate(-135deg); }
    .chevron-right { transform: rotate(45deg); }
    .view-toggle {
      display: flex;
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      margin-left: 0.5rem;
    }
    .toggle-btn {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      background: white;
      color: var(--text-muted);
      transition: var(--transition);
    }
    .toggle-btn.active {
      background: var(--primary);
      color: white;
    }

    /* --- Monthly section --- */
    .monthly-section {
      margin-bottom: 4rem;
    }

    /* --- Timeline (list view) --- */
    .event-timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .timeline-item {
      display: flex;
      gap: 1.5rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.25rem;
      transition: var(--transition);
    }
    .timeline-item:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow);
    }
    .timeline-item.cancelled {
      opacity: 0.55;
    }
    .timeline-item.cancelled h3 {
      text-decoration: line-through;
    }
    .timeline-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      border-radius: 10px;
      min-width: 64px;
      height: 64px;
      border: 1px solid var(--border);
      flex-shrink: 0;
    }
    .timeline-date .day {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary);
      line-height: 1;
    }
    .timeline-date .month {
      font-size: 0.6875rem;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--text-muted);
      margin-top: 0.125rem;
    }
    .timeline-content {
      flex-grow: 1;
      min-width: 0;
    }
    .event-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .time-meta::before { content: '\\1F552 '; font-size: 0.75rem; }
    .location-meta::before { content: '\\1F4CD '; font-size: 0.75rem; }
    .organiser-meta::before { content: '\\1F465 '; font-size: 0.75rem; }
    .paid-meta {
      background: #fef3c7;
      color: #92400e;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .timeline-content h3 {
      font-size: 1.125rem;
      margin-bottom: 0.375rem;
    }
    .timeline-description {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .timeline-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .link-btn {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--primary);
    }
    .link-btn:hover { text-decoration: underline; }
    .link-btn-secondary {
      color: var(--secondary);
    }

    /* --- Calendar grid view --- */
    .calendar-grid {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .calendar-header-row {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: var(--bg);
      border-bottom: 1px solid var(--border);
    }
    .calendar-header-cell {
      padding: 0.625rem;
      text-align: center;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }
    .calendar-week {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
    .calendar-week:not(:last-child) {
      border-bottom: 1px solid var(--border);
    }
    .calendar-cell {
      min-height: 100px;
      padding: 0.375rem;
      border-right: 1px solid var(--border);
      position: relative;
    }
    .calendar-cell:nth-child(7) {
      border-right: none;
    }
    .calendar-cell.other-month {
      background: var(--bg);
    }
    .calendar-cell.other-month .cell-day {
      color: var(--border);
    }
    .calendar-cell.today .cell-day {
      background: var(--primary);
      color: white;
    }
    .cell-day {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 50%;
      margin-bottom: 0.25rem;
      color: var(--text-main);
    }
    .calendar-event {
      display: flex;
      gap: 0.25rem;
      padding: 0.125rem 0.25rem;
      border-radius: 4px;
      background: rgba(37, 99, 235, 0.08);
      margin-bottom: 0.125rem;
      cursor: default;
      overflow: hidden;
    }
    .calendar-event.cancelled {
      opacity: 0.4;
      text-decoration: line-through;
    }
    .calendar-event-time {
      font-size: 0.625rem;
      font-weight: 600;
      color: var(--primary);
      white-space: nowrap;
    }
    .calendar-event-title {
      font-size: 0.625rem;
      color: var(--text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* --- Loading skeletons --- */
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 4rem;
    }
    .skeleton-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .skeleton-line {
      height: 14px;
      background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }
    .skeleton-line.short { width: 40%; }
    .skeleton-line.medium { width: 70%; }
    .loading-timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .skeleton-timeline-item {
      display: flex;
      gap: 1.5rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.25rem;
    }
    .skeleton-date-box {
      width: 64px;
      height: 64px;
      background: var(--bg);
      border-radius: 10px;
      flex-shrink: 0;
      animation: shimmer 1.5s infinite;
      background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%);
      background-size: 200% 100%;
    }
    .skeleton-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      justify-content: center;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* --- CTA banner --- */
    .cta-banner {
      background: #1e293b;
      color: white;
      padding: 3.5rem;
      border-radius: 20px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .cta-banner::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle at top right, rgba(37, 99, 235, 0.2), transparent);
    }
    .cta-content { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }
    .cta-banner h2 { color: white; font-size: 2rem; margin-bottom: 0.75rem; }
    .cta-banner p { color: #94a3b8; font-size: 1rem; margin-bottom: 1.5rem; }

    /* --- Empty state --- */
    .empty-state {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: var(--radius);
      border: 2px dashed var(--border);
      color: var(--text-muted);
      margin-bottom: 4rem;
    }

    @media (max-width: 640px) {
      .hero h1 { font-size: 2rem; }
      .section-header { flex-direction: column; align-items: flex-start; }
      .month-nav { flex-wrap: wrap; }
      .timeline-item { flex-direction: column; gap: 0.75rem; }
      .timeline-date { flex-direction: row; gap: 0.5rem; width: fit-content; height: auto; padding: 0.375rem 0.75rem; min-width: auto; }
      .calendar-cell { min-height: 70px; }
    }
  `,
})
export class LandingComponent implements OnInit {
  private readonly publicEventsService = inject(PublicEventsService);

  readonly cancelledStatus = EventStatus.CANCELLED;
  readonly weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  readonly upcomingEvents = signal<EventSummary[]>([]);
  readonly monthlyEvents = signal<EventSummary[]>([]);
  readonly loadingUpcoming = signal(true);
  readonly loadingMonthly = signal(true);

  readonly selectedYear = signal(new Date().getFullYear());
  readonly selectedMonth = signal(new Date().getMonth() + 1); // 1-based for API
  readonly viewMode = signal<'list' | 'calendar'>('list');

  readonly monthLabel = computed(() => {
    const date = new Date(this.selectedYear(), this.selectedMonth() - 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  });

  readonly canGoPrev = computed(() => {
    const now = new Date();
    return (
      this.selectedYear() > now.getFullYear() ||
      (this.selectedYear() === now.getFullYear() && this.selectedMonth() > now.getMonth() + 1)
    );
  });

  readonly calendarWeeks = computed(() => {
    const year = this.selectedYear();
    const month = this.selectedMonth() - 1; // 0-based
    const events = this.monthlyEvents();
    const today = new Date();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Monday=0 offset
    let startOffset = (firstDay.getDay() + 6) % 7;
    const weeks: {
      day: number;
      currentMonth: boolean;
      isToday: boolean;
      events: EventSummary[];
    }[][] = [];

    let current = new Date(firstDay);
    current.setDate(current.getDate() - startOffset);

    while (current <= lastDay || weeks.length === 0 || weeks[weeks.length - 1].length < 7) {
      if (!weeks.length || weeks[weeks.length - 1].length === 7) {
        weeks.push([]);
      }

      const d = current.getDate();
      const m = current.getMonth();
      const y = current.getFullYear();
      const isCurrentMonth = m === month && y === year;
      const isToday =
        d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

      const dayEvents = isCurrentMonth
        ? events.filter((e) => new Date(e.startsAt).getDate() === d)
        : [];

      weeks[weeks.length - 1].push({
        day: d,
        currentMonth: isCurrentMonth,
        isToday,
        events: dayEvents,
      });

      current.setDate(current.getDate() + 1);

      if (weeks[weeks.length - 1].length === 7 && current.getMonth() !== month && current > lastDay) {
        break;
      }
    }

    return weeks;
  });

  ngOnInit() {
    this.loadUpcoming();
    this.loadMonthly();
  }

  statusLabel(event: EventSummary): string {
    switch (event.status) {
      case EventStatus.RESCHEDULED:
        return 'Rescheduled';
      case EventStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Upcoming';
    }
  }

  prevMonth() {
    if (this.selectedMonth() === 1) {
      this.selectedYear.update((y) => y - 1);
      this.selectedMonth.set(12);
    } else {
      this.selectedMonth.update((m) => m - 1);
    }
    this.loadMonthly();
  }

  nextMonth() {
    if (this.selectedMonth() === 12) {
      this.selectedYear.update((y) => y + 1);
      this.selectedMonth.set(1);
    } else {
      this.selectedMonth.update((m) => m + 1);
    }
    this.loadMonthly();
  }

  goToCurrentMonth() {
    const now = new Date();
    this.selectedYear.set(now.getFullYear());
    this.selectedMonth.set(now.getMonth() + 1);
    this.loadMonthly();
  }

  private loadUpcoming() {
    this.loadingUpcoming.set(true);
    this.publicEventsService.getUpcomingEvents(5).subscribe({
      next: (events) => {
        this.upcomingEvents.set(events);
        this.loadingUpcoming.set(false);
      },
      error: () => {
        this.loadingUpcoming.set(false);
      },
    });
  }

  private loadMonthly() {
    this.loadingMonthly.set(true);
    this.publicEventsService
      .getEventsByMonth(this.selectedYear(), this.selectedMonth())
      .subscribe({
        next: (events) => {
          this.monthlyEvents.set(events);
          this.loadingMonthly.set(false);
        },
        error: () => {
          this.loadingMonthly.set(false);
        },
      });
  }
}
