package com.aestallon.dunadev.rest.model;

import java.net.URI;
import java.util.Objects;
import com.aestallon.dunadev.rest.model.EventLink;
import com.aestallon.dunadev.rest.model.EventStatus;
import com.aestallon.dunadev.rest.model.LocationSummary;
import com.aestallon.dunadev.rest.model.OrganiserSummary;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
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
 * Public-facing summary of an event, including organiser and location info.
 */

@Schema(name = "EventSummary", description = "Public-facing summary of an event, including organiser and location info.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public class EventSummary {

  private Long id;

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

  private EventStatus status;

  private OrganiserSummary organiser;

  private @Nullable LocationSummary location;

  @Valid
  private List<@Valid EventLink> links = new ArrayList<>();

  public EventSummary() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public EventSummary(Long id, String title, OffsetDateTime startsAt, Boolean free, Boolean registrationRequired, EventStatus status, OrganiserSummary organiser) {
    this.id = id;
    this.title = title;
    this.startsAt = startsAt;
    this.free = free;
    this.registrationRequired = registrationRequired;
    this.status = status;
    this.organiser = organiser;
  }

  public EventSummary id(Long id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
   */
  @NotNull 
  @Schema(name = "id", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("id")
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public EventSummary title(String title) {
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

  public EventSummary description(@Nullable String description) {
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

  public EventSummary eventUrl(@Nullable String eventUrl) {
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

  public EventSummary startsAt(OffsetDateTime startsAt) {
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

  public EventSummary endsAt(@Nullable OffsetDateTime endsAt) {
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

  public EventSummary free(Boolean free) {
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

  public EventSummary registrationRequired(Boolean registrationRequired) {
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

  public EventSummary registrationUrl(@Nullable String registrationUrl) {
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

  public EventSummary status(EventStatus status) {
    this.status = status;
    return this;
  }

  /**
   * Get status
   * @return status
   */
  @NotNull @Valid 
  @Schema(name = "status", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("status")
  public EventStatus getStatus() {
    return status;
  }

  public void setStatus(EventStatus status) {
    this.status = status;
  }

  public EventSummary organiser(OrganiserSummary organiser) {
    this.organiser = organiser;
    return this;
  }

  /**
   * Get organiser
   * @return organiser
   */
  @NotNull @Valid 
  @Schema(name = "organiser", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("organiser")
  public OrganiserSummary getOrganiser() {
    return organiser;
  }

  public void setOrganiser(OrganiserSummary organiser) {
    this.organiser = organiser;
  }

  public EventSummary location(@Nullable LocationSummary location) {
    this.location = location;
    return this;
  }

  /**
   * Get location
   * @return location
   */
  @Valid 
  @Schema(name = "location", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("location")
  public @Nullable LocationSummary getLocation() {
    return location;
  }

  public void setLocation(@Nullable LocationSummary location) {
    this.location = location;
  }

  public EventSummary links(List<@Valid EventLink> links) {
    this.links = links;
    return this;
  }

  public EventSummary addLinksItem(EventLink linksItem) {
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
  public List<@Valid EventLink> getLinks() {
    return links;
  }

  public void setLinks(List<@Valid EventLink> links) {
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
    EventSummary eventSummary = (EventSummary) o;
    return Objects.equals(this.id, eventSummary.id) &&
        Objects.equals(this.title, eventSummary.title) &&
        Objects.equals(this.description, eventSummary.description) &&
        Objects.equals(this.eventUrl, eventSummary.eventUrl) &&
        Objects.equals(this.startsAt, eventSummary.startsAt) &&
        Objects.equals(this.endsAt, eventSummary.endsAt) &&
        Objects.equals(this.free, eventSummary.free) &&
        Objects.equals(this.registrationRequired, eventSummary.registrationRequired) &&
        Objects.equals(this.registrationUrl, eventSummary.registrationUrl) &&
        Objects.equals(this.status, eventSummary.status) &&
        Objects.equals(this.organiser, eventSummary.organiser) &&
        Objects.equals(this.location, eventSummary.location) &&
        Objects.equals(this.links, eventSummary.links);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, title, description, eventUrl, startsAt, endsAt, free, registrationRequired, registrationUrl, status, organiser, location, links);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EventSummary {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    title: ").append(toIndentedString(title)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    eventUrl: ").append(toIndentedString(eventUrl)).append("\n");
    sb.append("    startsAt: ").append(toIndentedString(startsAt)).append("\n");
    sb.append("    endsAt: ").append(toIndentedString(endsAt)).append("\n");
    sb.append("    free: ").append(toIndentedString(free)).append("\n");
    sb.append("    registrationRequired: ").append(toIndentedString(registrationRequired)).append("\n");
    sb.append("    registrationUrl: ").append(toIndentedString(registrationUrl)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    organiser: ").append(toIndentedString(organiser)).append("\n");
    sb.append("    location: ").append(toIndentedString(location)).append("\n");
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

