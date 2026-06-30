package com.aestallon.dunadev.service;

import com.aestallon.dunadev.entity.OrganiserEntity;
import com.aestallon.dunadev.repository.EventRepository;
import com.aestallon.dunadev.repository.LocationRepository;
import com.aestallon.dunadev.repository.OrganiserRepository;
import com.aestallon.dunadev.repository.UserRepository;
import com.aestallon.dunadev.rest.NotFoundException;
import com.aestallon.dunadev.rest.model.OrganiserProfile;
import com.aestallon.dunadev.rest.model.OrganiserUpdateRequest;
import com.aestallon.dunadev.service.mail.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Service
@RequiredArgsConstructor
public class OrganiserService {

  private final OrganiserRepository organiserRepository;
  private final EventRepository eventRepository;
  private final LocationRepository locationRepository;
  private final UserRepository userRepository;
  private final EmailService emailService;

  @Value("${dunadev.admin-email}")
  private String adminEmail;

  @Transactional(readOnly = true)
  public OrganiserProfile getMyProfile(String email) {
    var organiser = organiserRepository.findByUserEmail(email)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    return toProfile(organiser);
  }

  @Transactional
  public OrganiserProfile updateMyProfile(String email, OrganiserUpdateRequest request) {
    var organiser = organiserRepository.findByUserEmail(email)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    organiser.setName(request.getName());
    organiser.setDescription(request.getDescription());
    organiser.setWebsiteUrl(request.getWebsiteUrl());
    organiser = organiserRepository.save(organiser);
    return toProfile(organiser);
  }

  @Transactional
  public void deleteMyAccount(String email) {
    var organiser = organiserRepository.findByUserEmail(email)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    deleteOrganiser(organiser);
  }

  @Transactional
  public void deleteOrganiserById(Long id) {
    var organiser = organiserRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Organiser not found"));
    deleteOrganiser(organiser);
  }

  private void deleteOrganiser(OrganiserEntity organiser) {
    var email = organiser.getUser().getEmail();
    var orgName = organiser.getName();

    var now = OffsetDateTime.now(ZoneOffset.UTC);
    eventRepository.deleteFutureByOrganiser(organiser, now);
    eventRepository.detachOrganiserFromPastEvents(organiser);
    locationRepository.detachOrganiser(organiser);

    organiser.setName("[Deleted Organiser]");
    organiser.setDescription(null);
    organiser.setLogoUrl(null);
    organiser.setWebsiteUrl(null);
    organiser.setStatus("DELETED");
    organiser.setUser(null);
    organiserRepository.save(organiser);

    userRepository.deleteByEmail(email);

    emailService.notifyAccountDeleted(email, orgName, adminEmail);
  }

  private static OrganiserProfile toProfile(OrganiserEntity o) {
    var profile = new OrganiserProfile(o.getId(), o.getName());
    profile.setDescription(o.getDescription());
    profile.setWebsiteUrl(o.getWebsiteUrl());
    profile.setLogoUrl(o.getLogoUrl());
    return profile;
  }
}
