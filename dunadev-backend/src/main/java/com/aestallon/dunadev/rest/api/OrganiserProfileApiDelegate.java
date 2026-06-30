package com.aestallon.dunadev.rest.api;

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
 * A delegate to be called by the {@link OrganiserProfileApiController}}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public interface OrganiserProfileApiDelegate {

    default Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    /**
     * DELETE /api/organiser/me : Permanently delete the authenticated organiser&#39;s account
     * Deletes all future events, anonymises past events and locations, removes the user record, and sends a confirmation email. This action is irreversible. 
     *
     * @return Account deleted successfully. (status code 204)
     *         or Not authenticated. (status code 401)
     *         or Organiser profile not found. (status code 404)
     * @see OrganiserProfileApi#deleteMyAccount
     */
    default ResponseEntity<Void> deleteMyAccount() {
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * GET /api/organiser/me : Get the authenticated organiser&#39;s profile
     *
     * @return The organiser&#39;s profile. (status code 200)
     *         or Not authenticated. (status code 401)
     *         or Organiser profile not found. (status code 404)
     * @see OrganiserProfileApi#getMyOrganiserProfile
     */
    default ResponseEntity<OrganiserProfile> getMyOrganiserProfile() {
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
     * PUT /api/organiser/me : Update the authenticated organiser&#39;s profile
     *
     * @param organiserUpdateRequest  (required)
     * @return Profile updated successfully. (status code 200)
     *         or Not authenticated. (status code 401)
     *         or Organiser profile not found. (status code 404)
     * @see OrganiserProfileApi#updateMyOrganiserProfile
     */
    default ResponseEntity<OrganiserProfile> updateMyOrganiserProfile(OrganiserUpdateRequest organiserUpdateRequest) {
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

}
