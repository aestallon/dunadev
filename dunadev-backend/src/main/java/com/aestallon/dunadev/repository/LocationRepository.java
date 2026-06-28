package com.aestallon.dunadev.repository;

import com.aestallon.dunadev.entity.LocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<LocationEntity, Long> {
}
