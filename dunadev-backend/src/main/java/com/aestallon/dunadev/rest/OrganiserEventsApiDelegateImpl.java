package com.aestallon.dunadev.rest;

import com.aestallon.dunadev.rest.api.OrganiserEventsApiDelegate;
import com.aestallon.dunadev.rest.model.EventRescheduleRequest;
import com.aestallon.dunadev.rest.model.EventRelocateRequest;
import com.aestallon.dunadev.rest.model.EventRequest;
import com.aestallon.dunadev.rest.model.EventSummary;
import com.aestallon.dunadev.rest.model.EventUpdateRequest;
import com.aestallon.dunadev.service.OrganiserEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganiserEventsApiDelegateImpl implements OrganiserEventsApiDelegate {

  private final OrganiserEventService organiserEventService;

  @Override
  public ResponseEntity<EventSummary> createEvent(EventRequest eventRequest) {
    var summary = organiserEventService.createEvent(currentEmail(), eventRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(summary);
  }

  @Override
  public ResponseEntity<EventSummary> getEvent(Long id) {
    return ResponseEntity.ok(organiserEventService.getMyEvent(currentEmail(), id));
  }

  @Override
  public ResponseEntity<EventSummary> updateEvent(Long id, EventUpdateRequest eventUpdateRequest) {
    return ResponseEntity.ok(organiserEventService.updateEvent(currentEmail(), id, eventUpdateRequest));
  }

  @Override
  public ResponseEntity<List<EventSummary>> getMyEvents() {
    return ResponseEntity.ok(organiserEventService.getMyEvents(currentEmail()));
  }

  @Override
  public ResponseEntity<EventSummary> uploadEventImage(Long id, MultipartFile file) {
    return ResponseEntity.ok(organiserEventService.uploadImage(currentEmail(), id, file));
  }

  @Override
  public ResponseEntity<Void> cancelEvent(Long id) {
    organiserEventService.cancelEvent(currentEmail(), id);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<EventSummary> rescheduleEvent(Long id, EventRescheduleRequest req) {
    return ResponseEntity.ok(organiserEventService.rescheduleEvent(currentEmail(), id, req));
  }

  @Override
  public ResponseEntity<EventSummary> relocateEvent(Long id, EventRelocateRequest req) {
    return ResponseEntity.ok(organiserEventService.relocateEvent(currentEmail(), id, req));
  }

  private static String currentEmail() {
    return SecurityContextHolder.getContext().getAuthentication().getName();
  }
}
