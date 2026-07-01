package com.aestallon.dunadev.service.mail;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

public class SmtpEmailService extends EmailService {

  private final JavaMailSender mailSender;
  private final String from;

  public SmtpEmailService(JavaMailSender mailSender, String from) {
    this.mailSender = mailSender;
    this.from = from;
  }

  @Override
  protected void doSend(String to, String subject, String body) {
    var message = new SimpleMailMessage();
    message.setFrom(from);
    message.setTo(to);
    message.setSubject(subject);
    message.setText(body);
    mailSender.send(message);
  }
}
