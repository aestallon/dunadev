package com.aestallon.dunadev.service;

import com.aestallon.dunadev.entity.EventEntity;
import com.aestallon.dunadev.entity.EventLinkEntity;
import com.aestallon.dunadev.entity.OrganiserEntity;
import com.aestallon.dunadev.repository.EventRepository;
import com.aestallon.dunadev.repository.LocationRepository;
import com.aestallon.dunadev.repository.OrganiserRepository;
import com.aestallon.dunadev.rest.NotFoundException;
import com.aestallon.dunadev.rest.model.EventRescheduleRequest;
import com.aestallon.dunadev.rest.model.EventRelocateRequest;
import com.aestallon.dunadev.rest.model.EventRequest;
import com.aestallon.dunadev.rest.model.EventSummary;
import com.aestallon.dunadev.rest.model.EventUpdateRequest;
import com.aestallon.dunadev.service.media.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganiserEventService {

  private final EventRepository eventRepository;
  private final LocationRepository locationRepository;
  private final OrganiserRepository organiserRepository;
  private final ImageStorageService imageStorageService;

  @Value("${dunadev.event-critical-days}")
  private int ecdDays;

  @Transactional(readOnly = true)
  public List<EventSummary> getMyEvents(String email) {
    var organiser = resolveOrganiser(email);
    return eventRepository.findByOrganiserOrderByStartsAtDesc(organiser)
        .stream()
        .map(PublicEventService::toSummary)
        .toList();
  }

  @Transactional
  public EventSummary createEvent(String email, EventRequest request) {
    var organiser = resolveOrganiser(email);
    var location = locationRepository.findByIdAndOrganiser(request.getLocationId(), organiser)
        .orElseThrow(() -> new NotFoundException("Location not found"));

    var event = EventEntity.builder()
        .organiser(organiser)
        .location(location)
        .title(request.getTitle())
        .description(request.getDescription())
        .eventUrl(request.getEventUrl())
        .startsAt(request.getStartsAt())
        .endsAt(request.getEndsAt())
        .free(Boolean.TRUE.equals(request.getFree()))
        .registrationRequired(Boolean.TRUE.equals(request.getRegistrationRequired()))
        .registrationUrl(request.getRegistrationUrl())
        .visibleFrom(request.getVisibleFrom())
        .build();

    if (request.getLinks() != null && !request.getLinks().isEmpty()) {
      var links = new ArrayList<EventLinkEntity>();
      for (var lr : request.getLinks()) {
        links.add(EventLinkEntity.builder()
            .event(event)
            .label(lr.getLabel())
            .url(lr.getUrl())
            .build());
      }
      event.setLinks(links);
    }

    return PublicEventService.toSummary(eventRepository.save(event));
  }

  @Transactional(readOnly = true)
  public EventSummary getMyEvent(String email, Long id) {
    var organiser = resolveOrganiser(email);
    var event = eventRepository.findByIdAndOrganiser(id, organiser)
        .orElseThrow(() -> new NotFoundException("Event not found"));
    return PublicEventService.toSummary(event);
  }

  @Transactional
  public EventSummary updateEvent(String email, Long id, EventUpdateRequest request) {
    var organiser = resolveOrganiser(email);
    var event = eventRepository.findByIdAndOrganiser(id, organiser)
        .orElseThrow(() -> new NotFoundException("Event not found"));

    if (!event.getStartsAt().isAfter(OffsetDateTime.now(ZoneOffset.UTC))) {
      throw new IllegalArgumentException("Cannot edit an event that has already started or passed");
    }

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
            .event(event)
            .label(lr.getLabel())
            .url(lr.getUrl())
            .build());
      }
    }

    return PublicEventService.toSummary(eventRepository.save(event));
  }

  @Transactional
  public EventSummary uploadImage(String email, Long eventId, MultipartFile file) {
    var organiser = resolveOrganiser(email);
    var event = eventRepository.findByIdAndOrganiser(eventId, organiser)
        .orElseThrow(() -> new NotFoundException("Event not found"));
    var url = imageStorageService.storeImage(file);
    event.setCoverImageUrl(url);
    return PublicEventService.toSummary(eventRepository.save(event));
  }

  @Transactional
  public void cancelEvent(String email, Long id) {
    var organiser = resolveOrganiser(email);
    var event = eventRepository.findByIdAndOrganiser(id, organiser)
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
  public EventSummary rescheduleEvent(String email, Long id, EventRescheduleRequest req) {
    var organiser = resolveOrganiser(email);
    var event = eventRepository.findByIdAndOrganiser(id, organiser)
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
  public EventSummary relocateEvent(String email, Long id, EventRelocateRequest req) {
    var organiser = resolveOrganiser(email);
    var event = eventRepository.findByIdAndOrganiser(id, organiser)
        .orElseThrow(() -> new NotFoundException("Event not found"));
    if ("CANCELLED".equals(event.getStatus())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot relocate a cancelled event");
    }
    var now = OffsetDateTime.now(ZoneOffset.UTC);
    if (!now.isBefore(event.getStartsAt())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot relocate a past or ongoing event");
    }
    var location = locationRepository.findByIdAndOrganiser(req.getLocationId(), organiser)
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

  private OrganiserEntity resolveOrganiser(String email) {
    return organiserRepository.findByUserEmail(email)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
  }
}
