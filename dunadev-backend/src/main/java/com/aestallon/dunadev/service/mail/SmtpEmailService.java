package com.aestallon.dunadev.service.mail;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

public class SmtpEmailService extends EmailService {

  private final JavaMailSender mailSender;

  public SmtpEmailService(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }

  @Override
  protected void doSend(String to, String subject, String body) {
    var message = new SimpleMailMessage();
    message.setTo(to);
    message.setSubject(subject);
    message.setText(body);
    mailSender.send(message);
  }
}
