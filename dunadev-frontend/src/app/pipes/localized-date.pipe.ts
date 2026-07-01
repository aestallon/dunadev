import { Pipe, PipeTransform, inject } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { I18nService } from '../services/i18n.service';

registerLocaleData(localeHu);

export const DATE_FORMATS = {
  FULL_DATE:       'FULL_DATE',
  SHORT_DATE:      'SHORT_DATE',
  SHORT_DATE_TIME: 'SHORT_DATE_TIME',
  MONTH_YEAR:      'MONTH_YEAR',
  MONTH_ONLY:      'MONTH_ONLY',
  SHORT_DAY:       'SHORT_DAY',
  SHORT_MONTH:     'SHORT_MONTH',
  DAY_TIME:        'DAY_TIME',
  TIME:            'TIME',
  DAY_NUM:         'DAY_NUM',
  YEAR:            'YEAR',
} as const;

export type DateFormat = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS];

const EN_PATTERNS: Record<DateFormat, string> = {
  FULL_DATE:       'EEEE, d MMMM y',
  SHORT_DATE:      'EEE, d MMM y',
  SHORT_DATE_TIME: 'EEE, d MMM y · HH:mm',
  MONTH_YEAR:      'MMM y',
  MONTH_ONLY:      'MMMM',
  SHORT_DAY:       'EEE',
  SHORT_MONTH:     'MMM',
  DAY_TIME:        'EEE HH:mm',
  TIME:            'HH:mm',
  DAY_NUM:         'd',
  YEAR:            'y',
};

const HU_PATTERNS: Record<DateFormat, string> = {
  FULL_DATE:       'EEEE, y. MMMM d.',
  SHORT_DATE:      'EEE, y. MMM d.',
  SHORT_DATE_TIME: 'EEE, y. MMM d. · HH:mm',
  MONTH_YEAR:      'y. MMM',
  MONTH_ONLY:      'MMMM',
  SHORT_DAY:       'EEE',
  SHORT_MONTH:     'MMM',
  DAY_TIME:        'EEE HH:mm',
  TIME:            'HH:mm',
  DAY_NUM:         'd',
  YEAR:            'y',
};

@Pipe({ name: 'localizedDate', pure: false, standalone: true })
export class LocalizedDatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);
  private readonly hu = new DatePipe('hu');
  private readonly en = new DatePipe('en');

  transform(value: string | Date | number | null | undefined, format: DateFormat, timezone?: string): string | null {
    const isHu = this.i18n.locale() === 'hu';
    const pattern = (isHu ? HU_PATTERNS : EN_PATTERNS)[format];
    return (isHu ? this.hu : this.en).transform(value, pattern, timezone);
  }
}
