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
 * EventLinkRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public class EventLinkRequest {

  private String label;

  private String url;

  public EventLinkRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public EventLinkRequest(String label, String url) {
    this.label = label;
    this.url = url;
  }

  public EventLinkRequest label(String label) {
    this.label = label;
    return this;
  }

  /**
   * Get label
   * @return label
   */
  @NotNull 
  @Schema(name = "label", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("label")
  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public EventLinkRequest url(String url) {
    this.url = url;
    return this;
  }

  /**
   * Get url
   * @return url
   */
  @NotNull 
  @Schema(name = "url", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("url")
  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EventLinkRequest eventLinkRequest = (EventLinkRequest) o;
    return Objects.equals(this.label, eventLinkRequest.label) &&
        Objects.equals(this.url, eventLinkRequest.url);
  }

  @Override
  public int hashCode() {
    return Objects.hash(label, url);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EventLinkRequest {\n");
    sb.append("    label: ").append(toIndentedString(label)).append("\n");
    sb.append("    url: ").append(toIndentedString(url)).append("\n");
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

