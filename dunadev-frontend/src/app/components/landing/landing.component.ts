import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LocalizedDatePipe, DATE_FORMATS } from '../../pipes/localized-date.pipe';
import { RouterLink } from '@angular/router';
import { PublicEventsService, EventSummary, EventStatus } from '../../../api/dunadev';
import { EventModalComponent } from '../shared/event-modal.component';
import { I18nService } from '../../services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, LocalizedDatePipe, EventModalComponent, TranslatePipe],
  template: `
    <app-event-modal [event]="selectedEvent()" (close)="selectedEvent.set(null)"/>

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
            <span class="hero-eyebrow">{{ 'landing.eyebrow' | translate }}</span>
            <h1 [innerHTML]="'landing.heroTitle' | translate"></h1>
            <h1 class="text-gradient" [innerHTML]="'landing.heroTitle2' | translate"></h1>
            <p>{{ 'landing.heroBody' | translate }}</p>
          </div>

          <!-- Right: upcoming events -->
          <div class="hero-panel">
            <div class="hero-panel-header">
              <span class="panel-label">{{ 'landing.panelLabel' | translate }}</span>
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
                <p>{{ 'landing.noUpcoming' | translate }}</p>
              </div>
            } @else {
              <div class="hero-panel-list">
                @for (event of upcomingEvents(); track event.id) {
                  <div class="hec" (click)="selectedEvent.set(event)" role="button" tabindex="0"
                       (keydown.enter)="selectedEvent.set(event)">

                    <div class="hec-image">
                      @if (event.coverImageUrl) {
                        <img [src]="event.coverImageUrl" [alt]="event.title" loading="lazy">
                      } @else {
                        <img src="random_code.webp" [alt]="event.title" loading="lazy">
                      }
                    </div>
                    <div class="hec-header">
                      @if (event.status === 'RESCHEDULED' || event.status === 'CANCELLED') {
                        <span class="hec-badge">{{ statusLabel(event) }}</span>
                      }
                      @if (event.onNewLocation) {
                        <span class="hec-badge hec-badge-relocated">{{ 'badge.onNewLocation' | translate }}</span>
                      }
                      <span class="hec-date">{{ event.startsAt | localizedDate: fmt.SHORT_DATE }}</span>
                    </div>
                    <div class="hec-title">{{ event.title }}</div>
                    <div class="hec-meta">
                      <span class="hec-meta-item">{{ event.organiser.name }}</span>
                      @if (event.location) {
                        <span class="hec-sep">·</span>
                        <span class="hec-meta-item">{{ event.location.name }}</span>
                      }
                      <span class="hec-sep">·</span>
                      <span class="hec-meta-item">{{ event.startsAt | localizedDate: fmt.TIME }}</span>
                    </div>
                    <div class="hec-badges">
                      @if (!event.free) {
                        <span class="hec-pill">{{ 'badge.paid' | translate }}</span>
                      }
                      @if (event.registrationRequired) {
                        <span class="hec-pill">{{ 'badge.regRequired' | translate }}</span>
                      }
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

        <!-- Monthly event grid -->
        <section class="monthly-section">
          <div class="month-panel-header">
            <div class="mph-left">
              <button class="mnav-btn" (click)="prevMonth()" [disabled]="!canGoPrev()"
                      [attr.aria-label]="'landing.prevMonth' | translate">
                <span class="chevron-left"></span>
              </button>
            </div>
            <div class="mph-center">
              <span class="mph-name">{{ selectedDate() | localizedDate:fmt.MONTH_ONLY }}</span>
              <span class="mph-year">{{ selectedDate() | localizedDate:fmt.YEAR }}</span>
            </div>
            <div class="mph-right">
              <button class="mnav-btn" (click)="nextMonth()"
                      [attr.aria-label]="'landing.nextMonth' | translate">
                <span class="chevron-right"></span>
              </button>
            </div>
          </div>

          @if (loadingMonthly()) {
            <div class="month-grid">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div class="month-card sk-card">
                  <div class="sk-img"></div>
                  <div class="sk-body">
                    <div class="sk-line short"></div>
                    <div class="sk-line"></div>
                    <div class="sk-line medium"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (monthlyEvents().length === 0) {
            <div class="empty-state">
              <p>{{ 'landing.noMonthEvents' | translate }}</p>
            </div>
          } @else {
            <div class="month-grid">
              @for (event of monthlyEvents(); track event.id) {
                <div class="month-card" [class.cancelled]="event.status === cancelledStatus"
                     (click)="selectedEvent.set(event)" role="button" tabindex="0"
                     (keydown.enter)="selectedEvent.set(event)">
                  <div class="mc-image">
                    @if (event.coverImageUrl) {
                      <img [src]="event.coverImageUrl" [alt]="event.title" loading="lazy">
                    } @else {
                      <img src="random_code.webp" [alt]="event.title" loading="lazy">
                    }
                  </div>
                  <div class="mc-date-row">
                    <div class="mc-date">
                      <span class="mc-day">{{ event.startsAt | localizedDate:fmt.DAY_NUM }}</span>
                      <div class="mc-day-detail">
                        <span class="mc-dow">{{ event.startsAt | localizedDate:fmt.SHORT_DAY }}</span>
                        <span class="mc-mon">{{ event.startsAt | localizedDate:fmt.MONTH_YEAR }}</span>
                      </div>
                    </div>
                    <span class="mc-time">
                      {{ event.startsAt | localizedDate:fmt.TIME }}
                      @if (event.endsAt) {
                        &ndash; {{ event.endsAt | localizedDate:fmt.TIME }}
                      }
                    </span>
                  </div>

                  <div class="mc-body">
                    <div class="mc-title">{{ event.title }}</div>
                    <div class="mc-meta">
                      <span class="mc-org">{{ event.organiser.name }}</span>
                      @if (event.location) {
                        <span class="mc-sep">·</span>
                        <span>{{ event.location.name }}</span>
                      }
                    </div>
                    <div class="mc-badges">
                      @if (!event.free) {
                        <span class="mc-pill mc-paid">{{ 'badge.paid' | translate }}</span>
                      }
                      @if (event.registrationRequired) {
                        <span class="mc-pill mc-reg">{{ 'badge.regRequired' | translate }}</span>
                      }
                      @if (event.status === 'CANCELLED') {
                        <span class="mc-pill mc-cancelled">{{ 'badge.cancelled' | translate }}</span>
                      } @else {
                        @if (event.status === 'RESCHEDULED') {
                          <span class="mc-pill mc-rescheduled">{{ 'badge.onNewDate' | translate }}</span>
                        }
                        @if (event.onNewLocation) {
                          <span class="mc-pill mc-relocated">{{ 'badge.onNewLocation' | translate }}</span>
                        }
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </section>

        <section class="cta-banner">
          <div class="cta-content">
            <h2>{{ 'landing.ctaTitle' | translate }}</h2>
            <p>{{ 'landing.ctaBody' | translate }}</p>
            <a routerLink="/contact" class="btn btn-primary">{{ 'landing.ctaBtn' | translate }}</a>
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

    .hero-text h1 {
      font-size: 3rem !important;
      margin-bottom: unset !important;
    }

    .hero-text p {
      margin-top: 2rem;
    }

    /* Hero content */
    .hero-inner {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 5rem 1.5rem;
      display: grid;
      grid-template-columns: 5fr 6fr;
      gap: 4rem;
      align-items: start;
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
      max-width: 520px;
    }

    /* Events panel — dashed left divider, no scroll */
    .hero-panel {
      border-left: 2px dashed rgba(255, 255, 255, 0.18);
      padding-left: 3rem;
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
      width: 100%;
    }
    .hec:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(96, 165, 250, 0.35);
    }
    .hec-image {
      width: 100%;
      height: 140px;
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
    .hec-badge-relocated { color: #a78bfa; background: rgba(167, 139, 250, 0.15); }
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
      width: 100%;
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
    /* ===== MONTHLY SECTION ===== */
    .monthly-section { margin-bottom: 4rem; }

    /* ===== MONTH PANEL HEADER ===== */
    .month-panel-header {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding: 1.25rem 0 1.75rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.75rem;
    }
    .mph-left {
      display: flex;
      justify-content: flex-end;
      padding-right: 1.5rem;
    }
    .mph-center {
      text-align: center;
      white-space: nowrap;
    }
    .mph-name {
      font-size: 1.875rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.02em;
    }
    .mph-year {
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--text-muted);
      margin-left: 0.5rem;
    }
    .mph-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-left: 1.5rem;
    }
    .mnav-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: white;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
      flex-shrink: 0;
    }
    .mnav-btn:hover:not(:disabled) { border-color: var(--primary); background: #eff6ff; }
    .mnav-btn:disabled { opacity: 0.35; cursor: default; }
    .chevron-left, .chevron-right {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-top: 2px solid var(--text-muted);
      border-right: 2px solid var(--text-muted);
    }
    .chevron-left { transform: rotate(-135deg); margin-left: 2px; }
    .chevron-right { transform: rotate(45deg); margin-right: 2px; }
    .today-link {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--primary);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem 0.375rem;
      border-radius: 4px;
      transition: background 0.15s;
    }
    .today-link:hover { background: #eff6ff; }

    /* ===== MONTH GRID ===== */
    .month-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 320px));
      justify-content: center;
      gap: 1rem;
    }

    /* ===== MONTH CARD (light) ===== */
    .month-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
      display: flex;
      flex-direction: column;
    }
    .month-card:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 20px rgba(37, 99, 235, 0.12);
      transform: translateY(-2px);
    }
    .month-card:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
    .month-card.cancelled { opacity: 0.55; }
    .month-card.cancelled .mc-title { text-decoration: line-through; }

    .mc-image {
      width: max(100%, 320px);
      height: 140px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .mc-image img { width: max(100%, 320px); height: 100%; object-fit: cover; }

    .card-image-placeholder {
      background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mc-date-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.875rem 1rem 0;
    }
    .mc-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .mc-day {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--primary);
      line-height: 1;
    }
    .mc-day-detail {
      display: flex;
      flex-direction: column;
      gap: 0.05rem;
    }
    .mc-dow {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-main);
    }
    .mc-mon {
      font-size: 0.6875rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .mc-time {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .mc-body {
      padding: 0.625rem 1rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      flex: 1;
    }
    .mc-title {
      font-size: 0.9375rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .mc-meta {
      font-size: 0.75rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex-wrap: wrap;
    }
    .mc-org { font-weight: 600; color: var(--text-main); }
    .mc-sep { opacity: 0.4; }
    .mc-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      margin-top: 0.125rem;
    }
    .mc-pill {
      font-size: 0.5625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.175rem 0.45rem;
      border-radius: 9999px;
    }
    .mc-paid        { background: #fef3c7; color: #92400e; }
    .mc-reg         { background: #fff7ed; color: #c2410c; }
    .mc-cancelled   { background: #fee2e2; color: #dc2626; }
    .mc-rescheduled { background: #fef3c7; color: #d97706; }
    .mc-relocated   { background: #ede9fe; color: #7c3aed; }

    /* ===== SKELETON (monthly grid) ===== */
    .sk-card { pointer-events: none; }
    .sk-img {
      height: 140px;
      background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .sk-body {
      padding: 0.875rem 1rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .sk-line {
      height: 12px;
      border-radius: 4px;
      background: linear-gradient(90deg, var(--bg) 25%, #eef2f7 50%, var(--bg) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .sk-line.short  { width: 35%; }
    .sk-line.medium { width: 60%; }
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
      .hero { min-height: auto; }
      .hero-inner {
        grid-template-columns: 1fr;
        gap: 2.5rem;
        padding: 3.5rem 1.25rem;
      }
      .hero-text p { max-width: none; }
      .hero-panel {
        border-left: none;
        border-top: 2px dashed rgba(255, 255, 255, 0.18);
        padding-left: 0;
        padding-top: 2rem;
      }
    }
    @media (max-width: 640px) {
      .mph-name { font-size: 1.375rem; }
      .mph-year { font-size: 0.9375rem; }
      .mph-left { padding-right: 0.75rem; }
      .mph-right { padding-left: 0.75rem; }
      .cta-banner { padding: 2.5rem 1.5rem; }
    }
  `,
})
export class LandingComponent implements OnInit {
  private readonly publicEventsService = inject(PublicEventsService);
  private readonly i18n = inject(I18nService);
  protected readonly fmt = DATE_FORMATS;

  readonly cancelledStatus = EventStatus.CANCELLED;

  readonly selectedEvent = signal<EventSummary | null>(null);
  readonly upcomingEvents = signal<EventSummary[]>([]);
  readonly monthlyEvents = signal<EventSummary[]>([]);
  readonly loadingUpcoming = signal(true);
  readonly loadingMonthly = signal(true);

  readonly selectedYear = signal(new Date().getFullYear());
  readonly selectedMonth = signal(new Date().getMonth() + 1);

  readonly selectedDate = computed(() => new Date(this.selectedYear(), this.selectedMonth() - 1));

  readonly monthLabel = computed(() =>
    this.selectedDate().toLocaleString('en-US', { month: 'long', year: 'numeric' })
  );

  readonly canGoPrev = computed(() => {
    const now = new Date();
    return (
      this.selectedYear() > now.getFullYear() ||
      (this.selectedYear() === now.getFullYear() && this.selectedMonth() > now.getMonth() + 1)
    );
  });

  ngOnInit() {
    this.loadUpcoming();
    this.loadMonthly();
  }

  statusLabel(event: EventSummary): string {
    switch (event.status) {
      case EventStatus.RESCHEDULED:
        return this.i18n.t('badge.onNewDate');
      case EventStatus.CANCELLED:
        return this.i18n.t('badge.cancelled');
      default:
        return '';
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
    this.publicEventsService.getUpcomingEvents(3).subscribe({
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
