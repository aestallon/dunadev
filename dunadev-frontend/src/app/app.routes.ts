import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LoginComponent } from './components/login/login.component';
import { ManagementComponent } from './components/management/management.component';
import { LocationsComponent } from './components/locations/locations.component';
import { ManageEventsComponent } from './components/events/manage-events.component';
import { EventCreateComponent } from './components/events/event-create.component';
import { EventEditComponent } from './components/events/event-edit.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { OrganiserProfileComponent } from './components/organiser-profile/organiser-profile.component';
import { AdminShellComponent } from './components/admin/admin-shell.component';
import { AdminUpcomingComponent } from './components/admin/admin-upcoming.component';
import { AdminOrganisersComponent } from './components/admin/admin-organisers.component';
import { AdminOrganiserDetailComponent } from './components/admin/admin-organiser-detail.component';
import { AdminOrganiserEventsComponent } from './components/admin/admin-organiser-events.component';
import { AdminOrganiserEditComponent } from './components/admin/admin-organiser-edit.component';
import { AdminOrganiserLocationsComponent } from './components/admin/admin-organiser-locations.component';
import { AdminEventEditComponent } from './components/admin/admin-event-edit.component';
import { authGuard, adminGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'manage',
    component: ManagementComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'events', pathMatch: 'full' },
      { path: 'profile', component: OrganiserProfileComponent },
      { path: 'locations', component: LocationsComponent },
      { path: 'events', component: ManageEventsComponent },
      { path: 'events/new', component: EventCreateComponent },
      { path: 'events/:id/edit', component: EventEditComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'upcoming', pathMatch: 'full' },
      { path: 'upcoming', component: AdminUpcomingComponent },
      { path: 'organisers', component: AdminOrganisersComponent },
      {
        path: 'organisers/:id',
        component: AdminOrganiserDetailComponent,
        children: [
          { path: '', redirectTo: 'events', pathMatch: 'full' },
          { path: 'events', component: AdminOrganiserEventsComponent },
          { path: 'events/:eid/edit', component: AdminEventEditComponent },
          { path: 'locations', component: AdminOrganiserLocationsComponent },
          { path: 'edit', component: AdminOrganiserEditComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
