export * from './authentication.service';
import { AuthenticationService } from './authentication.service';
export * from './publicEvents.service';
import { PublicEventsService } from './publicEvents.service';
export const APIS = [AuthenticationService, PublicEventsService];
