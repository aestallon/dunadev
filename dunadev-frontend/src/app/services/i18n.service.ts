import { Injectable, signal, computed } from '@angular/core';
import { HU } from '../i18n/hu';
import { EN } from '../i18n/en';

export type Locale = 'hu' | 'en';

const STORAGE_KEY = 'dunadev-locale';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly locale = signal<Locale>(
    (localStorage.getItem(STORAGE_KEY) as Locale | null) ?? 'hu',
  );

  private readonly dict = computed<Record<string, string>>(() =>
    this.locale() === 'hu' ? HU : EN,
  );

  t(key: string, params?: Record<string, string>): string {
    let value = this.dict()[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replaceAll(`{{${k}}}`, v);
      }
    }
    return value;
  }

  setLocale(locale: Locale): void {
    localStorage.setItem(STORAGE_KEY, locale);
    this.locale.set(locale);
  }

  toggleLocale(): void {
    this.setLocale(this.locale() === 'hu' ? 'en' : 'hu');
  }
}
