package com.aestallon.dunadev.repository;

import com.aestallon.dunadev.entity.LocationEntity;
import com.aestallon.dunadev.entity.OrganiserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<LocationEntity, Long> {

  List<LocationEntity> findByOrganiserAndActiveTrue(OrganiserEntity organiser);

  Optional<LocationEntity> findByIdAndOrganiser(Long id, OrganiserEntity organiser);
}
