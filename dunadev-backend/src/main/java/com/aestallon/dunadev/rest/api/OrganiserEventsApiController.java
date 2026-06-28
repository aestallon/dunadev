package com.aestallon.dunadev.rest.api;

import com.aestallon.dunadev.rest.model.EventRequest;
import com.aestallon.dunadev.rest.model.EventSummary;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import jakarta.annotation.Generated;

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.17.0")
@Controller
@RequestMapping("${openapi.dunaDev.base-path:}")
public class OrganiserEventsApiController implements OrganiserEventsApi {

    private final OrganiserEventsApiDelegate delegate;

    public OrganiserEventsApiController(@Autowired(required = false) OrganiserEventsApiDelegate delegate) {
        this.delegate = Optional.ofNullable(delegate).orElse(new OrganiserEventsApiDelegate() {});
    }

    @Override
    public OrganiserEventsApiDelegate getDelegate() {
        return delegate;
    }

}
