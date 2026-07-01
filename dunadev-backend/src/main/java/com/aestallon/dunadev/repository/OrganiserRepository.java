package com.aestallon.dunadev.repository;

import com.aestallon.dunadev.entity.OrganiserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganiserRepository extends JpaRepository<OrganiserEntity, Long> {

  Optional<OrganiserEntity> findByUserEmail(String email);
}
