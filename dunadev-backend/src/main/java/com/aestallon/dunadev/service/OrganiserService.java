package com.aestallon.dunadev.service;

import com.aestallon.dunadev.repository.OrganiserRepository;
import com.aestallon.dunadev.rest.NotFoundException;
import com.aestallon.dunadev.rest.model.OrganiserProfile;
import com.aestallon.dunadev.rest.model.OrganiserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrganiserService {

  private final OrganiserRepository organiserRepository;

  @Transactional(readOnly = true)
  public OrganiserProfile getMyProfile(String email) {
    var organiser = organiserRepository.findByUserEmail(email)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    var profile = new OrganiserProfile(organiser.getId(), organiser.getName());
    profile.setDescription(organiser.getDescription());
    profile.setWebsiteUrl(organiser.getWebsiteUrl());
    profile.setLogoUrl(organiser.getLogoUrl());
    return profile;
  }

  @Transactional
  public OrganiserProfile updateMyProfile(String email, OrganiserUpdateRequest request) {
    var organiser = organiserRepository.findByUserEmail(email)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    organiser.setName(request.getName());
    organiser.setDescription(request.getDescription());
    organiser.setWebsiteUrl(request.getWebsiteUrl());
    organiser = organiserRepository.save(organiser);
    var profile = new OrganiserProfile(organiser.getId(), organiser.getName());
    profile.setDescription(organiser.getDescription());
    profile.setWebsiteUrl(organiser.getWebsiteUrl());
    profile.setLogoUrl(organiser.getLogoUrl());
    return profile;
  }
}
