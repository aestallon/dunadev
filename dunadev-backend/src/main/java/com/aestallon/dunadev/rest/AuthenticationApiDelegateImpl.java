package com.aestallon.dunadev.rest;

import com.aestallon.dunadev.entity.UserEntity;
import com.aestallon.dunadev.rest.api.AuthenticationApiDelegate;
import com.aestallon.dunadev.rest.model.AuthResponse;
import com.aestallon.dunadev.rest.model.LoginRequest;
import com.aestallon.dunadev.rest.model.RefreshRequest;
import com.aestallon.dunadev.security.JwtService;
import com.aestallon.dunadev.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationApiDelegateImpl implements AuthenticationApiDelegate {

  private final AuthenticationManager authenticationManager;
  private final UserDetailsService userDetailsService;
  private final JwtService jwtService;
  private final AdminService adminService;

  @Override
  public ResponseEntity<AuthResponse> login(LoginRequest loginRequest) {
    try {
      var authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
      var user = (UserEntity) authentication.getPrincipal();
      if ("ORGANISER".equals(user.getRole())) {
        adminService.activateIfInvited(user.getEmail());
      }
      return ResponseEntity.ok(buildAuthResponse(user.getEmail(), user.getRole()));
    } catch (BadCredentialsException e) {
      return ResponseEntity.status(401).build();
    }
  }

  @Override
  public ResponseEntity<AuthResponse> refreshToken(RefreshRequest refreshRequest) {
    try {
      var claims = jwtService.parseAndValidate(refreshRequest.getRefreshToken());
      if (!jwtService.isRefreshToken(claims)) {
        return ResponseEntity.status(401).build();
      }
      var user = (UserEntity) userDetailsService.loadUserByUsername(claims.getSubject());
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
