package com.aestallon.dunadev.service;

import com.aestallon.dunadev.entity.EventEntity;
import com.aestallon.dunadev.entity.EventLinkEntity;
import com.aestallon.dunadev.entity.OrganiserEntity;
import com.aestallon.dunadev.repository.EventRepository;
import com.aestallon.dunadev.repository.LocationRepository;
import com.aestallon.dunadev.repository.OrganiserRepository;
import com.aestallon.dunadev.rest.NotFoundException;
import com.aestallon.dunadev.rest.model.EventRequest;
import com.aestallon.dunadev.rest.model.EventSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganiserEventService {

  private final EventRepository eventRepository;
  private final LocationRepository locationRepository;
  private final OrganiserRepository organiserRepository;

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

  private OrganiserEntity resolveOrganiser(String email) {
    return organiserRepository.findByUserEmail(email)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
  }
}
