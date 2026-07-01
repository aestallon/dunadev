package com.aestallon.dunadev.rest;

import com.aestallon.dunadev.rest.api.LocationsApiDelegate;
import com.aestallon.dunadev.rest.model.LocationRequest;
import com.aestallon.dunadev.rest.model.LocationSummary;
import com.aestallon.dunadev.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationsApiDelegateImpl implements LocationsApiDelegate {

  private final LocationService locationService;

  @Override
  public ResponseEntity<List<LocationSummary>> getMyLocations() {
    return ResponseEntity.ok(locationService.getMyLocations(currentEmail()));
  }

  @Override
  public ResponseEntity<LocationSummary> getLocation(Long id) {
    return ResponseEntity.ok(locationService.getLocation(currentEmail(), id));
  }

  @Override
  public ResponseEntity<LocationSummary> createLocation(LocationRequest locationRequest) {
    return ResponseEntity.ok(locationService.createLocation(currentEmail(), locationRequest));
  }

  @Override
  public ResponseEntity<LocationSummary> updateLocation(Long id, LocationRequest locationRequest) {
    return ResponseEntity.ok(locationService.updateLocation(currentEmail(), id, locationRequest));
  }

  @Override
  public ResponseEntity<Void> deleteLocation(Long id) {
    locationService.deleteLocation(currentEmail(), id);
    return ResponseEntity.noContent().build();
  }

  private static String currentEmail() {
    return SecurityContextHolder.getContext().getAuthentication().getName();
  }
}
