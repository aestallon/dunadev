package com.aestallon.dunadev.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;

@Service
public class JwtService {

  private final SecretKey signingKey;
  private final Duration accessTokenExpiration;
  private final Duration refreshTokenExpiration;

  public JwtService(
      @Value("${dunadev.jwt.secret}") String secret,
      @Value("${dunadev.jwt.access-token-expiration-minutes}") long accessMinutes,
      @Value("${dunadev.jwt.refresh-token-expiration-days}") long refreshDays) {
    this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.accessTokenExpiration = Duration.ofMinutes(accessMinutes);
    this.refreshTokenExpiration = Duration.ofDays(refreshDays);
  }

  public String generateAccessToken(String email, String role) {
    var now = new Date();
    return Jwts.builder()
        .subject(email)
        .claim("role", role)
        .issuedAt(now)
        .expiration(new Date(now.getTime() + accessTokenExpiration.toMillis()))
        .signWith(signingKey)
        .compact();
  }

  public String generateRefreshToken(String email) {
    var now = new Date();
    return Jwts.builder()
        .subject(email)
        .claim("type", "refresh")
        .issuedAt(now)
        .expiration(new Date(now.getTime() + refreshTokenExpiration.toMillis()))
        .signWith(signingKey)
        .compact();
  }

  public Claims parseAndValidate(String token) {
    return Jwts.parser()
        .verifyWith(signingKey)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  public boolean isRefreshToken(Claims claims) {
    return "refresh".equals(claims.get("type", String.class));
  }

  public long getAccessTokenExpirationSeconds() {
    return accessTokenExpiration.toSeconds();
  }
}
