package com.aestallon.dunadev.service;

import com.aestallon.dunadev.entity.LocationEntity;
import com.aestallon.dunadev.entity.OrganiserEntity;
import com.aestallon.dunadev.repository.EventRepository;
import com.aestallon.dunadev.repository.LocationRepository;
import com.aestallon.dunadev.repository.OrganiserRepository;
import com.aestallon.dunadev.rest.NotFoundException;
import com.aestallon.dunadev.rest.model.LocationRequest;
import com.aestallon.dunadev.rest.model.LocationSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {

  private final LocationRepository locationRepository;
  private final OrganiserRepository organiserRepository;
  private final EventRepository eventRepository;

  @Transactional(readOnly = true)
  public List<LocationSummary> getMyLocations(String email) {
    var organiser = resolveOrganiser(email);
    return locationRepository.findByOrganiserAndActiveTrue(organiser)
        .stream()
        .map(LocationService::toSummary)
        .toList();
  }

  @Transactional(readOnly = true)
  public LocationSummary getLocation(String email, Long id) {
    var organiser = resolveOrganiser(email);
    var location = locationRepository.findByIdAndOrganiser(id, organiser)
        .orElseThrow(() -> new NotFoundException("Location not found"));
    return toSummary(location);
  }

  @Transactional
  public LocationSummary createLocation(String email, LocationRequest request) {
    var organiser = resolveOrganiser(email);
    var location = LocationEntity.builder()
        .organiser(organiser)
        .name(request.getName())
        .address(request.getAddress())
        .city(request.getCity())
        .latitude(request.getLatitude())
        .longitude(request.getLongitude())
        .websiteUrl(request.getWebsiteUrl())
        .howToGetThere(request.getHowToGetThere())
        .build();
    return toSummary(locationRepository.save(location));
  }

  @Transactional
  public LocationSummary updateLocation(String email, Long id, LocationRequest request) {
    var organiser = resolveOrganiser(email);
    var location = locationRepository.findByIdAndOrganiser(id, organiser)
        .orElseThrow(() -> new NotFoundException("Location not found"));
    location.setName(request.getName());
    location.setAddress(request.getAddress());
    location.setCity(request.getCity());
    location.setLatitude(request.getLatitude());
    location.setLongitude(request.getLongitude());
    location.setWebsiteUrl(request.getWebsiteUrl());
    location.setHowToGetThere(request.getHowToGetThere());
    return toSummary(locationRepository.save(location));
  }

  @Transactional
  public void deleteLocation(String email, Long id) {
    var organiser = resolveOrganiser(email);
    var location = locationRepository.findByIdAndOrganiser(id, organiser)
        .orElseThrow(() -> new NotFoundException("Location not found"));
    if (eventRepository.existsByLocationId(id)) {
      location.setActive(false);
      locationRepository.save(location);
    } else {
      locationRepository.delete(location);
    }
  }

  private OrganiserEntity resolveOrganiser(String email) {
    return organiserRepository.findByUserEmail(email)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
  }

  static LocationSummary toSummary(LocationEntity l) {
    var s = new LocationSummary(l.getId(), l.getName());
    s.setAddress(l.getAddress());
    s.setCity(l.getCity());
    s.setLatitude(l.getLatitude());
    s.setLongitude(l.getLongitude());
    s.setWebsiteUrl(l.getWebsiteUrl());
    s.setHowToGetThere(l.getHowToGetThere());
    return s;
  }
}
