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
 * Minimal location info embedded in event responses.
 */

@Schema(name = "LocationSummary", description = "Minimal location info embedded in event responses.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public class LocationSummary {

  private Long id;

  private String name;

  private @Nullable String address = null;

  private @Nullable String city = null;

  private @Nullable Double latitude = null;

  private @Nullable Double longitude = null;

  private @Nullable String websiteUrl = null;

  private @Nullable String howToGetThere = null;

  public LocationSummary() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public LocationSummary(Long id, String name) {
    this.id = id;
    this.name = name;
  }

  public LocationSummary id(Long id) {
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

  public LocationSummary name(String name) {
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

  public LocationSummary address(@Nullable String address) {
    this.address = address;
    return this;
  }

  /**
   * Get address
   * @return address
   */
  
  @Schema(name = "address", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("address")
  public @Nullable String getAddress() {
    return address;
  }

  public void setAddress(@Nullable String address) {
    this.address = address;
  }

  public LocationSummary city(@Nullable String city) {
    this.city = city;
    return this;
  }

  /**
   * Get city
   * @return city
   */
  
  @Schema(name = "city", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("city")
  public @Nullable String getCity() {
    return city;
  }

  public void setCity(@Nullable String city) {
    this.city = city;
  }

  public LocationSummary latitude(@Nullable Double latitude) {
    this.latitude = latitude;
    return this;
  }

  /**
   * Get latitude
   * @return latitude
   */
  
  @Schema(name = "latitude", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("latitude")
  public @Nullable Double getLatitude() {
    return latitude;
  }

  public void setLatitude(@Nullable Double latitude) {
    this.latitude = latitude;
  }

  public LocationSummary longitude(@Nullable Double longitude) {
    this.longitude = longitude;
    return this;
  }

  /**
   * Get longitude
   * @return longitude
   */
  
  @Schema(name = "longitude", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("longitude")
  public @Nullable Double getLongitude() {
    return longitude;
  }

  public void setLongitude(@Nullable Double longitude) {
    this.longitude = longitude;
  }

  public LocationSummary websiteUrl(@Nullable String websiteUrl) {
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

  public LocationSummary howToGetThere(@Nullable String howToGetThere) {
    this.howToGetThere = howToGetThere;
    return this;
  }

  /**
   * Get howToGetThere
   * @return howToGetThere
   */
  
  @Schema(name = "howToGetThere", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("howToGetThere")
  public @Nullable String getHowToGetThere() {
    return howToGetThere;
  }

  public void setHowToGetThere(@Nullable String howToGetThere) {
    this.howToGetThere = howToGetThere;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    LocationSummary locationSummary = (LocationSummary) o;
    return Objects.equals(this.id, locationSummary.id) &&
        Objects.equals(this.name, locationSummary.name) &&
        Objects.equals(this.address, locationSummary.address) &&
        Objects.equals(this.city, locationSummary.city) &&
        Objects.equals(this.latitude, locationSummary.latitude) &&
        Objects.equals(this.longitude, locationSummary.longitude) &&
        Objects.equals(this.websiteUrl, locationSummary.websiteUrl) &&
        Objects.equals(this.howToGetThere, locationSummary.howToGetThere);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, address, city, latitude, longitude, websiteUrl, howToGetThere);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class LocationSummary {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
    sb.append("    city: ").append(toIndentedString(city)).append("\n");
    sb.append("    latitude: ").append(toIndentedString(latitude)).append("\n");
    sb.append("    longitude: ").append(toIndentedString(longitude)).append("\n");
    sb.append("    websiteUrl: ").append(toIndentedString(websiteUrl)).append("\n");
    sb.append("    howToGetThere: ").append(toIndentedString(howToGetThere)).append("\n");
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

