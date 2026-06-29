package com.aestallon.dunadev.service;

import com.aestallon.dunadev.entity.EventLinkEntity;
import com.aestallon.dunadev.repository.EventRepository;
import com.aestallon.dunadev.repository.LocationRepository;
import com.aestallon.dunadev.repository.OrganiserRepository;
import com.aestallon.dunadev.rest.NotFoundException;
import com.aestallon.dunadev.rest.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

  private final OrganiserRepository organiserRepository;
  private final EventRepository eventRepository;
  private final LocationRepository locationRepository;

  @Transactional(readOnly = true)
  public List<AdminOrganiserSummary> listOrganisers() {
    return organiserRepository.findAll().stream()
        .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
        .map(o -> {
          long eventCount = eventRepository.countByOrganiser(o);
          long locationCount = locationRepository.countByOrganiserAndActiveTrue(o);
          var s = new AdminOrganiserSummary(
              o.getId(), o.getName(), (int) eventCount, (int) locationCount,
              o.getUser().getEmail());
          s.setDescription(o.getDescription());
          s.setLogoUrl(o.getLogoUrl());
          s.setWebsiteUrl(o.getWebsiteUrl());
          return s;
        })
        .toList();
  }

  @Transactional(readOnly = true)
  public OrganiserProfile getOrganiser(Long id) {
    var o = organiserRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    var p = new OrganiserProfile(o.getId(), o.getName());
    p.setDescription(o.getDescription());
    p.setWebsiteUrl(o.getWebsiteUrl());
    p.setLogoUrl(o.getLogoUrl());
    return p;
  }

  @Transactional
  public OrganiserProfile updateOrganiser(Long id, OrganiserUpdateRequest request) {
    var o = organiserRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    o.setName(request.getName());
    o.setDescription(request.getDescription());
    o.setWebsiteUrl(request.getWebsiteUrl());
    o = organiserRepository.save(o);
    var p = new OrganiserProfile(o.getId(), o.getName());
    p.setDescription(o.getDescription());
    p.setWebsiteUrl(o.getWebsiteUrl());
    p.setLogoUrl(o.getLogoUrl());
    return p;
  }

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
  public List<LocationSummary> getOrganiserLocations(Long organiserId) {
    organiserRepository.findById(organiserId)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    return locationRepository.findByOrganiserIdAndActiveTrue(organiserId)
        .stream()
        .map(LocationService::toSummary)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<EventSummary> getUpcomingEvents(int days) {
    var now = OffsetDateTime.now(ZoneOffset.UTC);
    var until = now.plusDays(days);
    return eventRepository.findAdminUpcoming(now, until)
        .stream()
        .map(PublicEventService::toSummary)
        .toList();
  }

  @Transactional(readOnly = true)
  public EventSummary getEvent(Long id) {
    var event = eventRepository.findByIdAdmin(id)
        .orElseThrow(() -> new NotFoundException("Event not found"));
    return PublicEventService.toSummary(event);
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
            .event(event)
            .label(lr.getLabel())
            .url(lr.getUrl())
            .build());
      }
    }
    return PublicEventService.toSummary(eventRepository.save(event));
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
}
