package com.aestallon.dunadev.rest.api;

import com.aestallon.dunadev.rest.model.LocationRequest;
import com.aestallon.dunadev.rest.model.LocationSummary;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import jakarta.annotation.Generated;

/**
 * A delegate to be called by the {@link LocationsApiController}}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public interface LocationsApiDelegate {

    default Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    /**
     * POST /api/locations : Create a new location
     *
     * @param locationRequest  (required)
     * @return Location created successfully. (status code 200)
     *         or Not authenticated. (status code 401)
     * @see LocationsApi#createLocation
     */
    default ResponseEntity<LocationSummary> createLocation(LocationRequest locationRequest) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * DELETE /api/locations/{id} : Delete a location (soft-delete if used by events)
     *
     * @param id  (required)
     * @return Location deleted successfully. (status code 204)
     *         or Not authenticated. (status code 401)
     *         or Location not found or not owned by the authenticated user. (status code 404)
     * @see LocationsApi#deleteLocation
     */
    default ResponseEntity<Void> deleteLocation(Long id) {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * GET /api/locations/{id} : Get a single location by ID
     *
     * @param id  (required)
     * @return The requested location. (status code 200)
     *         or Not authenticated. (status code 401)
     *         or Location not found or not owned by the authenticated user. (status code 404)
     * @see LocationsApi#getLocation
     */
    default ResponseEntity<LocationSummary> getLocation(Long id) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * GET /api/locations : List the logged-in organiser&#39;s active locations
     *
     * @return A list of the organiser&#39;s active locations. (status code 200)
     *         or Not authenticated. (status code 401)
     * @see LocationsApi#getMyLocations
     */
    default ResponseEntity<List<LocationSummary>> getMyLocations() {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "[ { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 } ]";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * PUT /api/locations/{id} : Update an existing location
     *
     * @param id  (required)
     * @param locationRequest  (required)
     * @return Location updated successfully. (status code 200)
     *         or Not authenticated. (status code 401)
     *         or Location not found or not owned by the authenticated user. (status code 404)
     * @see LocationsApi#updateLocation
     */
    default ResponseEntity<LocationSummary> updateLocation(Long id,
        LocationRequest locationRequest) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

}
