package com.aestallon.dunadev.rest.api;

import com.aestallon.dunadev.rest.model.EventRequest;
import com.aestallon.dunadev.rest.model.EventSummary;
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
 * A delegate to be called by the {@link OrganiserEventsApiController}}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public interface OrganiserEventsApiDelegate {

    default Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    /**
     * POST /api/events : Create a new event
     *
     * @param eventRequest  (required)
     * @return Event created successfully. (status code 201)
     *         or Not authenticated. (status code 401)
     *         or Location not found or not owned by the authenticated organiser. (status code 404)
     * @see OrganiserEventsApi#createEvent
     */
    default ResponseEntity<EventSummary> createEvent(EventRequest eventRequest) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"description\" : \"description\", \"title\" : \"title\", \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * GET /api/events/my : List the authenticated organiser&#39;s events
     * Returns all events created by the authenticated organiser, ordered by start time descending (most recent first). 
     *
     * @return The organiser&#39;s events (past and upcoming). (status code 200)
     *         or Not authenticated. (status code 401)
     * @see OrganiserEventsApi#getMyEvents
     */
    default ResponseEntity<List<EventSummary>> getMyEvents() {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "[ { \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"description\" : \"description\", \"title\" : \"title\", \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" }, { \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"description\" : \"description\", \"title\" : \"title\", \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" } ]";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

}
