package com.aestallon.dunadev.rest.api;

import com.aestallon.dunadev.rest.model.EventRelocateRequest;
import com.aestallon.dunadev.rest.model.EventRequest;
import com.aestallon.dunadev.rest.model.EventRescheduleRequest;
import com.aestallon.dunadev.rest.model.EventSummary;
import com.aestallon.dunadev.rest.model.EventUpdateRequest;
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
     * POST /api/events/{id}/cancel : Cancel an event
     *
     * @param id  (required)
     * @return Event cancelled or deleted. (status code 204)
     *         or Not authenticated. (status code 401)
     *         or Event not found or not owned by the authenticated organiser. (status code 404)
     *         or Event has already started or is in an unalterable state. (status code 409)
     * @see OrganiserEventsApi#cancelEvent
     */
    default ResponseEntity<Void> cancelEvent(Long id) {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

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
                    String exampleString = "{ \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"coverImageUrl\" : \"coverImageUrl\", \"description\" : \"description\", \"title\" : \"title\", \"onNewLocation\" : true, \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * GET /api/events/{id} : Get a single event owned by the authenticated organiser
     *
     * @param id  (required)
     * @return The requested event. (status code 200)
     *         or Not authenticated. (status code 401)
     *         or Event not found or not owned by the authenticated organiser. (status code 404)
     * @see OrganiserEventsApi#getEvent
     */
    default ResponseEntity<EventSummary> getEvent(Long id) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"coverImageUrl\" : \"coverImageUrl\", \"description\" : \"description\", \"title\" : \"title\", \"onNewLocation\" : true, \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" }";
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
                    String exampleString = "[ { \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"coverImageUrl\" : \"coverImageUrl\", \"description\" : \"description\", \"title\" : \"title\", \"onNewLocation\" : true, \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" }, { \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"coverImageUrl\" : \"coverImageUrl\", \"description\" : \"description\", \"title\" : \"title\", \"onNewLocation\" : true, \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" } ]";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * POST /api/events/{id}/relocate : Change the location of an event
     *
     * @param id  (required)
     * @param eventRelocateRequest  (required)
     * @return Updated event summary. (status code 200)
     *         or Not authenticated. (status code 401)
     *         or Event not found or not owned by the authenticated organiser. (status code 404)
     *         or Event has already started or is cancelled. (status code 409)
     * @see OrganiserEventsApi#relocateEvent
     */
    default ResponseEntity<EventSummary> relocateEvent(Long id,
        EventRelocateRequest eventRelocateRequest) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"coverImageUrl\" : \"coverImageUrl\", \"description\" : \"description\", \"title\" : \"title\", \"onNewLocation\" : true, \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * POST /api/events/{id}/reschedule : Reschedule an event
     *
     * @param id  (required)
     * @param eventRescheduleRequest  (required)
     * @return Updated event summary. (status code 200)
     *         or Not authenticated. (status code 401)
     *         or Event not found or not owned by the authenticated organiser. (status code 404)
     *         or Event has already started or is cancelled. (status code 409)
     * @see OrganiserEventsApi#rescheduleEvent
     */
    default ResponseEntity<EventSummary> rescheduleEvent(Long id,
        EventRescheduleRequest eventRescheduleRequest) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"coverImageUrl\" : \"coverImageUrl\", \"description\" : \"description\", \"title\" : \"title\", \"onNewLocation\" : true, \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * PUT /api/events/{id} : Update the editable fields of an upcoming event
     * Updates title, description, links, and other metadata of a future event. Date, time, and location cannot be changed through this endpoint. 
     *
     * @param id  (required)
     * @param eventUpdateRequest  (required)
     * @return Event updated successfully. (status code 200)
     *         or The event has already started or passed. (status code 400)
     *         or Not authenticated. (status code 401)
     *         or Event not found or not owned by the authenticated organiser. (status code 404)
     * @see OrganiserEventsApi#updateEvent
     */
    default ResponseEntity<EventSummary> updateEvent(Long id,
        EventUpdateRequest eventUpdateRequest) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"coverImageUrl\" : \"coverImageUrl\", \"description\" : \"description\", \"title\" : \"title\", \"onNewLocation\" : true, \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * POST /api/events/{id}/image : Upload or replace the cover image of an event
     *
     * @param id  (required)
     * @param file  (required)
     * @return Image stored successfully. Returns the updated event summary. (status code 200)
     *         or Not authenticated. (status code 401)
     *         or Event not found or not owned by the authenticated organiser. (status code 404)
     * @see OrganiserEventsApi#uploadEventImage
     */
    default ResponseEntity<EventSummary> uploadEventImage(Long id,
        MultipartFile file) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"registrationRequired\" : true, \"eventUrl\" : \"eventUrl\", \"coverImageUrl\" : \"coverImageUrl\", \"description\" : \"description\", \"title\" : \"title\", \"onNewLocation\" : true, \"organiser\" : { \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"id\" : 6, \"logoUrl\" : \"logoUrl\" }, \"startsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"location\" : { \"address\" : \"address\", \"city\" : \"city\", \"websiteUrl\" : \"websiteUrl\", \"latitude\" : 5.962133916683182, \"name\" : \"name\", \"howToGetThere\" : \"howToGetThere\", \"id\" : 1, \"longitude\" : 5.637376656633329 }, \"links\" : [ { \"label\" : \"label\", \"url\" : \"url\" }, { \"label\" : \"label\", \"url\" : \"url\" } ], \"id\" : 0, \"free\" : true, \"endsAt\" : \"2000-01-23T04:56:07.000+00:00\", \"registrationUrl\" : \"registrationUrl\", \"status\" : \"SCHEDULED\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

}
