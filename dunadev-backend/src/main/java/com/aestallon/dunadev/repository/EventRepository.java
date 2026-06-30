package com.aestallon.dunadev.repository;

import com.aestallon.dunadev.entity.EventEntity;
import com.aestallon.dunadev.entity.OrganiserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;


public interface EventRepository extends JpaRepository<EventEntity, Long> {

  @Query("""
      SELECT e FROM EventEntity e
        LEFT JOIN FETCH e.organiser
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
        LEFT JOIN FETCH e.organiser
        LEFT JOIN FETCH e.location
        LEFT JOIN FETCH e.links
      WHERE e.startsAt >= :from AND e.startsAt < :to
        AND (e.visibleFrom IS NULL OR e.visibleFrom <= :now)
      ORDER BY e.startsAt ASC
      """)
  List<EventEntity> findByMonth(OffsetDateTime from, OffsetDateTime to, OffsetDateTime now);

  boolean existsByLocationId(Long locationId);

  @Query("""
      SELECT e FROM EventEntity e
        LEFT JOIN FETCH e.organiser
        LEFT JOIN FETCH e.location
        LEFT JOIN FETCH e.links
      WHERE e.id = :id AND e.organiser = :organiser
      """)
  Optional<EventEntity> findByIdAndOrganiser(Long id, OrganiserEntity organiser);

  @Query("""
      SELECT e FROM EventEntity e
        LEFT JOIN FETCH e.organiser
        LEFT JOIN FETCH e.location
        LEFT JOIN FETCH e.links
      WHERE e.organiser = :organiser
      ORDER BY e.startsAt DESC
      """)
  List<EventEntity> findByOrganiserOrderByStartsAtDesc(OrganiserEntity organiser);

  @Query("""
      SELECT e FROM EventEntity e
        LEFT JOIN FETCH e.organiser
        LEFT JOIN FETCH e.location
        LEFT JOIN FETCH e.links
      WHERE e.startsAt > :from AND e.startsAt <= :to
      ORDER BY e.startsAt ASC
      """)
  List<EventEntity> findAdminUpcoming(OffsetDateTime from, OffsetDateTime to);

  @Query("""
      SELECT e FROM EventEntity e
        LEFT JOIN FETCH e.organiser
        LEFT JOIN FETCH e.location
        LEFT JOIN FETCH e.links
      WHERE e.organiser.id = :organiserId
      ORDER BY e.startsAt DESC
      """)
  List<EventEntity> findByOrganiserIdOrderByStartsAtDesc(Long organiserId);

  @Query("""
      SELECT e FROM EventEntity e
        LEFT JOIN FETCH e.organiser
        LEFT JOIN FETCH e.location
        LEFT JOIN FETCH e.links
      WHERE e.id = :id
      """)
  Optional<EventEntity> findByIdAdmin(Long id);

  long countByOrganiser(OrganiserEntity organiser);

  @Modifying
  @Query("DELETE FROM EventEntity e WHERE e.organiser = :organiser AND e.startsAt > :now")
  void deleteFutureByOrganiser(OrganiserEntity organiser, OffsetDateTime now);

  @Modifying
  @Query("UPDATE EventEntity e SET e.organiser = null WHERE e.organiser = :organiser")
  void detachOrganiserFromPastEvents(OrganiserEntity organiser);
}
