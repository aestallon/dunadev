package com.aestallon.dunadev.rest.api;

import com.aestallon.dunadev.rest.model.AdminOrganiserCreateRequest;
import com.aestallon.dunadev.rest.model.AdminOrganiserSummary;
import com.aestallon.dunadev.rest.model.ApiError;
import com.aestallon.dunadev.rest.model.EventRelocateRequest;
import com.aestallon.dunadev.rest.model.EventRescheduleRequest;
import com.aestallon.dunadev.rest.model.EventSummary;
import com.aestallon.dunadev.rest.model.EventUpdateRequest;
import com.aestallon.dunadev.rest.model.LocationRequest;
import com.aestallon.dunadev.rest.model.LocationSummary;
import org.springframework.lang.Nullable;
import com.aestallon.dunadev.rest.model.OrganiserProfile;
import com.aestallon.dunadev.rest.model.OrganiserUpdateRequest;
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
 * A delegate to be called by the {@link AdministrationApiController}}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public interface AdministrationApiDelegate {

    default Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    /**
     * POST /api/admin/events/{id}/cancel : Cancel any event
     *
     * @param id  (required)
     * @return Event cancelled or deleted. (status code 204)
     *         or Not an administrator. (status code 403)
     *         or Event not found. (status code 404)
     *         or Event has already started or is in an unalterable state. (status code 409)
     * @see AdministrationApi#cancelAdminEvent
     */
    default ResponseEntity<Void> cancelAdminEvent(Long id) {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * POST /api/admin/organisers : Invite a new organiser
     * Creates a new organisation and its primary user account. A randomly generated password is emailed to the provided address. The organiser&#39;s status is set to INVITED until their first login, after which it becomes ACTIVE. 
     *
     * @param adminOrganiserCreateRequest  (required)
     * @return Organiser created and invitation email sent. (status code 201)
     *         or Email address is already registered. (status code 409)
     *         or Not an administrator. (status code 403)
     * @see AdministrationApi#createAdminOrganiser
     */
    default ResponseEntity<AdminOrganiserSummary> createAdminOrganiser(AdminOrganiserCreateRequest adminOrganiserCreateRequest) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"websiteUrl\" : \"websiteUrl\", \"locationCount\" : 1, \"name\" : \"name\", \"description\" : \"description\", \"eventCount\" : 6, \"userEmail\" : \"userEmail\", \"id\" : 0, \"logoUrl\" : \"logoUrl\", \"status\" : \"INVITED\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"description\" : \"description\", \"message\" : \"message\", \"status\" : 0, \"timestamp\" : \"2000-01-23T04:56:07.000+00:00\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * GET /api/admin/events/{id} : Get any event by ID
     *
     * @param id  (required)
     * @return The event. (status code 200)
     *         or Not an administrator. (status code 403)
     *         or Event not found. (status code 404)
     * @see AdministrationApi#getAdminEvent
     */
    default ResponseEntity<EventSummary> getAdminEvent(Long id) {
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
     * GET /api/admin/organisers/{id} : Get a single organiser&#39;s profile
     *
     * @param id  (required)
     * @return The organiser&#39;s profile. (status code 200)
     *         or Not an administrator. (status code 403)
     *         or Organiser not found. (status code 404)
     * @see AdministrationApi#getAdminOrganiser
     */
    default ResponseEntity<OrganiserProfile> getAdminOrganiser(Long id) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"description\" : \"description\", \"id\" : 0, \"logoUrl\" : \"logoUrl\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * GET /api/admin/organisers/{id}/events : Get all events for a specific organiser
     *
     * @param id  (required)
     * @return The organiser&#39;s events, ordered by start time descending. (status code 200)
     *         or Not an administrator. (status code 403)
     *         or Organiser not found. (status code 404)
     * @see AdministrationApi#getAdminOrganiserEvents
     */
    default ResponseEntity<List<EventSummary>> getAdminOrganiserEvents(Long id) {
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
     * GET /api/admin/organisers/{id}/locations : Get all active locations for a specific organiser
     *
     * @param id  (required)
     * @return The organiser&#39;s active locations. (status code 200)
     *         or Not an administrator. (status code 403)
     *         or Organiser not found. (status code 404)
     * @see AdministrationApi#getAdminOrganiserLocations
     */
    default ResponseEntity<List<LocationSummary>> getAdminOrganiserLocations(Long id) {
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
     * GET /api/admin/events/upcoming : List upcoming events across all organisers
     *
     * @param days  (optional, default to 14)
     * @return Upcoming events within the specified number of days, ordered by start time ascending. (status code 200)
     *         or Not an administrator. (status code 403)
     * @see AdministrationApi#getAdminUpcomingEvents
     */
    default ResponseEntity<List<EventSummary>> getAdminUpcomingEvents(Integer days) {
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
     * GET /api/admin/organisers : List all organisers
     *
     * @return All organisers with event and location counts. (status code 200)
     *         or Not an administrator. (status code 403)
     * @see AdministrationApi#listAdminOrganisers
     */
    default ResponseEntity<List<AdminOrganiserSummary>> listAdminOrganisers() {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "[ { \"websiteUrl\" : \"websiteUrl\", \"locationCount\" : 1, \"name\" : \"name\", \"description\" : \"description\", \"eventCount\" : 6, \"userEmail\" : \"userEmail\", \"id\" : 0, \"logoUrl\" : \"logoUrl\", \"status\" : \"INVITED\" }, { \"websiteUrl\" : \"websiteUrl\", \"locationCount\" : 1, \"name\" : \"name\", \"description\" : \"description\", \"eventCount\" : 6, \"userEmail\" : \"userEmail\", \"id\" : 0, \"logoUrl\" : \"logoUrl\", \"status\" : \"INVITED\" } ]";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * POST /api/admin/events/{id}/relocate : Change the location of any event
     *
     * @param id  (required)
     * @param eventRelocateRequest  (required)
     * @return Updated event summary. (status code 200)
     *         or Not an administrator. (status code 403)
     *         or Event not found. (status code 404)
     *         or Event has already started or is cancelled. (status code 409)
     * @see AdministrationApi#relocateAdminEvent
     */
    default ResponseEntity<EventSummary> relocateAdminEvent(Long id,
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
     * POST /api/admin/events/{id}/reschedule : Reschedule any event
     *
     * @param id  (required)
     * @param eventRescheduleRequest  (required)
     * @return Updated event summary. (status code 200)
     *         or Not an administrator. (status code 403)
     *         or Event not found. (status code 404)
     *         or Event has already started or is cancelled. (status code 409)
     * @see AdministrationApi#rescheduleAdminEvent
     */
    default ResponseEntity<EventSummary> rescheduleAdminEvent(Long id,
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
     * PUT /api/admin/events/{id} : Update any event&#39;s editable fields
     *
     * @param id  (required)
     * @param eventUpdateRequest  (required)
     * @return Event updated. (status code 200)
     *         or Not an administrator. (status code 403)
     *         or Event not found. (status code 404)
     * @see AdministrationApi#updateAdminEvent
     */
    default ResponseEntity<EventSummary> updateAdminEvent(Long id,
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
     * PUT /api/admin/locations/{id} : Update any location
     *
     * @param id  (required)
     * @param locationRequest  (required)
     * @return Location updated. (status code 200)
     *         or Not an administrator. (status code 403)
     *         or Location not found. (status code 404)
     * @see AdministrationApi#updateAdminLocation
     */
    default ResponseEntity<LocationSummary> updateAdminLocation(Long id,
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

    /**
     * PUT /api/admin/organisers/{id} : Update any organiser&#39;s profile
     *
     * @param id  (required)
     * @param organiserUpdateRequest  (required)
     * @return Profile updated. (status code 200)
     *         or Not an administrator. (status code 403)
     *         or Organiser not found. (status code 404)
     * @see AdministrationApi#updateAdminOrganiser
     */
    default ResponseEntity<OrganiserProfile> updateAdminOrganiser(Long id,
        OrganiserUpdateRequest organiserUpdateRequest) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"websiteUrl\" : \"websiteUrl\", \"name\" : \"name\", \"description\" : \"description\", \"id\" : 0, \"logoUrl\" : \"logoUrl\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * POST /api/admin/events/{id}/image : Upload or replace the cover image of any event
     *
     * @param id  (required)
     * @param file  (required)
     * @return Image stored successfully. Returns the updated event summary. (status code 200)
     *         or Not an administrator. (status code 403)
     *         or Event not found. (status code 404)
     * @see AdministrationApi#uploadAdminEventImage
     */
    default ResponseEntity<EventSummary> uploadAdminEventImage(Long id,
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
