export * from './authentication.service';
import { AuthenticationService } from './authentication.service';
export * from './locations.service';
import { LocationsService } from './locations.service';
export * from './publicEvents.service';
import { PublicEventsService } from './publicEvents.service';
export const APIS = [AuthenticationService, LocationsService, PublicEventsService];
