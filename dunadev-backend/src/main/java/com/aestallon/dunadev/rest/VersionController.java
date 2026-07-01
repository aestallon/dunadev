package com.aestallon.dunadev.rest;

import org.springframework.boot.info.BuildProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/version")
public class VersionController {

  private final BuildProperties buildProperties;

  public VersionController(BuildProperties buildProperties) {
    this.buildProperties = buildProperties;
  }

  @GetMapping
  public ResponseEntity<Map<String, String>> version() {
    var time = buildProperties.getTime();
    return ResponseEntity.ok(Map.of(
        "version", buildProperties.getVersion(),
        "buildTime", time != null ? time.toString() : "unknown"
    ));
  }
}
