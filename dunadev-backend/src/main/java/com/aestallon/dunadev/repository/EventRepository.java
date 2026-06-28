package com.aestallon.dunadev.repository;

import com.aestallon.dunadev.entity.EventEntity;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.OffsetDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<EventEntity, Long> {

  @Query("""
      SELECT e FROM EventEntity e
        JOIN FETCH e.organiser
        LEFT JOIN FETCH e.location
        LEFT JOIN FETCH e.links
      WHERE e.status <> 'CANCELLED'
        AND e.startsAt > :now
        AND (e.visibleFrom IS NULL OR e.visibleFrom <= :now)
      ORDER BY e.startsAt ASC
      """)
  List<EventEntity> findUpcoming(OffsetDateTime now, Pageable pageable);

  @Query("""
      SELECT e FROM EventEntity e
        JOIN FETCH e.organiser
        LEFT JOIN FETCH e.location
        LEFT JOIN FETCH e.links
      WHERE e.status <> 'CANCELLED'
        AND e.startsAt >= :from AND e.startsAt < :to
        AND (e.visibleFrom IS NULL OR e.visibleFrom <= :now)
      ORDER BY e.startsAt ASC
      """)
  List<EventEntity> findByMonth(OffsetDateTime from, OffsetDateTime to, OffsetDateTime now);
}
