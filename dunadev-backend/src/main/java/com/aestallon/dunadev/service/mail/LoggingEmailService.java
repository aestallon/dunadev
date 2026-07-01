package com.aestallon.dunadev.service.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

public class LoggingEmailService extends EmailService {

  private static final Logger log = LoggerFactory.getLogger(LoggingEmailService.class);

  @Override
  protected void doSend(String to, String subject, String body) {
    log.info("""
        [EMAIL — NOT SENT — no spring.mail.host configured]
        To:      {}
        Subject: {}
        Body:
        {}
        """, to, subject, body);
  }
}
