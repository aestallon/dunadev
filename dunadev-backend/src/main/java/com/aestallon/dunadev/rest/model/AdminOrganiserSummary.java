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
 * Organiser summary for admin views, includes counts and user email.
 */

@Schema(name = "AdminOrganiserSummary", description = "Organiser summary for admin views, includes counts and user email.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public class AdminOrganiserSummary {

  private Long id;

  private String name;

  private @Nullable String description = null;

  private @Nullable String logoUrl = null;

  private @Nullable String websiteUrl = null;

  private Integer eventCount;

  private Integer locationCount;

  private String userEmail;

  public AdminOrganiserSummary() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public AdminOrganiserSummary(Long id, String name, Integer eventCount, Integer locationCount, String userEmail) {
    this.id = id;
    this.name = name;
    this.eventCount = eventCount;
    this.locationCount = locationCount;
    this.userEmail = userEmail;
  }

  public AdminOrganiserSummary id(Long id) {
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

  public AdminOrganiserSummary name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
   */
  @NotNull 
  @Schema(name = "name", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("name")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public AdminOrganiserSummary description(@Nullable String description) {
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

  public AdminOrganiserSummary logoUrl(@Nullable String logoUrl) {
    this.logoUrl = logoUrl;
    return this;
  }

  /**
   * Get logoUrl
   * @return logoUrl
   */
  
  @Schema(name = "logoUrl", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("logoUrl")
  public @Nullable String getLogoUrl() {
    return logoUrl;
  }

  public void setLogoUrl(@Nullable String logoUrl) {
    this.logoUrl = logoUrl;
  }

  public AdminOrganiserSummary websiteUrl(@Nullable String websiteUrl) {
    this.websiteUrl = websiteUrl;
    return this;
  }

  /**
   * Get websiteUrl
   * @return websiteUrl
   */
  
  @Schema(name = "websiteUrl", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("websiteUrl")
  public @Nullable String getWebsiteUrl() {
    return websiteUrl;
  }

  public void setWebsiteUrl(@Nullable String websiteUrl) {
    this.websiteUrl = websiteUrl;
  }

  public AdminOrganiserSummary eventCount(Integer eventCount) {
    this.eventCount = eventCount;
    return this;
  }

  /**
   * Get eventCount
   * @return eventCount
   */
  @NotNull 
  @Schema(name = "eventCount", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("eventCount")
  public Integer getEventCount() {
    return eventCount;
  }

  public void setEventCount(Integer eventCount) {
    this.eventCount = eventCount;
  }

  public AdminOrganiserSummary locationCount(Integer locationCount) {
    this.locationCount = locationCount;
    return this;
  }

  /**
   * Get locationCount
   * @return locationCount
   */
  @NotNull 
  @Schema(name = "locationCount", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("locationCount")
  public Integer getLocationCount() {
    return locationCount;
  }

  public void setLocationCount(Integer locationCount) {
    this.locationCount = locationCount;
  }

  public AdminOrganiserSummary userEmail(String userEmail) {
    this.userEmail = userEmail;
    return this;
  }

  /**
   * Get userEmail
   * @return userEmail
   */
  @NotNull 
  @Schema(name = "userEmail", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("userEmail")
  public String getUserEmail() {
    return userEmail;
  }

  public void setUserEmail(String userEmail) {
    this.userEmail = userEmail;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AdminOrganiserSummary adminOrganiserSummary = (AdminOrganiserSummary) o;
    return Objects.equals(this.id, adminOrganiserSummary.id) &&
        Objects.equals(this.name, adminOrganiserSummary.name) &&
        Objects.equals(this.description, adminOrganiserSummary.description) &&
        Objects.equals(this.logoUrl, adminOrganiserSummary.logoUrl) &&
        Objects.equals(this.websiteUrl, adminOrganiserSummary.websiteUrl) &&
        Objects.equals(this.eventCount, adminOrganiserSummary.eventCount) &&
        Objects.equals(this.locationCount, adminOrganiserSummary.locationCount) &&
        Objects.equals(this.userEmail, adminOrganiserSummary.userEmail);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, description, logoUrl, websiteUrl, eventCount, locationCount, userEmail);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class AdminOrganiserSummary {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    logoUrl: ").append(toIndentedString(logoUrl)).append("\n");
    sb.append("    websiteUrl: ").append(toIndentedString(websiteUrl)).append("\n");
    sb.append("    eventCount: ").append(toIndentedString(eventCount)).append("\n");
    sb.append("    locationCount: ").append(toIndentedString(locationCount)).append("\n");
    sb.append("    userEmail: ").append(toIndentedString(userEmail)).append("\n");
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

