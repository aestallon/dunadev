package com.aestallon.dunadev.repository;

import com.aestallon.dunadev.entity.LocationEntity;
import com.aestallon.dunadev.entity.OrganiserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<LocationEntity, Long> {

  List<LocationEntity> findByOrganiserAndActiveTrue(OrganiserEntity organiser);

  Optional<LocationEntity> findByIdAndOrganiser(Long id, OrganiserEntity organiser);

  List<LocationEntity> findByOrganiserIdAndActiveTrue(Long organiserId);

  Optional<LocationEntity> findByIdAndOrganiserId(Long id, Long organiserId);

  long countByOrganiserAndActiveTrue(OrganiserEntity organiser);

  @Modifying
  @Query("UPDATE LocationEntity l SET l.organiser = null WHERE l.organiser = :organiser")
  void detachOrganiser(OrganiserEntity organiser);
}
