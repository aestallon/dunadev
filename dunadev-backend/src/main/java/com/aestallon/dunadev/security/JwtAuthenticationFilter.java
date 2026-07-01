package com.aestallon.dunadev.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
    var header = request.getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")) {
      var token = header.substring(7);
      try {
        var claims = jwtService.parseAndValidate(token);
        var email = claims.getSubject();
        if (!jwtService.isRefreshToken(claims)
            && email != null
            && SecurityContextHolder.getContext().getAuthentication() == null) {
          var userDetails = userDetailsService.loadUserByUsername(email);
          var auth = new UsernamePasswordAuthenticationToken(
              userDetails, null, userDetails.getAuthorities());
          auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(auth);
        }
      } catch (Exception ignored) {
        // invalid or expired token — proceed unauthenticated
      }
    }
    filterChain.doFilter(request, response);
  }
}
