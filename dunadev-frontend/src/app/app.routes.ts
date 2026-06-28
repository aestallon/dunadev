import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LoginComponent } from './components/login/login.component';
import { ManagementComponent } from './components/management/management.component';
import { LocationsComponent } from './components/locations/locations.component';
import { ManageEventsComponent } from './components/events/manage-events.component';
import { EventCreateComponent } from './components/events/event-create.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'manage', component: ManagementComponent, canActivate: [authGuard] },
  { path: 'manage/locations', component: LocationsComponent, canActivate: [authGuard] },
  { path: 'manage/events', component: ManageEventsComponent, canActivate: [authGuard] },
  { path: 'manage/events/new', component: EventCreateComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
