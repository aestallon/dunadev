package com.aestallon.dunadev.service;

import com.aestallon.dunadev.entity.EventEntity;
import com.aestallon.dunadev.entity.EventLinkEntity;
import com.aestallon.dunadev.entity.LocationEntity;
import com.aestallon.dunadev.entity.OrganiserEntity;
import com.aestallon.dunadev.repository.EventRepository;
import com.aestallon.dunadev.rest.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicEventService {

  private final EventRepository eventRepository;

  public List<EventSummary> getUpcomingEvents(int limit) {
    return eventRepository
        .findUpcoming(
            OffsetDateTime.now(ZoneOffset.UTC),
            PageRequest.of(0, limit))
        .stream()
        .map(PublicEventService::toSummary)
        .toList();
  }

  public List<EventSummary> getEventsByMonth(int year, int month) {
    var ym = YearMonth.of(year, month);
    var from = ym.atDay(1).atStartOfDay().atOffset(ZoneOffset.UTC);
    var to = ym.plusMonths(1).atDay(1).atStartOfDay().atOffset(ZoneOffset.UTC);
    return eventRepository.findByMonth(from, to, OffsetDateTime.now(ZoneOffset.UTC))
        .stream()
        .map(PublicEventService::toSummary)
        .toList();
  }

  static EventSummary toSummary(EventEntity e) {
    var summary = new EventSummary(
        e.getId(),
        e.getTitle(),
        e.getStartsAt(),
        e.isFree(),
        e.isRegistrationRequired(),
        EventStatus.fromValue(e.getStatus()),
        toOrganiserSummary(e.getOrganiser()));
    summary.setDescription(e.getDescription());
    summary.setEventUrl(e.getEventUrl());
    summary.setEndsAt(e.getEndsAt());
    summary.setRegistrationUrl(e.getRegistrationUrl());
    if (e.getLocation() != null) {
      summary.setLocation(toLocationSummary(e.getLocation()));
    }
    summary.setCoverImageUrl(e.getCoverImageUrl());
    summary.setOnNewLocation(e.isOnNewLocation());
    summary.setLinks(e.getLinks().stream().map(PublicEventService::toEventLink).toList());
    return summary;
  }

  private static OrganiserSummary toOrganiserSummary(OrganiserEntity o) {
    if (o == null) {
      return new OrganiserSummary(-1L, "[Deleted Organiser]");
    }
    var s = new OrganiserSummary(o.getId(), o.getName());
    s.setLogoUrl(o.getLogoUrl());
    s.setWebsiteUrl(o.getWebsiteUrl());
    return s;
  }

  private static LocationSummary toLocationSummary(LocationEntity l) {
    return LocationService.toSummary(l);
  }

  private static EventLink toEventLink(EventLinkEntity el) {
    return new EventLink(el.getLabel(), el.getUrl());
  }
}
