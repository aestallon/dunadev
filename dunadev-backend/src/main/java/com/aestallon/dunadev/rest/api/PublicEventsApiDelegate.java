package com.aestallon.dunadev.rest.api;

import com.aestallon.dunadev.rest.model.EventSummary;
import org.springframework.lang.Nullable;
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
 * A delegate to be called by the {@link PublicEventsApiController}}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public interface PublicEventsApiDelegate {

    default Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    /**
     * GET /api/events : List events for a given month
     * Returns all publicly visible, non-cancelled events whose start time falls within the specified year and month. Intended for the monthly event list and calendar view on the landing page. 
     *
     * @param year Four-digit year. (required)
     * @param month Month number (1–12). (required)
     * @return A list of events for the requested month ordered by start time ascending. (status code 200)
     *         or Invalid year or month parameter. (status code 400)
     * @see PublicEventsApi#getEventsByMonth
     */
    default ResponseEntity<List<EventSummary>> getEventsByMonth(Integer year,
        Integer month) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "[ { \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"description\" : \"description\", \"title\" : \"title\", \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" }, { \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"description\" : \"description\", \"title\" : \"title\", \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" } ]";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * GET /api/events/upcoming : List the next upcoming events
     * Returns the closest upcoming events that are publicly visible and not cancelled. Intended for the landing-page hero cards. 
     *
     * @param limit Maximum number of events to return (1–20). (optional, default to 5)
     * @return A list of upcoming events ordered by start time ascending. (status code 200)
     * @see PublicEventsApi#getUpcomingEvents
     */
    default ResponseEntity<List<EventSummary>> getUpcomingEvents(Integer limit) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "[ { \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"description\" : \"description\", \"title\" : \"title\", \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" }, { \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"description\" : \"description\", \"title\" : \"title\", \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" } ]";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

}
