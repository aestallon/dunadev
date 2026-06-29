package com.aestallon.dunadev.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import com.aestallon.dunadev.service.mail.EmailService;
import com.aestallon.dunadev.service.mail.LoggingEmailService;
import com.aestallon.dunadev.service.mail.SmtpEmailService;

@Configuration
public class EmailConfig {

  @Bean
  @ConditionalOnBean(JavaMailSender.class)
  public EmailService emailService(JavaMailSender mailSender) {
    return new SmtpEmailService(mailSender);
  }

  @Bean
  @ConditionalOnMissingBean(JavaMailSender.class)
  public EmailService mockEmailService() {
    return new LoggingEmailService();
  }
}
