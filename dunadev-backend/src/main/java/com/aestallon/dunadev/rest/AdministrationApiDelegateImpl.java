package com.aestallon.dunadev.rest;

import com.aestallon.dunadev.rest.api.AdministrationApiDelegate;
import com.aestallon.dunadev.rest.model.*;
import com.aestallon.dunadev.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdministrationApiDelegateImpl implements AdministrationApiDelegate {

  private final AdminService adminService;

  @Override
  public ResponseEntity<List<AdminOrganiserSummary>> listAdminOrganisers() {
    return ResponseEntity.ok(adminService.listOrganisers());
  }

  @Override
  public ResponseEntity<AdminOrganiserSummary> createAdminOrganiser(
      AdminOrganiserCreateRequest request) {
    return ResponseEntity.status(201).body(adminService.createOrganiser(request));
  }

  @Override
  public ResponseEntity<OrganiserProfile> getAdminOrganiser(Long id) {
    return ResponseEntity.ok(adminService.getOrganiser(id));
  }

  @Override
  public ResponseEntity<OrganiserProfile> updateAdminOrganiser(Long id,
                                                               OrganiserUpdateRequest organiserUpdateRequest) {
    return ResponseEntity.ok(adminService.updateOrganiser(id, organiserUpdateRequest));
  }

  @Override
  public ResponseEntity<List<EventSummary>> getAdminOrganiserEvents(Long id) {
    return ResponseEntity.ok(adminService.getOrganiserEvents(id));
  }

  @Override
  public ResponseEntity<List<LocationSummary>> getAdminOrganiserLocations(Long id) {
    return ResponseEntity.ok(adminService.getOrganiserLocations(id));
  }

  @Override
  public ResponseEntity<List<EventSummary>> getAdminUpcomingEvents(Integer days) {
    int d = (days != null) ? days : 14;
    return ResponseEntity.ok(adminService.getUpcomingEvents(d));
  }

  @Override
  public ResponseEntity<EventSummary> getAdminEvent(Long id) {
    return ResponseEntity.ok(adminService.getEvent(id));
  }

  @Override
  public ResponseEntity<EventSummary> updateAdminEvent(Long id,
                                                       EventUpdateRequest eventUpdateRequest) {
    return ResponseEntity.ok(adminService.updateEvent(id, eventUpdateRequest));
  }

  @Override
  public ResponseEntity<LocationSummary> updateAdminLocation(Long id,
                                                             LocationRequest locationRequest) {
    return ResponseEntity.ok(adminService.updateLocationById(id, locationRequest));
  }
}
