export interface EventDescription {
  hu?: string;
  en?: string;
}

export interface EventLocation {
  name: string;
  googleMapsLink: string;
}

export interface DunaDevEvent {
  id: string;
  title: string;
  description: EventDescription;
  date: Date;
  location: EventLocation;
  externalLink: string;
}
