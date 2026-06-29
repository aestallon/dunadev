package com.aestallon.dunadev.rest;

import com.aestallon.dunadev.rest.api.OrganiserProfileApiDelegate;
import com.aestallon.dunadev.rest.model.OrganiserProfile;
import com.aestallon.dunadev.rest.model.OrganiserUpdateRequest;
import com.aestallon.dunadev.service.OrganiserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrganiserProfileApiDelegateImpl implements OrganiserProfileApiDelegate {

  private final OrganiserService organiserService;

  @Override
  public ResponseEntity<OrganiserProfile> getMyOrganiserProfile() {
    return ResponseEntity.ok(organiserService.getMyProfile(currentEmail()));
  }

  @Override
  public ResponseEntity<OrganiserProfile> updateMyOrganiserProfile(OrganiserUpdateRequest request) {
    return ResponseEntity.ok(organiserService.updateMyProfile(currentEmail(), request));
  }

  private static String currentEmail() {
    return SecurityContextHolder.getContext().getAuthentication().getName();
  }
}
