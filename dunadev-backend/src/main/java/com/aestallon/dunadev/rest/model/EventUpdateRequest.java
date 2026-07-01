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
 * Fields that may be edited on a future event. Date, time, and location are immutable.
 */

@Schema(name = "EventUpdateRequest", description = "Fields that may be edited on a future event. Date, time, and location are immutable.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public class EventUpdateRequest {

  private String title;

  private @Nullable String description = null;

  private @Nullable String eventUrl = null;

  private Boolean free;

  private Boolean registrationRequired;

  private @Nullable String registrationUrl = null;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private @Nullable OffsetDateTime visibleFrom = null;

  @Valid
  private List<@Valid EventLinkRequest> links = new ArrayList<>();

  public EventUpdateRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public EventUpdateRequest(String title, Boolean free, Boolean registrationRequired) {
    this.title = title;
    this.free = free;
    this.registrationRequired = registrationRequired;
  }

  public EventUpdateRequest title(String title) {
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

  public EventUpdateRequest description(@Nullable String description) {
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

  public EventUpdateRequest eventUrl(@Nullable String eventUrl) {
    this.eventUrl = eventUrl;
    return this;
  }

  /**
   * Get eventUrl
   * @return eventUrl
   */
  
  @Schema(name = "eventUrl", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("eventUrl")
  public @Nullable String getEventUrl() {
    return eventUrl;
  }

  public void setEventUrl(@Nullable String eventUrl) {
    this.eventUrl = eventUrl;
  }

  public EventUpdateRequest free(Boolean free) {
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

  public EventUpdateRequest registrationRequired(Boolean registrationRequired) {
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

  public EventUpdateRequest registrationUrl(@Nullable String registrationUrl) {
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

  public EventUpdateRequest visibleFrom(@Nullable OffsetDateTime visibleFrom) {
    this.visibleFrom = visibleFrom;
    return this;
  }

  /**
   * Get visibleFrom
   * @return visibleFrom
   */
  @Valid 
  @Schema(name = "visibleFrom", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("visibleFrom")
  public @Nullable OffsetDateTime getVisibleFrom() {
    return visibleFrom;
  }

  public void setVisibleFrom(@Nullable OffsetDateTime visibleFrom) {
    this.visibleFrom = visibleFrom;
  }

  public EventUpdateRequest links(List<@Valid EventLinkRequest> links) {
    this.links = links;
    return this;
  }

  public EventUpdateRequest addLinksItem(EventLinkRequest linksItem) {
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
    EventUpdateRequest eventUpdateRequest = (EventUpdateRequest) o;
    return Objects.equals(this.title, eventUpdateRequest.title) &&
        Objects.equals(this.description, eventUpdateRequest.description) &&
        Objects.equals(this.eventUrl, eventUpdateRequest.eventUrl) &&
        Objects.equals(this.free, eventUpdateRequest.free) &&
        Objects.equals(this.registrationRequired, eventUpdateRequest.registrationRequired) &&
        Objects.equals(this.registrationUrl, eventUpdateRequest.registrationUrl) &&
        Objects.equals(this.visibleFrom, eventUpdateRequest.visibleFrom) &&
        Objects.equals(this.links, eventUpdateRequest.links);
  }

  @Override
  public int hashCode() {
    return Objects.hash(title, description, eventUrl, free, registrationRequired, registrationUrl, visibleFrom, links);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EventUpdateRequest {\n");
    sb.append("    title: ").append(toIndentedString(title)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    eventUrl: ").append(toIndentedString(eventUrl)).append("\n");
    sb.append("    free: ").append(toIndentedString(free)).append("\n");
    sb.append("    registrationRequired: ").append(toIndentedString(registrationRequired)).append("\n");
    sb.append("    registrationUrl: ").append(toIndentedString(registrationUrl)).append("\n");
    sb.append("    visibleFrom: ").append(toIndentedString(visibleFrom)).append("\n");
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

