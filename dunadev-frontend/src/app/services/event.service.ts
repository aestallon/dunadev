import { Injectable, signal, computed } from '@angular/core';
import { DunaDevEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events = signal<DunaDevEvent[]>([
    {
      id: '1',
      title: 'Angular 22 Meetup',
      description: {
        en: 'A deep dive into the latest features of Angular 22.',
        hu: 'Mélymerülés az Angular 22 legújabb funkcióiba.',
      },
      date: new Date('2026-07-15T18:00:00'),
      location: {
        name: 'Tech Hub Budapest',
        googleMapsLink: 'https://goo.gl/maps/example1',
      },
      externalLink: 'https://meetup.com/example1',
    },
    {
      id: '2',
      title: 'Spring Boot 4 Workshop',
      description: {
        en: 'Learn how to build scalable microservices with Spring Boot 4.',
      },
      date: new Date('2026-07-20T10:00:00'),
      location: {
        name: 'Dev Center',
        googleMapsLink: 'https://goo.gl/maps/example2',
      },
      externalLink: 'https://meetup.com/example2',
    },
    {
      id: '3',
      title: 'AI in Web Development',
      description: {
        hu: 'Hogyan használjuk a mesterséges intelligenciát a webfejlesztésben.',
      },
      date: new Date('2026-08-05T19:00:00'),
      location: {
        name: 'Budapest Conference Hall',
        googleMapsLink: 'https://goo.gl/maps/example3',
      },
      externalLink: 'https://meetup.com/example3',
    },
    {
      id: '4',
      title: 'Future Meetup',
      description: {
        en: 'A meetup in the far future.',
      },
      date: new Date('2026-09-01T18:00:00'),
      location: {
        name: 'Online',
        googleMapsLink: 'https://maps.google.com',
      },
      externalLink: 'https://meetup.com/example4',
    },
  ]);

  readonly allEvents = this.events.asReadonly();

  readonly upcomingEvents = computed(() => {
    const now = new Date();
    return this.events()
      .filter((event) => event.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3);
  });

  addEvent(event: Omit<DunaDevEvent, 'id'>) {
    const newEvent: DunaDevEvent = {
      ...event,
      id: Math.random().toString(36).substring(2, 9),
    };
    this.events.update((events) => [...events, newEvent]);
  }
}
