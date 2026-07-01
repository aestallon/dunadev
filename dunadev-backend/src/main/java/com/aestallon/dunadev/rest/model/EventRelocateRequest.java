package com.aestallon.dunadev.rest.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * EventRelocateRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public class EventRelocateRequest {

  private Long locationId;

  public EventRelocateRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public EventRelocateRequest(Long locationId) {
    this.locationId = locationId;
  }

  public EventRelocateRequest locationId(Long locationId) {
    this.locationId = locationId;
    return this;
  }

  /**
   * Get locationId
   * @return locationId
   */
  @NotNull 
  @Schema(name = "locationId", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("locationId")
  public Long getLocationId() {
    return locationId;
  }

  public void setLocationId(Long locationId) {
    this.locationId = locationId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EventRelocateRequest eventRelocateRequest = (EventRelocateRequest) o;
    return Objects.equals(this.locationId, eventRelocateRequest.locationId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(locationId);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EventRelocateRequest {\n");
    sb.append("    locationId: ").append(toIndentedString(locationId)).append("\n");
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

