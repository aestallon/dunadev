# I18N_IMPL.md — Bilingual (HU/EN) Implementation Plan

## Overview

The goal is runtime language switching between Hungarian (default) and English for all static
UI text. User-provided dynamic content (event titles, descriptions, organiser names, location
names, links) is **never translated** — it is displayed verbatim in whatever language the
organiser entered it.

---

## Technology Choice

**Do NOT use `@angular/localize`.** It is a compile-time tool that requires a separate build
per locale. Runtime switching is unsupported.

**Use a custom signal-based `I18nService` + an impure `TranslatePipe`.** This:

- Adds zero external dependencies
- Integrates naturally with the project's existing signal patterns
- Is simple enough that every component follows identical, mechanical steps
- Enables the locale signal to be read anywhere in the component tree

---

## Architecture

```
src/app/i18n/
  hu.ts          ← Hungarian translations (flat key → value map)
  en.ts          ← English translations  (same keys)
  keys.ts        ← TypeScript type for the key union (generated from hu.ts)

src/app/services/
  i18n.service.ts    ← I18nService (providedIn: 'root')

src/app/pipes/
  translate.pipe.ts  ← TranslatePipe (pure: false, standalone: true)
```

---

## Translation File Format

Flat dot-notation keys, values are plain strings. Interpolation uses `{{variable}}` delimiters
(double curly, different from Angular template interpolation to avoid confusion).

```typescript
// hu.ts
export const HU: Record<string, string> = {
    // --- Navbar ---
    'nav.about': 'Rólunk',
    'nav.contact': 'Kapcsolat',
    'nav.dashboard': 'Vezérlőpult',
    'nav.signIn': 'Bejelentkezés',
    'nav.signOut': 'Kijelentkezés',
    'nav.langSwitch': 'EN',           // label for the switcher button when HU is active

    // --- Footer ---
    'footer.tagline': 'Budapest tech eseménynaptára – ne maradj le egy meetupról sem.',
    'footer.events': 'Események',
    'footer.about': 'Rólunk',
    'footer.contact': 'Kapcsolat',
    'footer.copy': '© {{year}} DunaDev. Minden jog fenntartva.',

    // --- Landing hero ---
    'landing.eyebrow': 'Budapest · Tech Események',
    'landing.heroTitle': 'Fedezd fel a <span class="text-gradient">Tech Közösséget</span>',
    'landing.heroBody': 'Csatlakozz helyi meetupokhoz, workshopokhoz és konferenciákhoz. Maradj kapcsolatban a fejlesztői közösséggel Magyarország szívében.',
    'landing.panelLabel': 'Következő események',
    'landing.noUpcoming': 'Jelenleg nincs közelgő esemény. Nézz vissza hamarosan!',
    'landing.loadError': 'Az események betöltése sikertelen.',

    // --- Landing month grid ---
    'landing.monthTitle': '{{month}} {{year}}',   // month name + year composed in component
    'landing.today': 'Ma',
    'landing.noMonthEvents': 'Ebben a hónapban nincs esemény.',

    // --- Shared badges ---
    'badge.free': 'Ingyenes',
    'badge.paid': 'Fizetős',
    'badge.regRequired': 'Regisztráció szükséges',
    'badge.cancelled': 'Lemondva',
    'badge.onNewDate': 'Új időpontban',
    'badge.onNewLocation': 'Új helyszínen',

    // --- Event modal ---
    'modal.when': 'Mikor',
    'modal.where': 'Hol',
    'modal.howToGetThere': 'Megközelítés',
    'modal.registration': 'Regisztráció',
    'modal.registerBtn': 'Regisztrálj itt',
    'modal.links': 'Linkek',
    'modal.noDescription': 'Nincs leírás.',

    // --- Event card (manage/admin) ---
    'card.edit': 'Szerkesztés',
    'card.preview': 'Előnézet',

    // --- Login ---
    'login.title': 'Bejelentkezés a DunaDev-be',
    'login.subtitle': 'Esemény szervezők és adminisztrátorok részére',
    'login.emailLabel': 'E-mail cím',
    'login.emailPlaceholder': 'nev@example.com',
    'login.passwordLabel': 'Jelszó',
    'login.submitBtn': 'Bejelentkezés',
    'login.submitting': 'Bejelentkezés…',
    'login.invalidCredentials': 'Érvénytelen e-mail cím vagy jelszó.',
    'login.genericError': 'Bejelentkezés sikertelen. Kérjük, próbálja meg újra.',

    // --- Change Password ---
    'password.title': 'Jelszó megváltoztatása',
    'password.currentLabel': 'Jelenlegi jelszó',
    'password.currentPh': 'Adja meg a jelenlegi jelszavát',
    'password.newLabel': 'Új jelszó',
    'password.newPh': 'Válasszon új jelszót',
    'password.confirmLabel': 'Jelszó megerősítése',
    'password.confirmPh': 'Írja be újra az új jelszót',
    'password.submitBtn': 'Jelszó megváltoztatása',
    'password.submitting': 'Mentés…',
    'password.success': 'A jelszó sikeresen megváltozott.',
    'password.mismatch': 'A két jelszó nem egyezik.',
    'password.rules.minLength': 'Legalább 8 karakter',
    'password.rules.uppercase': 'Tartalmaz nagybetűt',
    'password.rules.digit': 'Tartalmaz számot',

    // --- Organiser sidebar ---
    'sidebar.events': 'Események',
    'sidebar.locations': 'Helyszínek',
    'sidebar.docs': 'Dokumentáció',
    'sidebar.password': 'Jelszó megváltoztatása',
    'sidebar.collapse': 'Összecsukás',
    'sidebar.admin': 'Adminisztráció',
    'sidebar.soon': 'Hamarosan',

    // --- Admin sidebar ---
    'admin.upcoming': 'Közelgő',
    'admin.organisers': 'Szervezők',

    // --- Manage events ---
    'manageEvents.title': 'Eseményeim',
    'manageEvents.newBtn': 'Új esemény',
    'manageEvents.empty': 'Még nincsenek eseményeid.',
    'manageEvents.newFirst': 'Hozd létre az első eseményed!',
    'manageEvents.loadError': 'Az események betöltése sikertelen.',

    // --- Event create / edit (shared form labels) ---
    'eventForm.backToEvents': '← Vissza az eseményekhez',
    'eventForm.newTitle': 'Új esemény',
    'eventForm.editTitle': 'Esemény szerkesztése',
    'eventForm.sectionBasic': 'Alapadatok',
    'eventForm.titleLabel': 'Cím *',
    'eventForm.titlePh': 'Az esemény neve',
    'eventForm.descLabel': 'Leírás',
    'eventForm.descPh': 'Mit kell tudni az eseményről?',
    'eventForm.urlLabel': 'Esemény URL',
    'eventForm.urlPh': 'https://example.com/event',
    'eventForm.sectionSchedule': 'Időpont',
    'eventForm.startsAtLabel': 'Kezdés *',
    'eventForm.endsAtLabel': 'Befejezés (opcionális)',
    'eventForm.visibleFromLabel': 'Látható ettől',
    'eventForm.visibleFromHint': 'Ha üres, az esemény azonnal látható.',
    'eventForm.locationLabel': 'Helyszín *',
    'eventForm.locationPh': 'Válassz helyszínt…',
    'eventForm.locationEmpty': 'Még nincsenek helyszíneid.',
    'eventForm.locationNewLink': '+ Új helyszín hozzáadása',
    'eventForm.sectionDetails': 'Részletek',
    'eventForm.freeLabel': 'Ingyenes esemény',
    'eventForm.regRequiredLabel': 'Regisztráció szükséges',
    'eventForm.regUrlLabel': 'Regisztrációs URL',
    'eventForm.regUrlPh': 'https://example.com/register',
    'eventForm.sectionLinks': 'További linkek',
    'eventForm.addLinkBtn': '+ Link hozzáadása',
    'eventForm.linkLabelPh': 'Felirat',
    'eventForm.linkUrlPh': 'https://…',
    'eventForm.noLinks': 'Nincsenek további linkek.',
    'eventForm.sectionImage': 'Borítókép',
    'eventForm.cancelBtn': 'Mégse',
    'eventForm.saveBtn': 'Módosítások mentése',
    'eventForm.savingBtn': 'Mentés…',
    'eventForm.createBtn': 'Esemény létrehozása',
    'eventForm.creatingBtn': 'Létrehozás…',
    'eventForm.loadError': 'Az esemény nem található, vagy nincs jogosultsága a szerkesztéséhez.',
    'eventForm.saveError': 'Mentés sikertelen.',
    'eventForm.previewTitle': 'Heti áttekintés',
    'eventForm.previewEmpty': 'Ezen a héten nincs más esemény.',

    // --- Event controls (cancel / reschedule / relocate) ---
    'eventControls.title': 'Esemény kezelése',
    'eventControls.hint': 'Ezek a műveletek nyilvánosan hatnak az eseményre és visszavonhatatlanok lehetnek.',
    'eventControls.reschedule': 'Átütemezés',
    'eventControls.newStart': 'Új kezdési időpont',
    'eventControls.newEnd': 'Új befejezési időpont (opcionális)',
    'eventControls.rescheduleBtn': 'Átütemez',
    'eventControls.relocate': 'Helyszín módosítása',
    'eventControls.newLocation': 'Új helyszín',
    'eventControls.locationPh': 'Válassz helyszínt…',
    'eventControls.relocateBtn': 'Helyszín módosítása',
    'eventControls.cancel': 'Esemény lemondása',
    'eventControls.cancelHint': 'Korai visszamondás esetén az esemény végleg törlődhet.',
    'eventControls.cancelBtn': 'Esemény lemondása',
    'eventControls.confirmHint': 'Biztos vagy benne? Ez a művelet nem vonható vissza.',
    'eventControls.keepBtn': 'Megtartom az eseményt',
    'eventControls.confirmBtn': 'Igen, lemond',
    'eventControls.cancellingBtn': 'Visszamondás…',
    'eventControls.savingBtn': 'Mentés…',
    'eventControls.rescheduled': 'Az esemény sikeresen átütemezve.',
    'eventControls.relocated': 'A helyszín sikeresen módosítva.',

    // --- Organiser profile ---
    'profile.breadcrumb': 'Szervezet',
    'profile.title': 'Szervezet',
    'profile.nameLabel': 'Szervezet neve *',
    'profile.namePh': 'pl. Budapest.js',
    'profile.descLabel': 'Leírás',
    'profile.descPh': 'Rövid leírás a szervezetről és az eseményekről…',
    'profile.urlLabel': 'Weboldal URL',
    'profile.urlPh': 'https://example.com',
    'profile.saveBtn': 'Módosítások mentése',
    'profile.savingBtn': 'Mentés…',
    'profile.cancelBtn': 'Mégse',
    'profile.saveSuccess': 'Profil sikeresen elmentve.',
    'profile.loadError': 'A profil betöltése sikertelen.',
    'profile.saveError': 'A profil mentése sikertelen.',
    'profile.dangerTitle': 'Veszélyes zóna',
    'profile.deleteTitle': 'Fiók törlése',
    'profile.deleteDesc': 'Véglegesen törli a bejelentkezési fiókot, a jövőbeli eseményeket, és névtelenné teszi a korábbi eseményeket. Ez a művelet nem vonható vissza.',
    'profile.deleteBtn': 'Fiók törlése',
    'profile.deleteConfirmHint': 'Teljesen biztos vagy benne? A fiókod és az összes jövőbeli esemény véglegesen törlődik.',
    'profile.deleteCancelBtn': 'Mégsem',
    'profile.deleteConfirmBtn': 'Igen, törlöm a fiókomat',
    'profile.deletingBtn': 'Törlés…',
    'profile.deleteError': 'A fiók törlése sikertelen.',

    // --- Locations ---
    'locations.title': 'Helyszíneim',
    'locations.newBtn': 'Új helyszín',
    'locations.empty': 'Még nincsenek helyszíneid.',
    'locations.nameLabel': 'Név *',
    'locations.namePh': 'pl. MOM Kulturális Központ',
    'locations.addressLabel': 'Cím',
    'locations.cityLabel': 'Város',
    'locations.latLabel': 'Szélességi fok',
    'locations.lngLabel': 'Hosszúsági fok',
    'locations.urlLabel': 'Weboldal URL',
    'locations.howLabel': 'Megközelítés',
    'locations.saveBtn': 'Mentés',
    'locations.cancelBtn': 'Mégse',
    'locations.editBtn': 'Szerkesztés',
    'locations.deleteBtn': 'Törlés',
    'locations.inUseError': 'Ez a helyszín eseményekhez van rendelve és nem törölhető.',

    // --- Admin: organisers list ---
    'adminOrganisers.title': 'Szervezők',
    'adminOrganisers.inviteBtn': 'Meghívó küldése',
    'adminOrganisers.empty': 'Még nincsenek szervezők.',
    'adminOrganisers.nameCol': 'Név',
    'adminOrganisers.emailCol': 'E-mail',
    'adminOrganisers.statusCol': 'Státusz',
    'adminOrganisers.eventsCol': 'Események',
    'adminOrganisers.locsCol': 'Helyszínek',
    'adminOrganisers.viewBtn': 'Megtekintés',
    'adminOrganisers.status.INVITED': 'Meghívott',
    'adminOrganisers.status.ACTIVE': 'Aktív',
    'adminOrganisers.status.DELETED': 'Törölt',

    // --- Admin: organiser detail tabs ---
    'adminDetail.events': 'Események',
    'adminDetail.locations': 'Helyszínek',
    'adminDetail.profile': 'Profil',

    // --- Admin: organiser profile edit ---
    'adminProfile.nameLabel': 'Szervezet neve *',
    'adminProfile.descLabel': 'Leírás',
    'adminProfile.urlLabel': 'Weboldal URL',
    'adminProfile.saveBtn': 'Módosítások mentése',
    'adminProfile.savingBtn': 'Mentés…',
    'adminProfile.saveSuccess': 'Profil sikeresen elmentve.',
    'adminProfile.saveError': 'Mentés sikertelen.',
    'adminProfile.dangerTitle': 'Veszélyes zóna',
    'adminProfile.deleteTitle': 'Szervező törlése',
    'adminProfile.deleteDesc': 'Véglegesen törli a szervező fiókját, a jövőbeli eseményeit, és névtelenné teszi a korábbi eseményeket. A szervező e-mail értesítést kap. Ez a művelet nem vonható vissza.',
    'adminProfile.deleteBtn': 'Szervező törlése',
    'adminProfile.deleteConfirmHint': 'Teljesen biztos vagy benne? A szervező fiókja és az összes jövőbeli eseménye véglegesen törlődik.',
    'adminProfile.deleteCancelBtn': 'Mégsem',
    'adminProfile.deleteConfirmBtn': 'Igen, törlöm a szervezőt',
    'adminProfile.deletingBtn': 'Törlés…',
    'adminProfile.deleteError': 'A szervező törlése sikertelen.',

    // --- Admin: upcoming ---
    'adminUpcoming.title': 'Közelgő események',
    'adminUpcoming.daysLabel': 'napra előre',
    'adminUpcoming.empty': 'Nincs közelgő esemény ebben az időszakban.',

    // --- Admin: invite modal ---
    'adminInvite.title': 'Szervező meghívása',
    'adminInvite.nameLabel': 'Szervezet neve *',
    'adminInvite.namePh': 'pl. Budapest.js',
    'adminInvite.emailLabel': 'E-mail cím *',
    'adminInvite.emailPh': 'szervezo@example.com',
    'adminInvite.sendBtn': 'Meghívó küldése',
    'adminInvite.sendingBtn': 'Küldés…',
    'adminInvite.cancelBtn': 'Mégse',

    // --- Docs ---
    'docs.title': 'Dokumentáció',
    'docs.subtitle.organiser': 'Referencia anyagok DunaDev szervezők számára.',
    'docs.subtitle.admin': 'Referencia anyagok DunaDev adminisztrátorok számára.',
    'docs.specTitle': 'Funkcionális specifikáció',
    'docs.specDesc': 'A DunaDev funkcióinak, üzleti szabályainak és tervezett viselkedésének teljes leírása. Mindenkinek ajánlott, aki mélyebben meg akarja érteni a rendszer működését.',
    'docs.manualTitle.organiser': 'Szervező felhasználói kézikönyv',
    'docs.manualTitle.admin': 'Adminisztrátori felhasználói kézikönyv',
    'docs.manualDesc.organiser': 'Lépésről lépésre útmutató mindenről, amire egy szervezőnek szüksége lehet események és helyszínek kezeléséhez a DunaDev-en.',
    'docs.manualDesc.admin': 'Lépésről lépésre útmutató a szervezők, események és rendszerkonfiguráció adminisztrátori kezeléséhez.',
    'docs.comingSoon': 'Hamarosan elérhető',

    // --- Image upload ---
    'imageUpload.hint': 'Kattints a feltöltéshez vagy húzd ide a képet',
    'imageUpload.change': 'Kép cseréje',
    'imageUpload.uploading': 'Feltöltés…',
    'imageUpload.error': 'A kép feltöltése sikertelen.',

    // --- Generic ---
    'generic.loading': 'Betöltés…',
    'generic.error': 'Valami hiba történt. Kérjük, próbálja meg újra.',
    'generic.required': '*',
};
```

The English file (`en.ts`) has exactly the same keys with English values — most keys already have
the current hardcoded English text. Do not repeat the key set here; derive `en.ts` mechanically
from the Hungarian source by translating each value.

---

## I18nService

```typescript
// src/app/services/i18n.service.ts
import {Injectable, signal, computed} from '@angular/core';
import {HU} from '../i18n/hu';
import {EN} from '../i18n/en';

export type Locale = 'hu' | 'en';

@Injectable({providedIn: 'root'})
export class I18nService {
    readonly locale = signal<Locale>(
        (localStorage.getItem('dunadev-locale') as Locale | null) ?? 'hu'
    );

    private readonly dict = computed<Record<string, string>>(() =>
        this.locale() === 'hu' ? HU : EN
    );

    t(key: string, params?: Record<string, string>): string {
        let value = this.dict()[key] ?? key;  // key itself is the fallback (shows missing keys visibly)
        if (params) {
            for (const [k, v] of Object.entries(params)) {
                value = value.replaceAll(`{{${k}}}`, v);
            }
        }
        return value;
    }

    setLocale(locale: Locale): void {
        localStorage.setItem('dunadev-locale', locale);
        this.locale.set(locale);
    }
}
```

---

## TranslatePipe

```typescript
// src/app/pipes/translate.pipe.ts
import {Pipe, PipeTransform, inject} from '@angular/core';
import {I18nService} from '../services/i18n.service';

@Pipe({name: 'translate', pure: false, standalone: true})
export class TranslatePipe implements PipeTransform {
    private readonly i18n = inject(I18nService);

    transform(key: string, params?: Record<string, string>): string {
        return this.i18n.t(key, params);
    }
}
```

`pure: false` is intentional and correct here — it tells Angular to re-evaluate the pipe on
every change detection cycle, which ensures the UI updates when `locale` signal changes. The
performance cost is negligible given locale changes are rare.

---

## Template Usage Patterns

### Simple string

```html
<!-- before -->
<span>About</span>
<!-- after -->
<span>{{ 'nav.about' | translate }}</span>
```

### Attribute / aria-label

```html
<!-- before -->
<button aria-label="Close">✕</button>
<!-- after -->
<button [attr.aria-label]="'modal.closeBtn' | translate">✕</button>
```

### Placeholder

```html
<!-- before -->
<input placeholder="e.g. Budapest.js">
<!-- after -->
<input [placeholder]="'profile.namePh' | translate">
```

### Interpolated string with parameters

```html
<!-- before -->
<p>&copy; {{ year }} DunaDev. All rights reserved.</p>
<!-- after -->
<p>{{ 'footer.copy' | translate : { year: year.toString() } }}</p>
```

### In-class usage (for error messages, conditional labels, etc.)

```typescript
// inject the service directly in the component class when needed
private readonly
i18n = inject(I18nService);

// then in methods:
this.loadError.set(this.i18n.t('generic.error'));
```

### innerHTML-bound strings (landing hero title contains a `<span>`)

NEVER bind innerHTML. Split the string into multiple sections and bind them separately. If one of
the languages requires fewer segments, that's fine - it's the author's responsibility to make sure
the strings are translated correctly.

---

## Language Toggle in Navbar

In `app.ts`:

1. Inject `I18nService`.
2. Add a toggle button between the nav links and the sign-in button:

```html
<!-- desktop -->
<button class="lang-toggle" (click)="toggleLocale()">
    {{ i18n.locale() === 'hu' ? 'EN' : 'HU' }}
</button>

<!-- mobile menu (same button, inside .mobile-menu) -->
<button class="lang-toggle mobile-lang" (click)="toggleLocale()">
    {{ i18n.locale() === 'hu' ? 'EN' : 'HU' }}
</button>
```

```typescript
toggleLocale()
:
void {
    this.i18n.setLocale(this.i18n.locale() === 'hu' ? 'en' : 'hu');
}
```

Style `.lang-toggle` as a small text button with a border — similar to `.btn.btn-secondary.btn-sm`
but compact (e.g., `min-width: 38px`, monospace/small-caps for the locale label).

---

## Implementation Order

Execute the steps below in this sequence. Each step is self-contained; stop after each to verify
the build is clean before proceeding.

### Step 1 — Infrastructure

1. Create `src/app/i18n/hu.ts` with the complete key set from this document.
2. Create `src/app/i18n/en.ts` — translate every value to English (the current hardcoded strings
   are English, so this is largely a copy-paste from the existing component templates).
3. Create `src/app/services/i18n.service.ts`.
4. Create `src/app/pipes/translate.pipe.ts`.

### Step 2 — Navbar + footer (`app.ts`)

Add the language toggle button and translate all static navbar/footer strings. The toggle must
work before any other component is migrated so it can be tested in isolation.

### Step 3 — Landing page (`landing.component.ts`)

High-traffic, highest impact. Translate: eyebrow, hero title (using `[innerHTML]`), hero body,
panel label, no-upcoming message, month navigation ("Előző"/"Következő"), "Ma" link, empty-month
message, all badge labels (Free, Paid, Registration required, Cancelled, On new date, On new
location). Update `statusLabel()` to return `this.i18n.t('badge.onNewDate')` etc. — since this
is a class method, inject `I18nService` and call `t()` directly.

### Step 4 — Shared components (`event-modal.component.ts`, `event-card.component.ts`)

These appear on both the public landing page and authenticated views.

### Step 5 — Auth views (`login.component.ts`, `change-password.component.ts`)

### Step 6 — Management sidebars (`management.component.ts`, `admin-shell.component.ts`)

### Step 7 — Organiser views

- `manage-events.component.ts`
- `event-create.component.ts`
- `event-edit.component.ts`
- `organiser-profile.component.ts`
- `locations.component.ts`

### Step 8 — Admin views

- `admin-organisers.component.ts`
- `admin-upcoming.component.ts`
- `admin-organiser-edit.component.ts`
- `admin-organiser-events.component.ts`
- `admin-organiser-locations.component.ts`
- `admin-event-edit.component.ts`

### Step 9 — Static content pages (`about.component.ts`, `contact.component.ts`,
`docs.component.ts`)

These are mostly long prose. Add translation keys for each paragraph. For `docs.component.ts`,
the subtitle and card text differ by role — the keys `docs.subtitle.organiser` /
`docs.subtitle.admin` handle this; use
`i18n.t(isAdmin() ? 'docs.subtitle.admin' : 'docs.subtitle.organiser')`.

### Step 10 — Shared utility (`image-upload.component.ts`)

### Step 11 — Final build verification

`npm run build` must produce zero TypeScript errors and zero warnings beyond the pre-existing
leaflet CJS warning.

---

## Per-Component Migration Checklist

For each component in steps 3–10:

1. Add `TranslatePipe` to the component's `imports: [...]` array.
2. Inject `I18nService` in the class body **only if** the component has class-level string usage
   (error messages set via `signal.set(...)`, method return values, etc.). Do not inject it
   merely for template-only usage — the pipe handles that.
3. Replace every hardcoded static string in the template with `{{ 'key' | translate }}` (or
   `[attr]="'key' | translate"` for attributes).
4. In class methods that produce string values (e.g., `statusLabel()`, `loadError.set('...')`),
   replace the literal with `this.i18n.t('key')`.
5. Do **not** translate: event titles, descriptions, organiser names, location names, URL values,
   error messages from the backend (display them verbatim or use a generic `'generic.error'` key).

---

## Date / Number Locale (Phase 2 — Deferred)

Angular's `DatePipe` uses the `LOCALE_ID` token which is set at bootstrap time and cannot change
at runtime. The current English-format dates (`MMM d, y`, `HH:mm`, `EEEE, MMMM d, y`) will
remain unchanged in phase 1.

For phase 2, create a `LocaleDatePipe` that wraps `formatDate()` from `@angular/common` and
passes the current locale from `I18nService`:

```typescript

@Pipe({name: 'localeDate', pure: false, standalone: true})
export class LocaleDatePipe implements PipeTransform {
    private readonly i18n = inject(I18nService);

    transform(value: string | Date, format = 'mediumDate'): string {
        return formatDate(value, format, this.i18n.locale() === 'hu' ? 'hu' : 'en-GB');
    }
}
```

Then replace `| date:'...'` with `| localeDate:'...'` across all templates that show event
dates. This also requires registering the Hungarian locale data in `app.config.ts`:

```typescript
import localHu from '@angular/common/locales/hu';

registerLocaleData(localeHu);
```

Defer phase 2 until the rest of i18n is complete and stable.

---

## Known Pitfalls

- **Signal reactivity in pipe**: `pure: false` is load-bearing. Do not change it to `pure: true`
  — the pipe would only recalculate when the `key` argument changes, not when the locale changes.

- **`[innerHTML]` for hero title**: The landing hero `<h1>` uses a `<span class="text-gradient">`
  inside the heading. Store the inner HTML in the translation value and bind with `[innerHTML]`.
  This is safe because translation values come from the bundled source, not from user input.

- **Error messages from the backend**: These are in English (Spring's `ResponseStatusException`
  messages). Display them verbatim — do not attempt to intercept and translate HTTP error bodies.
  Reserve i18n error messages for client-side validation only (e.g., password mismatch).

- **Month names in the landing month-grid navigation**: The month name is already derived from
  `Date` object via `toLocaleString('hu-HU', { month: 'long' })` or equivalent. Switch the
  `toLocaleString` locale argument based on `i18n.locale()` rather than adding translation keys
  for all 12 months. Use `'hu-HU'` when `locale() === 'hu'` and `'en-GB'` otherwise.

- **`statusLabel()` in `landing.component.ts`**: This is a class method that returns a string.
  Inject `I18nService` in `LandingComponent` and replace the `switch` return values with
  `this.i18n.t('badge.onNewDate')`, `this.i18n.t('badge.cancelled')`, etc.

- **`PasswordRule.label` in `change-password.component.ts`**: These are defined as static strings
  inside the class constructor as a `PasswordRule[]`. Replace the string literals with
  `i18n.t('password.rules.minLength')` etc., and make them `computed` signals so they react to
  locale changes:
  ```typescript
  readonly passwordRules = computed(() => [
    { label: this.i18n.t('password.rules.minLength'), passed: this.hasMinLength },
    ...
  ]);
  ```

- **New keys discovered during migration**: When you find a string not covered by this document,
  add it to both `hu.ts` and `en.ts` immediately before using it in the template. Do not leave
  any key in `en.ts` without a corresponding entry in `hu.ts`.
