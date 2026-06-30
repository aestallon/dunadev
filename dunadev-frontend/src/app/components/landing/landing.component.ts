import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicEventsService, EventSummary, EventStatus } from '../../../api/dunadev';
import { EventModalComponent } from '../shared/event-modal.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, EventModalComponent],
  template: `
    <app-event-modal [event]="selectedEvent()" (close)="selectedEvent.set(null)" />

    <div class="landing-page">

      <!-- ===== HERO ===== -->
      <section class="hero">
        <!-- Artwork placeholder background -->
        <div class="hero-artwork" aria-hidden="true">
          <div class="art-blob art-blob-1"></div>
          <div class="art-blob art-blob-2"></div>
          <div class="art-blob art-blob-3"></div>
          <div class="art-grid"></div>
        </div>

        <div class="hero-inner">
          <!-- Left: title + hero text -->
          <div class="hero-text">
            <span class="hero-eyebrow">Budapest · Tech Events</span>
            <h1>Discover the <span class="text-gradient">Tech Community</span></h1>
            <p>
              Join local meetups, workshops, and conferences. Stay connected with fellow developers
              in the heart of Hungary.
            </p>
          </div>

          <!-- Right: upcoming events panel -->
          <div class="hero-panel">
            <div class="hero-panel-header">
              <span class="panel-label">Coming Up Next</span>
            </div>

            @if (loadingUpcoming()) {
              <div class="hero-panel-list">
                @for (i of [1, 2, 3]; track i) {
                  <div class="hec-skeleton">
                    <div class="hec-sk-line short"></div>
                    <div class="hec-sk-line"></div>
                    <div class="hec-sk-line medium"></div>
                  </div>
                }
              </div>
            } @else if (upcomingEvents().length === 0) {
              <div class="hero-empty">
                <p>No upcoming events at the moment. Check back soon!</p>
              </div>
            } @else {
              <div class="hero-panel-list">
                @for (event of upcomingEvents(); track event.id) {
                  <div class="hec" (click)="selectedEvent.set(event)" role="button" tabindex="0"
                       (keydown.enter)="selectedEvent.set(event)">
                    @if (event.coverImageUrl) {
                      <div class="hec-image">
                        <img [src]="event.coverImageUrl" [alt]="event.title" loading="lazy">
                      </div>
                    }
                    <div class="hec-header">
                      <span class="hec-badge">{{ statusLabel(event) }}</span>
                      <span class="hec-date">{{ event.startsAt | date: 'MMM d, y' }}</span>
                    </div>
                    <div class="hec-title">{{ event.title }}</div>
                    <div class="hec-meta">
                      <span class="hec-meta-item">{{ event.organiser.name }}</span>
                      @if (event.location) {
                        <span class="hec-sep">·</span>
                        <span class="hec-meta-item">{{ event.location.name }}</span>
                      }
                      <span class="hec-sep">·</span>
                      <span class="hec-meta-item">{{ event.startsAt | date: 'HH:mm' }}</span>
                    </div>
                    <div class="hec-badges">
                      @if (!event.free) { <span class="hec-pill">Paid</span> }
                      @if (event.registrationRequired) { <span class="hec-pill">Registration required</span> }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ===== MONTHLY SECTION + CTA ===== -->
      <div class="container">

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
                <div class="timeline-item" [class.cancelled]="event.status === cancelledStatus"
                     (click)="selectedEvent.set(event)" role="button" tabindex="0"
                     (keydown.enter)="selectedEvent.set(event)">
                  @if (event.coverImageUrl) {
                    <div class="timeline-thumb">
                      <img [src]="event.coverImageUrl" [alt]="event.title" loading="lazy">
                    </div>
                  }
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
                      @if (event.registrationRequired) {
                        <span class="meta-item reg-meta">Registration required</span>
                      }
                    </div>
                    <h3>{{ event.title }}</h3>
                    @if (event.description) {
                      <p class="timeline-description">{{ event.description }}</p>
                    }
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
                               [title]="event.title"
                               (click)="selectedEvent.set(event)"
                               role="button" tabindex="0"
                               (keydown.enter)="selectedEvent.set(event)">
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

    /* ===== HERO ===== */
    .hero {
      position: relative;
      min-height: 88vh;
      background: linear-gradient(135deg, #0c1526 0%, #0f2044 45%, #0d1b36 100%);
      display: flex;
      align-items: center;
      overflow: hidden;
      margin-bottom: 4rem;
    }

    /* Artwork placeholder — abstract geometric blobs + dot grid */
    .hero-artwork {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .art-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
    }
    .art-blob-1 {
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(37, 99, 235, 0.35), transparent 70%);
      top: -200px;
      right: -100px;
    }
    .art-blob-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.2), transparent 70%);
      bottom: -100px;
      left: 5%;
    }
    .art-blob-3 {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(124, 58, 237, 0.18), transparent 70%);
      top: 30%;
      left: 38%;
    }
    .art-grid {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
      background-size: 32px 32px;
    }

    /* Hero content */
    .hero-inner {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 5rem 1.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      width: 100%;
    }

    .hero-text {
      color: white;
    }
    .hero-eyebrow {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #60a5fa;
      margin-bottom: 1.25rem;
    }
    .hero-text h1 {
      font-size: clamp(2.25rem, 4vw, 3.5rem);
      line-height: 1.1;
      color: white;
      margin-bottom: 1.5rem;
    }
    .text-gradient {
      background: linear-gradient(to right, #60a5fa, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-text p {
      font-size: 1.0625rem;
      color: #94a3b8;
      line-height: 1.75;
      max-width: 440px;
    }

    /* Events panel */
    .hero-panel {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 1.75rem;
      max-height: 72vh;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.15) transparent;
    }
    .hero-panel-header {
      margin-bottom: 1.25rem;
    }
    .panel-label {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #60a5fa;
    }
    .hero-panel-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    /* Individual upcoming event card in the hero panel */
    .hec {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      overflow: hidden;
      transition: background 0.2s, border-color 0.2s;
      cursor: pointer;
    }
    .hec:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(96, 165, 250, 0.35);
    }
    .hec-image {
      width: 100%;
      height: 120px;
      overflow: hidden;
    }
    .hec-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .hec-header,
    .hec-title,
    .hec-meta,
    .hec-badges {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }
    .hec-header { padding-top: 1rem; }
    .hec-badges { padding-bottom: 0.875rem; display: flex; gap: 0.375rem; flex-wrap: wrap; }
    .hec-pill {
      font-size: 0.5625rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.05em; padding: 0.15rem 0.45rem; border-radius: 9999px;
      background: rgba(255,255,255,0.1); color: #cbd5e1;
    }
    .hec-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      padding-top: 1.125rem;
      padding-bottom: 0;
    }
    .hec-badge {
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #60a5fa;
      background: rgba(96, 165, 250, 0.15);
      padding: 0.1875rem 0.5rem;
      border-radius: 9999px;
    }
    .hec-date {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 500;
    }
    .hec-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: white;
      line-height: 1.35;
      margin-bottom: 0.375rem;
    }
    .hec-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.25rem;
      margin-bottom: 0.625rem;
    }
    .hec-meta-item {
      font-size: 0.75rem;
      color: #64748b;
    }
    .hec-sep {
      font-size: 0.75rem;
      color: #334155;
    }
    .hec-link {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #60a5fa;
    }
    .hec-link:hover { text-decoration: underline; }

    /* Hero skeleton */
    .hec-skeleton {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 1.125rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }
    .hec-sk-line {
      height: 12px;
      background: rgba(255,255,255,0.08);
      border-radius: 4px;
      animation: shimmer-dark 1.5s infinite;
      background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%);
      background-size: 200% 100%;
    }
    .hec-sk-line.short { width: 35%; }
    .hec-sk-line.medium { width: 65%; }
    @keyframes shimmer-dark {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Hero empty state */
    .hero-empty {
      text-align: center;
      padding: 2.5rem 1rem;
      color: #64748b;
      font-size: 0.875rem;
    }

    /* ===== CONTAINER ===== */
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

    /* ===== MONTH NAV ===== */
    .month-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.8125rem; }
    .btn-icon { padding: 0.5rem 0.625rem; line-height: 1; }
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

    /* ===== MONTHLY SECTION ===== */
    .monthly-section {
      margin-bottom: 4rem;
    }

    /* ===== TIMELINE (list view) ===== */
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
      cursor: pointer;
      overflow: hidden;
      position: relative;
    }
    .timeline-item:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow);
    }
    .timeline-thumb {
      width: 100px;
      min-width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      align-self: center;
    }
    .timeline-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .timeline-item.cancelled { opacity: 0.55; }
    .timeline-item.cancelled h3 { text-decoration: line-through; }
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
    .reg-meta {
      background: #fff7ed;
      color: #c2410c;
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
    .link-btn-secondary { color: var(--secondary); }

    /* ===== CALENDAR GRID VIEW ===== */
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
    .calendar-week:not(:last-child) { border-bottom: 1px solid var(--border); }
    .calendar-cell {
      min-height: 100px;
      padding: 0.375rem;
      border-right: 1px solid var(--border);
      position: relative;
    }
    .calendar-cell:nth-child(7) { border-right: none; }
    .calendar-cell.other-month { background: var(--bg); }
    .calendar-cell.other-month .cell-day { color: var(--border); }
    .calendar-cell.today .cell-day { background: var(--primary); color: white; }
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
    .calendar-event.cancelled { opacity: 0.4; text-decoration: line-through; }
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

    /* ===== SKELETON (monthly) ===== */
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
      border-radius: 10px;
      flex-shrink: 0;
      background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .skeleton-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      justify-content: center;
    }
    .skeleton-line {
      height: 14px;
      background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }
    .skeleton-line.short { width: 40%; }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* ===== EMPTY STATE ===== */
    .empty-state {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: var(--radius);
      border: 2px dashed var(--border);
      color: var(--text-muted);
      margin-bottom: 4rem;
    }

    /* ===== CTA BANNER ===== */
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

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .hero {
        min-height: auto;
      }
      .hero-inner {
        grid-template-columns: 1fr;
        gap: 2.5rem;
        padding: 3.5rem 1.25rem;
      }
      .hero-text p {
        max-width: none;
      }
      .hero-panel {
        max-height: none;
      }
    }
    @media (max-width: 640px) {
      .section-header { flex-direction: column; align-items: flex-start; }
      .month-nav { flex-wrap: wrap; }
      .timeline-item { flex-direction: column; gap: 0.75rem; }
      .timeline-date {
        flex-direction: row;
        gap: 0.5rem;
        width: fit-content;
        height: auto;
        padding: 0.375rem 0.75rem;
        min-width: auto;
      }
      .calendar-cell { min-height: 70px; }
      .cta-banner { padding: 2.5rem 1.5rem; }
    }
  `,
})
export class LandingComponent implements OnInit {
  private readonly publicEventsService = inject(PublicEventsService);

  readonly cancelledStatus = EventStatus.CANCELLED;
  readonly weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  readonly selectedEvent = signal<EventSummary | null>(null);
  readonly upcomingEvents = signal<EventSummary[]>([]);
  readonly monthlyEvents = signal<EventSummary[]>([]);
  readonly loadingUpcoming = signal(true);
  readonly loadingMonthly = signal(true);

  readonly selectedYear = signal(new Date().getFullYear());
  readonly selectedMonth = signal(new Date().getMonth() + 1);
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
    const month = this.selectedMonth() - 1;
    const events = this.monthlyEvents();
    const today = new Date();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

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

      weeks[weeks.length - 1].push({ day: d, currentMonth: isCurrentMonth, isToday, events: dayEvents });

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
      error: () => this.loadingUpcoming.set(false),
    });
  }

  private loadMonthly() {
    this.loadingMonthly.set(true);
    this.publicEventsService.getEventsByMonth(this.selectedYear(), this.selectedMonth()).subscribe({
      next: (events) => {
        this.monthlyEvents.set(events);
        this.loadingMonthly.set(false);
      },
      error: () => this.loadingMonthly.set(false),
    });
  }
}
