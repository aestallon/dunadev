package com.aestallon.dunadev.rest;

import com.aestallon.dunadev.repository.UserRepository;
import com.aestallon.dunadev.rest.api.AuthenticationApiDelegate;
import com.aestallon.dunadev.rest.model.AuthResponse;
import com.aestallon.dunadev.rest.model.LoginRequest;
import com.aestallon.dunadev.rest.model.RefreshRequest;
import com.aestallon.dunadev.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationApiDelegateImpl implements AuthenticationApiDelegate {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  @Override
  public ResponseEntity<AuthResponse> login(LoginRequest loginRequest) {
    var user = userRepository.findByEmail(loginRequest.getEmail())
        .filter(u -> passwordEncoder.matches(loginRequest.getPassword(), u.getPasswordHash()))
        .orElse(null);
    if (user == null) {
      return ResponseEntity.status(401).build();
    }
    return ResponseEntity.ok(buildAuthResponse(user.getEmail(), user.getRole()));
  }

  @Override
  public ResponseEntity<AuthResponse> refreshToken(RefreshRequest refreshRequest) {
    try {
      var claims = jwtService.parseAndValidate(refreshRequest.getRefreshToken());
      if (!jwtService.isRefreshToken(claims)) {
        return ResponseEntity.status(401).build();
      }
      var user = userRepository.findByEmail(claims.getSubject()).orElse(null);
      if (user == null) {
        return ResponseEntity.status(401).build();
      }
      return ResponseEntity.ok(buildAuthResponse(user.getEmail(), user.getRole()));
    } catch (Exception e) {
      return ResponseEntity.status(401).build();
    }
  }

  private AuthResponse buildAuthResponse(String email, String role) {
    return new AuthResponse()
        .accessToken(jwtService.generateAccessToken(email, role))
        .refreshToken(jwtService.generateRefreshToken(email))
        .expiresIn(jwtService.getAccessTokenExpirationSeconds())
        .role(role);
  }
}
