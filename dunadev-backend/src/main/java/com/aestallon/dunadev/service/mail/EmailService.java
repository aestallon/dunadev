package com.aestallon.dunadev.service.mail;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

public abstract class EmailService {

  private static final Logger log = LoggerFactory.getLogger(EmailService.class);

  private boolean send(String to, String subject, String template, Map<String, String> params) {
    String body;
    try {
      var resource = new ClassPathResource(template);
      body = resource.getContentAsString(StandardCharsets.UTF_8);
    } catch (IOException e) {
      log.error("Email template '{}' not found on classpath", template, e);
      return false;
    }

    for (var entry : params.entrySet()) {
      body = body.replace("{{" + entry.getKey() + "}}", entry.getValue());
    }

    try {
      doSend(to, subject, body);
      return true;
    } catch (Exception e) {
      log.error("Failed to send email to '{}' with subject '{}'", to, subject, e);
      return false;
    }
  }

  protected abstract void doSend(String to, String subject, String body) throws Exception;

  protected final boolean deliver(String to, String subject, String template, Map<String, String> params) {
    return send(to, subject, template, params);
  }

  public boolean notifyPasswordChanged(String to, String changedAt, String adminEmail) {
    return deliver(to, "Your DunaDev password has been changed",
        "email/password-changed.html",
        Map.of("email", to, "changedAt", changedAt, "adminEmail", adminEmail));
  }
}
