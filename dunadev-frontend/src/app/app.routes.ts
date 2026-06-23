import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ManagementComponent } from './components/management/management.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'manage', component: ManagementComponent },
  { path: '**', redirectTo: '' }
];
