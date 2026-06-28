package com.aestallon.dunadev.rest.api;

import com.aestallon.dunadev.rest.model.AuthResponse;
import com.aestallon.dunadev.rest.model.LoginRequest;
import com.aestallon.dunadev.rest.model.RefreshRequest;
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
 * A delegate to be called by the {@link AuthenticationApiController}}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
public interface AuthenticationApiDelegate {

    default Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    /**
     * POST /api/auth/login : Authenticate with email and password
     * Validates the provided credentials and returns an access/refresh token pair. 
     *
     * @param loginRequest  (required)
     * @return Authentication successful. (status code 200)
     *         or Invalid credentials. (status code 401)
     * @see AuthenticationApi#login
     */
    default ResponseEntity<AuthResponse> login(LoginRequest loginRequest) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"expiresIn\" : 0, \"role\" : \"role\", \"accessToken\" : \"accessToken\", \"refreshToken\" : \"refreshToken\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    /**
     * POST /api/auth/refresh : Refresh an access token
     * Accepts a valid refresh token and returns a new access/refresh token pair. 
     *
     * @param refreshRequest  (required)
     * @return Token refreshed successfully. (status code 200)
     *         or Invalid or expired refresh token. (status code 401)
     * @see AuthenticationApi#refreshToken
     */
    default ResponseEntity<AuthResponse> refreshToken(RefreshRequest refreshRequest) {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"expiresIn\" : 0, \"role\" : \"role\", \"accessToken\" : \"accessToken\", \"refreshToken\" : \"refreshToken\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

}
