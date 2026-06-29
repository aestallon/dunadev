package com.aestallon.dunadev.rest;

import com.aestallon.dunadev.entity.UserEntity;
import com.aestallon.dunadev.repository.UserRepository;
import com.aestallon.dunadev.rest.api.AccountApiDelegate;
import com.aestallon.dunadev.rest.model.PasswordChangeRequest;
import com.aestallon.dunadev.service.mail.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;

@Service
@RequiredArgsConstructor
public class AccountApiDelegateImpl implements AccountApiDelegate {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final EmailService emailService;

  @Value("${dunadev.admin-email}")
  private String adminEmail;

  @Override
  public ResponseEntity<Void> changePassword(PasswordChangeRequest request) {
    var user = (UserEntity) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
      return ResponseEntity.badRequest().build();
    }

    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    emailService.notifyPasswordChanged(
        user.getEmail(),
        OffsetDateTime.now().toZonedDateTime().format(DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL)),
        adminEmail);

    return ResponseEntity.noContent().build();
  }
}
