package com.aestallon.dunadev.rest;

import com.aestallon.dunadev.rest.api.PublicEventsApiDelegate;
import com.aestallon.dunadev.rest.model.EventSummary;
import com.aestallon.dunadev.service.PublicEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublicEventsApiDelegateImpl implements PublicEventsApiDelegate {

  private final PublicEventService publicEventService;

  @Override
  public ResponseEntity<List<EventSummary>> getUpcomingEvents(Integer limit) {
    return ResponseEntity.ok(publicEventService.getUpcomingEvents(limit));
  }

  @Override
  public ResponseEntity<List<EventSummary>> getEventsByMonth(Integer year, Integer month) {
    return ResponseEntity.ok(publicEventService.getEventsByMonth(year, month));
  }
}
