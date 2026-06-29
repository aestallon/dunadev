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
 * AdminOrganiserCreateRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public class AdminOrganiserCreateRequest {

  private String name;

  private String email;

  public AdminOrganiserCreateRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public AdminOrganiserCreateRequest(String name, String email) {
    this.name = name;
    this.email = email;
  }

  public AdminOrganiserCreateRequest name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Name of the organisation.
   * @return name
   */
  @NotNull 
  @Schema(name = "name", description = "Name of the organisation.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("name")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public AdminOrganiserCreateRequest email(String email) {
    this.email = email;
    return this;
  }

  /**
   * Email address for the primary user of the organisation.
   * @return email
   */
  @NotNull 
  @Schema(name = "email", description = "Email address for the primary user of the organisation.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("email")
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AdminOrganiserCreateRequest adminOrganiserCreateRequest = (AdminOrganiserCreateRequest) o;
    return Objects.equals(this.name, adminOrganiserCreateRequest.name) &&
        Objects.equals(this.email, adminOrganiserCreateRequest.email);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, email);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class AdminOrganiserCreateRequest {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
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

