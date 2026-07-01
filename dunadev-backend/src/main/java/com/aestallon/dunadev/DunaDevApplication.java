package com.aestallon.dunadev;

import com.aestallon.dunadev.entity.*;
import com.aestallon.dunadev.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@SpringBootApplication
public class DunaDevApplication {

  public static void main(String[] args) {
    SpringApplication.run(DunaDevApplication.class, args);
  }

  @Bean
  CommandLineRunner seedTestData(UserRepository userRepository,
                                 OrganiserRepository organiserRepository,
                                 LocationRepository locationRepository,
                                 EventRepository eventRepository,
                                 PasswordEncoder passwordEncoder) {
    return args -> {
      if (userRepository.count() > 0) {
        return;
      }

      var hashedPassword = passwordEncoder.encode("asd");
      var cetOffset = ZoneOffset.of("+02:00");

      // --- Admin user ---
      var adminUser = UserEntity.builder()
          .email("admin@dunadev.hu")
          .passwordHash(hashedPassword)
          .role("ADMIN")
          .build();
      userRepository.save(adminUser);

      // --- Organiser 1: Budapest.js ---
      var bjsUser = UserEntity.builder()
          .email("budapestjs@dunadev.hu")
          .passwordHash(hashedPassword)
          .role("ORGANISER")
          .build();
      userRepository.save(bjsUser);

      var budapestJs = OrganiserEntity.builder()
          .user(bjsUser)
          .name("Budapest.js")
          .status("ACTIVE")
          .description("Monthly JavaScript meetup in Budapest covering frontend, backend, and everything in between.")
          .websiteUrl("https://www.meetup.com/budapest-js/")
          .build();
      organiserRepository.save(budapestJs);

      // --- Organiser 2: Budapest.py ---
      var bpyUser = UserEntity.builder()
          .email("budapestpy@dunadev.hu")
          .passwordHash(hashedPassword)
          .role("ORGANISER")
          .build();
      userRepository.save(bpyUser);

      var budapestPy = OrganiserEntity.builder()
          .user(bpyUser)
          .name("Budapest.py")
          .status("ACTIVE")
          .description("Python community meetup in Budapest for developers of all levels.")
          .websiteUrl("https://www.meetup.com/budapest-py/")
          .build();
      organiserRepository.save(budapestPy);

      // --- Organiser 3: HWSW ---
      var hwswUser = UserEntity.builder()
          .email("hwsw@dunadev.hu")
          .passwordHash(hashedPassword)
          .role("ORGANISER")
          .build();
      userRepository.save(hwswUser);

      var hwsw = OrganiserEntity.builder()
          .user(hwswUser)
          .name("HWSW")
          .status("ACTIVE")
          .description("Hungary's leading IT professional community, organising meetups and conferences.")
          .websiteUrl("https://hwsw.hu")
          .build();
      organiserRepository.save(hwsw);

      // --- Organiser 4: Craft Conf ---
      var craftUser = UserEntity.builder()
          .email("craftconf@dunadev.hu")
          .passwordHash(hashedPassword)
          .role("ORGANISER")
          .build();
      userRepository.save(craftUser);

      var craftConf = OrganiserEntity.builder()
          .user(craftUser)
          .name("Craft Conf")
          .status("ACTIVE")
          .description("International software craftsmanship conference held annually in Budapest.")
          .websiteUrl("https://craft-conf.com")
          .build();
      organiserRepository.save(craftConf);

      // --- Locations ---
      var kaptarLocation = LocationEntity.builder()
          .organiser(budapestJs)
          .name("Kaptár Coworking")
          .address("Nagymező utca 44.")
          .city("Budapest")
          .latitude(47.5025)
          .longitude(19.0575)
          .websiteUrl("https://kaptarbudapest.hu")
          .build();
      locationRepository.save(kaptarLocation);

      var logMeInLocation = LocationEntity.builder()
          .organiser(budapestPy)
          .name("LogMeIn Budapest Office")
          .address("Pauler utca 12.")
          .city("Budapest")
          .latitude(47.4979)
          .longitude(19.0330)
          .build();
      locationRepository.save(logMeInLocation);

      var budapestCongressCenter = LocationEntity.builder()
          .organiser(craftConf)
          .name("Budapest Congress Center")
          .address("Jagelló út 1-3.")
          .city("Budapest")
          .latitude(47.4734)
          .longitude(19.0370)
          .websiteUrl("https://www.bcc.hu")
          .build();
      locationRepository.save(budapestCongressCenter);

      var hwswOnline = LocationEntity.builder()
          .organiser(hwsw)
          .name("HWSW Online")
          .city("Budapest")
          .build();
      locationRepository.save(hwswOnline);

      var moltLocation = LocationEntity.builder()
          .organiser(hwsw)
          .name("Molt Budapest")
          .address("Nádor utca 3.")
          .city("Budapest")
          .latitude(47.5008)
          .longitude(19.0465)
          .build();
      locationRepository.save(moltLocation);

      // --- Events (mix of past, upcoming this month, and future) ---

      // Past event
      var pastEvent1 = EventEntity.builder()
          .organiser(budapestJs)
          .location(kaptarLocation)
          .title("Budapest.js June Meetup: React Server Components Deep Dive")
          .description("An evening of talks about React Server Components, including practical migration strategies and performance tips.")
          .startsAt(OffsetDateTime.of(LocalDate.of(2026, 6, 12), LocalTime.of(18, 30), cetOffset))
          .endsAt(OffsetDateTime.of(LocalDate.of(2026, 6, 12), LocalTime.of(21, 0), cetOffset))
          .free(true)
          .registrationRequired(true)
          .registrationUrl("https://www.meetup.com/budapest-js/events/fake-1")
          .eventUrl("https://www.meetup.com/budapest-js/events/fake-1")
          .build();
      eventRepository.save(pastEvent1);

      var pastEvent2 = EventEntity.builder()
          .organiser(budapestPy)
          .location(logMeInLocation)
          .title("Budapest.py: FastAPI in Production")
          .description("Lessons learned running FastAPI at scale — auth patterns, async pitfalls, and observability.")
          .startsAt(OffsetDateTime.of(LocalDate.of(2026, 6, 18), LocalTime.of(18, 0), cetOffset))
          .endsAt(OffsetDateTime.of(LocalDate.of(2026, 6, 18), LocalTime.of(20, 30), cetOffset))
          .free(true)
          .registrationRequired(true)
          .registrationUrl("https://www.meetup.com/budapest-py/events/fake-2")
          .build();
      eventRepository.save(pastEvent2);

      // Upcoming events (July 2026)
      var upcomingEvent1 = EventEntity.builder()
          .organiser(budapestJs)
          .location(kaptarLocation)
          .title("Budapest.js July: TypeScript 6 Features You Should Know")
          .description("Exploring the latest TypeScript 6 features including type-level pattern matching and improved inference.")
          .startsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 9), LocalTime.of(18, 30), cetOffset))
          .endsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 9), LocalTime.of(21, 0), cetOffset))
          .free(true)
          .registrationRequired(true)
          .registrationUrl("https://www.meetup.com/budapest-js/events/fake-3")
          .eventUrl("https://www.meetup.com/budapest-js/events/fake-3")
          .build();
      eventRepository.save(upcomingEvent1);

      var upcomingEvent2 = EventEntity.builder()
          .organiser(hwsw)
          .location(hwswOnline)
          .title("HWSW free! — Cloud Native Security Workshop")
          .description("Hands-on workshop on securing Kubernetes workloads, supply chain security, and runtime protection.")
          .startsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 3), LocalTime.of(10, 0), cetOffset))
          .endsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 3), LocalTime.of(16, 0), cetOffset))
          .free(true)
          .registrationRequired(true)
          .registrationUrl("https://hwsw.hu/esemenyek/fake-4")
          .eventUrl("https://hwsw.hu/esemenyek/fake-4")
          .build();
      eventRepository.save(upcomingEvent2);

      var upcomingEvent3 = EventEntity.builder()
          .organiser(budapestPy)
          .location(logMeInLocation)
          .title("Budapest.py: Machine Learning Pipelines with DVC")
          .description("How to version your ML experiments and build reproducible training pipelines with DVC and MLflow.")
          .startsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 15), LocalTime.of(18, 0), cetOffset))
          .endsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 15), LocalTime.of(20, 30), cetOffset))
          .free(true)
          .registrationRequired(true)
          .registrationUrl("https://www.meetup.com/budapest-py/events/fake-5")
          .build();
      eventRepository.save(upcomingEvent3);

      var upcomingEvent4 = EventEntity.builder()
          .organiser(hwsw)
          .location(moltLocation)
          .title("HWSW Meetup — Observability Beyond Logs")
          .description("Talks on OpenTelemetry, distributed tracing, and building a culture of observability in engineering teams.")
          .startsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 22), LocalTime.of(18, 0), cetOffset))
          .endsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 22), LocalTime.of(20, 0), cetOffset))
          .free(true)
          .registrationRequired(false)
          .eventUrl("https://hwsw.hu/esemenyek/fake-6")
          .build();
      eventRepository.save(upcomingEvent4);

      // August events
      var augEvent1 = EventEntity.builder()
          .organiser(budapestJs)
          .location(kaptarLocation)
          .title("Budapest.js August: Signals, Reactivity, and the Future of State Management")
          .description("Comparing Angular Signals, Solid.js, and Preact Signals — what they mean for the JS ecosystem.")
          .startsAt(OffsetDateTime.of(LocalDate.of(2026, 8, 13), LocalTime.of(18, 30), cetOffset))
          .endsAt(OffsetDateTime.of(LocalDate.of(2026, 8, 13), LocalTime.of(21, 0), cetOffset))
          .free(true)
          .registrationRequired(true)
          .registrationUrl("https://www.meetup.com/budapest-js/events/fake-7")
          .build();
      eventRepository.save(augEvent1);

      var augEvent2 = EventEntity.builder()
          .organiser(craftConf)
          .location(budapestCongressCenter)
          .title("Craft Conf 2026 — Early Bird Registration Open")
          .description("Two days of talks and workshops on software craft, architecture, and team dynamics. Speakers TBA.")
          .startsAt(OffsetDateTime.of(LocalDate.of(2026, 8, 27), LocalTime.of(9, 0), cetOffset))
          .endsAt(OffsetDateTime.of(LocalDate.of(2026, 8, 28), LocalTime.of(17, 0), cetOffset))
          .free(false)
          .registrationRequired(true)
          .registrationUrl("https://craft-conf.com/2026/register")
          .eventUrl("https://craft-conf.com/2026")
          .build();
      eventRepository.save(augEvent2);

      // A cancelled event
      var cancelledEvent = EventEntity.builder()
          .organiser(budapestPy)
          .location(logMeInLocation)
          .title("Budapest.py: Data Engineering with Polars")
          .description("Originally planned to cover Polars for data engineering workloads.")
          .startsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 29), LocalTime.of(18, 0), cetOffset))
          .endsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 29), LocalTime.of(20, 30), cetOffset))
          .free(true)
          .registrationRequired(true)
          .status("CANCELLED")
          .cancellationReason("Speaker unavailable — will be rescheduled to September.")
          .build();
      eventRepository.save(cancelledEvent);

      // Event with links
      var eventWithLinks = EventEntity.builder()
          .organiser(hwsw)
          .location(moltLocation)
          .title("HWSW Meetup — AI-Assisted Development in Practice")
          .description("Panel discussion and demos on using AI coding assistants in professional software development workflows.")
          .startsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 10), LocalTime.of(18, 0), cetOffset))
          .endsAt(OffsetDateTime.of(LocalDate.of(2026, 7, 10), LocalTime.of(20, 30), cetOffset))
          .free(true)
          .registrationRequired(false)
          .eventUrl("https://hwsw.hu/esemenyek/fake-8")
          .build();
      eventRepository.save(eventWithLinks);

      var link1 = EventLinkEntity.builder()
          .event(eventWithLinks)
          .label("Slides")
          .url("https://speakerdeck.com/fake-slides")
          .build();
      var link2 = EventLinkEntity.builder()
          .event(eventWithLinks)
          .label("Recording")
          .url("https://youtube.com/watch?v=fake-recording")
          .build();
      eventWithLinks.getLinks().add(link1);
      eventWithLinks.getLinks().add(link2);
      eventRepository.save(eventWithLinks);
    };
  }
}
