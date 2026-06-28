package com.aestallon.dunadev.rest.model;

import java.net.URI;
import java.util.Objects;
import com.aestallon.dunadev.rest.model.EventLinkRequest;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * EventRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public class EventRequest {

  private String title;

  private @Nullable String description = null;

  private @Nullable String eventUrl = null;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime startsAt;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private @Nullable OffsetDateTime endsAt = null;

  private Boolean free;

  private Boolean registrationRequired;

  private @Nullable String registrationUrl = null;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private @Nullable OffsetDateTime visibleFrom = null;

  private Long locationId;

  @Valid
  private List<@Valid EventLinkRequest> links = new ArrayList<>();

  public EventRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public EventRequest(String title, OffsetDateTime startsAt, Boolean free, Boolean registrationRequired, Long locationId) {
    this.title = title;
    this.startsAt = startsAt;
    this.free = free;
    this.registrationRequired = registrationRequired;
    this.locationId = locationId;
  }

  public EventRequest title(String title) {
    this.title = title;
    return this;
  }

  /**
   * Get title
   * @return title
   */
  @NotNull 
  @Schema(name = "title", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("title")
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public EventRequest description(@Nullable String description) {
    this.description = description;
    return this;
  }

  /**
   * Get description
   * @return description
   */
  
  @Schema(name = "description", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("description")
  public @Nullable String getDescription() {
    return description;
  }

  public void setDescription(@Nullable String description) {
    this.description = description;
  }

  public EventRequest eventUrl(@Nullable String eventUrl) {
    this.eventUrl = eventUrl;
    return this;
  }

  /**
   * Link to the external event page.
   * @return eventUrl
   */
  
  @Schema(name = "eventUrl", description = "Link to the external event page.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("eventUrl")
  public @Nullable String getEventUrl() {
    return eventUrl;
  }

  public void setEventUrl(@Nullable String eventUrl) {
    this.eventUrl = eventUrl;
  }

  public EventRequest startsAt(OffsetDateTime startsAt) {
    this.startsAt = startsAt;
    return this;
  }

  /**
   * Get startsAt
   * @return startsAt
   */
  @NotNull @Valid 
  @Schema(name = "startsAt", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("startsAt")
  public OffsetDateTime getStartsAt() {
    return startsAt;
  }

  public void setStartsAt(OffsetDateTime startsAt) {
    this.startsAt = startsAt;
  }

  public EventRequest endsAt(@Nullable OffsetDateTime endsAt) {
    this.endsAt = endsAt;
    return this;
  }

  /**
   * Get endsAt
   * @return endsAt
   */
  @Valid 
  @Schema(name = "endsAt", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("endsAt")
  public @Nullable OffsetDateTime getEndsAt() {
    return endsAt;
  }

  public void setEndsAt(@Nullable OffsetDateTime endsAt) {
    this.endsAt = endsAt;
  }

  public EventRequest free(Boolean free) {
    this.free = free;
    return this;
  }

  /**
   * Get free
   * @return free
   */
  @NotNull 
  @Schema(name = "free", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("free")
  public Boolean getFree() {
    return free;
  }

  public void setFree(Boolean free) {
    this.free = free;
  }

  public EventRequest registrationRequired(Boolean registrationRequired) {
    this.registrationRequired = registrationRequired;
    return this;
  }

  /**
   * Get registrationRequired
   * @return registrationRequired
   */
  @NotNull 
  @Schema(name = "registrationRequired", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("registrationRequired")
  public Boolean getRegistrationRequired() {
    return registrationRequired;
  }

  public void setRegistrationRequired(Boolean registrationRequired) {
    this.registrationRequired = registrationRequired;
  }

  public EventRequest registrationUrl(@Nullable String registrationUrl) {
    this.registrationUrl = registrationUrl;
    return this;
  }

  /**
   * Get registrationUrl
   * @return registrationUrl
   */
  
  @Schema(name = "registrationUrl", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("registrationUrl")
  public @Nullable String getRegistrationUrl() {
    return registrationUrl;
  }

  public void setRegistrationUrl(@Nullable String registrationUrl) {
    this.registrationUrl = registrationUrl;
  }

  public EventRequest visibleFrom(@Nullable OffsetDateTime visibleFrom) {
    this.visibleFrom = visibleFrom;
    return this;
  }

  /**
   * The date-time from which the event becomes publicly visible. Omit or set to null to publish immediately. 
   * @return visibleFrom
   */
  @Valid 
  @Schema(name = "visibleFrom", description = "The date-time from which the event becomes publicly visible. Omit or set to null to publish immediately. ", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("visibleFrom")
  public @Nullable OffsetDateTime getVisibleFrom() {
    return visibleFrom;
  }

  public void setVisibleFrom(@Nullable OffsetDateTime visibleFrom) {
    this.visibleFrom = visibleFrom;
  }

  public EventRequest locationId(Long locationId) {
    this.locationId = locationId;
    return this;
  }

  /**
   * ID of the organiser's location where the event takes place.
   * @return locationId
   */
  @NotNull 
  @Schema(name = "locationId", description = "ID of the organiser's location where the event takes place.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("locationId")
  public Long getLocationId() {
    return locationId;
  }

  public void setLocationId(Long locationId) {
    this.locationId = locationId;
  }

  public EventRequest links(List<@Valid EventLinkRequest> links) {
    this.links = links;
    return this;
  }

  public EventRequest addLinksItem(EventLinkRequest linksItem) {
    if (this.links == null) {
      this.links = new ArrayList<>();
    }
    this.links.add(linksItem);
    return this;
  }

  /**
   * Get links
   * @return links
   */
  @Valid 
  @Schema(name = "links", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("links")
  public List<@Valid EventLinkRequest> getLinks() {
    return links;
  }

  public void setLinks(List<@Valid EventLinkRequest> links) {
    this.links = links;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EventRequest eventRequest = (EventRequest) o;
    return Objects.equals(this.title, eventRequest.title) &&
        Objects.equals(this.description, eventRequest.description) &&
        Objects.equals(this.eventUrl, eventRequest.eventUrl) &&
        Objects.equals(this.startsAt, eventRequest.startsAt) &&
        Objects.equals(this.endsAt, eventRequest.endsAt) &&
        Objects.equals(this.free, eventRequest.free) &&
        Objects.equals(this.registrationRequired, eventRequest.registrationRequired) &&
        Objects.equals(this.registrationUrl, eventRequest.registrationUrl) &&
        Objects.equals(this.visibleFrom, eventRequest.visibleFrom) &&
        Objects.equals(this.locationId, eventRequest.locationId) &&
        Objects.equals(this.links, eventRequest.links);
  }

  @Override
  public int hashCode() {
    return Objects.hash(title, description, eventUrl, startsAt, endsAt, free, registrationRequired, registrationUrl, visibleFrom, locationId, links);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EventRequest {\n");
    sb.append("    title: ").append(toIndentedString(title)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    eventUrl: ").append(toIndentedString(eventUrl)).append("\n");
    sb.append("    startsAt: ").append(toIndentedString(startsAt)).append("\n");
    sb.append("    endsAt: ").append(toIndentedString(endsAt)).append("\n");
    sb.append("    free: ").append(toIndentedString(free)).append("\n");
    sb.append("    registrationRequired: ").append(toIndentedString(registrationRequired)).append("\n");
    sb.append("    registrationUrl: ").append(toIndentedString(registrationUrl)).append("\n");
    sb.append("    visibleFrom: ").append(toIndentedString(visibleFrom)).append("\n");
    sb.append("    locationId: ").append(toIndentedString(locationId)).append("\n");
    sb.append("    links: ").append(toIndentedString(links)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

