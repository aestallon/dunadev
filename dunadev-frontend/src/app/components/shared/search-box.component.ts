import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-box">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        class="search-input"
        [placeholder]="placeholder"
        [(ngModel)]="query"
        (ngModelChange)="queryChange.emit($event)"
        [attr.aria-label]="placeholder"
      />
      @if (query) {
        <button class="clear-btn" (click)="clear()" aria-label="Clear search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      }
    </div>
  `,
  styles: `
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 0.75rem;
      width: 16px;
      height: 16px;
      color: var(--text-muted);
      pointer-events: none;
      flex-shrink: 0;
    }
    .search-input {
      width: 100%;
      padding: 0.5rem 2.25rem 0.5rem 2.25rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.875rem;
      background: white;
      color: var(--text-main);
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    .search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    .clear-btn {
      position: absolute;
      right: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      padding: 0;
      border-radius: 4px;
      transition: color 0.15s;
    }
    .clear-btn:hover { color: var(--text-main); }
    .clear-btn svg { width: 12px; height: 12px; }
  `,
})
export class SearchBoxComponent {
  @Input() placeholder = 'Search…';
  @Output() queryChange = new EventEmitter<string>();

  query = '';

  clear() {
    this.query = '';
    this.queryChange.emit('');
  }
}
