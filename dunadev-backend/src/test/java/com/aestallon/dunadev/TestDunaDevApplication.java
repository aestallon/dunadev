package com.aestallon.dunadev;

import org.springframework.boot.SpringApplication;

public class TestDunaDevApplication {

  public static void main(String[] args) {
    SpringApplication.from(DunaDevApplication::main).with(TestcontainersConfiguration.class)
        .run(args);
  }

}
