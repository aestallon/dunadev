package com.aestallon.dunadev.service;

import com.aestallon.dunadev.entity.EventEntity;
import com.aestallon.dunadev.entity.EventLinkEntity;
import com.aestallon.dunadev.entity.OrganiserEntity;
import com.aestallon.dunadev.entity.UserEntity;
import com.aestallon.dunadev.repository.EventRepository;
import com.aestallon.dunadev.repository.LocationRepository;
import com.aestallon.dunadev.repository.OrganiserRepository;
import com.aestallon.dunadev.repository.UserRepository;
import com.aestallon.dunadev.rest.NotFoundException;
import com.aestallon.dunadev.rest.model.*;
import com.aestallon.dunadev.rest.model.EventRescheduleRequest;
import com.aestallon.dunadev.rest.model.EventRelocateRequest;
import com.aestallon.dunadev.service.mail.EmailService;
import com.aestallon.dunadev.service.media.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

  private static final String UPPER  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static final String LOWER  = "abcdefghijklmnopqrstuvwxyz";
  private static final String DIGITS = "0123456789";
  private static final String ALL    = UPPER + LOWER + DIGITS;
  private static final SecureRandom RANDOM = new SecureRandom();

  private final OrganiserRepository organiserRepository;
  private final EventRepository eventRepository;
  private final LocationRepository locationRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final EmailService emailService;
  private final ImageStorageService imageStorageService;
  private final OrganiserService organiserService;

  @Value("${dunadev.admin-email}")
  private String adminEmail;

  @Value("${dunadev.event-critical-days}")
  private int ecdDays;

  // ── List ──────────────────────────────────────────────────────────────────

  @Transactional(readOnly = true)
  public List<AdminOrganiserSummary> listOrganisers() {
    return organiserRepository.findAll().stream()
        .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
        .map(this::toSummary)
        .toList();
  }

  // ── Get single ────────────────────────────────────────────────────────────

  @Transactional(readOnly = true)
  public OrganiserProfile getOrganiser(Long id) {
    var o = organiserRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    return toProfile(o);
  }

  // ── Create (invite) ───────────────────────────────────────────────────────

  @Transactional
  public AdminOrganiserSummary createOrganiser(AdminOrganiserCreateRequest request) {
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT,
          "Email address is already registered");
    }

    String rawPassword = generatePassword();

    var user = UserEntity.builder()
        .email(request.getEmail())
        .passwordHash(passwordEncoder.encode(rawPassword))
        .role("ORGANISER")
        .build();
    user = userRepository.save(user);

    var organiser = OrganiserEntity.builder()
        .user(user)
        .name(request.getName())
        .status("INVITED")
        .build();
    organiser = organiserRepository.save(organiser);

    emailService.sendInvitation(request.getEmail(), request.getName(), rawPassword, adminEmail);

    return toSummary(organiser);
  }

  // ── Delete organiser ─────────────────────────────────────────────────────

  @Transactional
  public void deleteOrganiser(Long id) {
    organiserService.deleteOrganiserById(id);
  }

  // ── Update organiser ──────────────────────────────────────────────────────

  @Transactional
  public OrganiserProfile updateOrganiser(Long id, OrganiserUpdateRequest request) {
    var o = organiserRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    o.setName(request.getName());
    o.setDescription(request.getDescription());
    o.setWebsiteUrl(request.getWebsiteUrl());
    return toProfile(organiserRepository.save(o));
  }

  // ── Activate on first login ───────────────────────────────────────────────

  @Transactional
  public void activateIfInvited(String email) {
    organiserRepository.findByUserEmail(email).ifPresent(o -> {
      if ("INVITED".equals(o.getStatus())) {
        o.setStatus("ACTIVE");
        organiserRepository.save(o);
      }
    });
  }

  // ── Events ────────────────────────────────────────────────────────────────

  @Transactional(readOnly = true)
  public List<EventSummary> getOrganiserEvents(Long organiserId) {
    organiserRepository.findById(organiserId)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    return eventRepository.findByOrganiserIdOrderByStartsAtDesc(organiserId)
        .stream()
        .map(PublicEventService::toSummary)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<EventSummary> getUpcomingEvents(int days) {
    var now = OffsetDateTime.now(ZoneOffset.UTC);
    return eventRepository.findAdminUpcoming(now, now.plusDays(days))
        .stream()
        .map(PublicEventService::toSummary)
        .toList();
  }

  @Transactional(readOnly = true)
  public EventSummary getEvent(Long id) {
    return PublicEventService.toSummary(
        eventRepository.findByIdAdmin(id)
            .orElseThrow(() -> new NotFoundException("Event not found")));
  }

  @Transactional
  public EventSummary updateEvent(Long id, EventUpdateRequest request) {
    var event = eventRepository.findByIdAdmin(id)
        .orElseThrow(() -> new NotFoundException("Event not found"));
    event.setTitle(request.getTitle());
    event.setDescription(request.getDescription());
    event.setEventUrl(request.getEventUrl());
    event.setFree(Boolean.TRUE.equals(request.getFree()));
    event.setRegistrationRequired(Boolean.TRUE.equals(request.getRegistrationRequired()));
    event.setRegistrationUrl(request.getRegistrationUrl());
    event.setVisibleFrom(request.getVisibleFrom());
    event.getLinks().clear();
    if (request.getLinks() != null) {
      for (var lr : request.getLinks()) {
        event.getLinks().add(EventLinkEntity.builder()
            .event(event).label(lr.getLabel()).url(lr.getUrl()).build());
      }
    }
    return PublicEventService.toSummary(eventRepository.save(event));
  }

  // ── Event alteration ─────────────────────────────────────────────────────

  @Transactional
  public void cancelAdminEvent(Long id) {
    var event = eventRepository.findByIdAdmin(id)
        .orElseThrow(() -> new NotFoundException("Event not found"));
    var now = OffsetDateTime.now(ZoneOffset.UTC);
    if (!now.isBefore(event.getStartsAt())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot cancel a past or ongoing event");
    }
    if (now.isBefore(criticalThreshold(event))) {
      eventRepository.delete(event);
    } else {
      event.setStatus("CANCELLED");
      eventRepository.save(event);
    }
  }

  @Transactional
  public EventSummary rescheduleAdminEvent(Long id, EventRescheduleRequest req) {
    var event = eventRepository.findByIdAdmin(id)
        .orElseThrow(() -> new NotFoundException("Event not found"));
    if ("CANCELLED".equals(event.getStatus())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot reschedule a cancelled event");
    }
    var now = OffsetDateTime.now(ZoneOffset.UTC);
    if (!now.isBefore(event.getStartsAt())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot reschedule a past or ongoing event");
    }
    var originalThreshold = criticalThreshold(event);
    event.setStartsAt(req.getStartsAt());
    event.setEndsAt(req.getEndsAt());
    if (!now.isBefore(originalThreshold)) {
      event.setStatus("RESCHEDULED");
    }
    return PublicEventService.toSummary(eventRepository.save(event));
  }

  @Transactional
  public EventSummary relocateAdminEvent(Long id, EventRelocateRequest req) {
    var event = eventRepository.findByIdAdmin(id)
        .orElseThrow(() -> new NotFoundException("Event not found"));
    if ("CANCELLED".equals(event.getStatus())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot relocate a cancelled event");
    }
    var now = OffsetDateTime.now(ZoneOffset.UTC);
    if (!now.isBefore(event.getStartsAt())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot relocate a past or ongoing event");
    }
    var location = locationRepository.findById(req.getLocationId())
        .orElseThrow(() -> new NotFoundException("Location not found"));
    event.setLocation(location);
    if (!now.isBefore(criticalThreshold(event))) {
      event.setOnNewLocation(true);
    }
    return PublicEventService.toSummary(eventRepository.save(event));
  }

  private OffsetDateTime criticalThreshold(EventEntity event) {
    return event.getStartsAt().minusDays(ecdDays);
  }

  // ── Locations ─────────────────────────────────────────────────────────────

  @Transactional(readOnly = true)
  public List<LocationSummary> getOrganiserLocations(Long organiserId) {
    organiserRepository.findById(organiserId)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    return locationRepository.findByOrganiserIdAndActiveTrue(organiserId)
        .stream()
        .map(LocationService::toSummary)
        .toList();
  }

  @Transactional
  public LocationSummary updateLocationById(Long locationId, LocationRequest request) {
    var location = locationRepository.findById(locationId)
        .orElseThrow(() -> new NotFoundException("Location not found"));
    location.setName(request.getName());
    location.setAddress(request.getAddress());
    location.setCity(request.getCity());
    location.setLatitude(request.getLatitude());
    location.setLongitude(request.getLongitude());
    location.setWebsiteUrl(request.getWebsiteUrl());
    location.setHowToGetThere(request.getHowToGetThere());
    return LocationService.toSummary(locationRepository.save(location));
  }

  // ── Event image ───────────────────────────────────────────────────────────

  @Transactional
  public EventSummary uploadEventImage(Long eventId, MultipartFile file) {
    var event = eventRepository.findByIdAdmin(eventId)
        .orElseThrow(() -> new NotFoundException("Event not found"));
    var url = imageStorageService.storeImage(file);
    event.setCoverImageUrl(url);
    return PublicEventService.toSummary(eventRepository.save(event));
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private AdminOrganiserSummary toSummary(OrganiserEntity o) {
    long eventCount    = eventRepository.countByOrganiser(o);
    long locationCount = locationRepository.countByOrganiserAndActiveTrue(o);
    var status = AdminOrganiserSummary.StatusEnum.fromValue(o.getStatus());
    var s = new AdminOrganiserSummary(o.getId(), o.getName(), status,
        (int) eventCount, (int) locationCount, o.getUser().getEmail());
    s.setDescription(o.getDescription());
    s.setLogoUrl(o.getLogoUrl());
    s.setWebsiteUrl(o.getWebsiteUrl());
    return s;
  }

  private static OrganiserProfile toProfile(OrganiserEntity o) {
    var p = new OrganiserProfile(o.getId(), o.getName());
    p.setDescription(o.getDescription());
    p.setWebsiteUrl(o.getWebsiteUrl());
    p.setLogoUrl(o.getLogoUrl());
    return p;
  }

  private static String generatePassword() {
    var chars = new ArrayList<Character>();
    chars.add(UPPER.charAt(RANDOM.nextInt(UPPER.length())));
    chars.add(LOWER.charAt(RANDOM.nextInt(LOWER.length())));
    chars.add(DIGITS.charAt(RANDOM.nextInt(DIGITS.length())));
    for (int i = 0; i < 9; i++) {
      chars.add(ALL.charAt(RANDOM.nextInt(ALL.length())));
    }
    Collections.shuffle(chars, RANDOM);
    var sb = new StringBuilder(chars.size());
    chars.forEach(sb::append);
    return sb.toString();
  }
}
