package com.aestallon.dunadev.rest.api;

import com.aestallon.dunadev.rest.model.ApiError;
import com.aestallon.dunadev.rest.model.PasswordChangeRequest;
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
 * A delegate to be called by the {@link AccountApiController}}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public interface AccountApiDelegate {

    default Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    /**
     * POST /api/me/password : Change the authenticated user&#39;s password
     * Verifies the current password then replaces it with the new one. Triggers a notification email to the account&#39;s registered address. 
     *
     * @param passwordChangeRequest  (required)
     * @return Password changed successfully. (status code 204)
     *         or Current password is incorrect or new password fails validation. (status code 400)
     *         or Not authenticated. (status code 401)
     * @see AccountApi#changePassword
     */
    default ResponseEntity<Void> changePassword(PasswordChangeRequest passwordChangeRequest) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"description\" : \"description\", \"message\" : \"message\", \"status\" : 0, \"timestamp\" : \"2000-01-23T04:56:07.000+00:00\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

}
