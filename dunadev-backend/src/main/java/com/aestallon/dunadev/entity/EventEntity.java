package com.aestallon.dunadev.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "organiser_id", nullable = false)
  private OrganiserEntity organiser;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "location_id")
  private LocationEntity location;

  @Column(nullable = false)
  private String title;

  private String description;

  @Column(name = "event_url")
  private String eventUrl;

  @Column(name = "starts_at", nullable = false)
  private OffsetDateTime startsAt;

  @Column(name = "ends_at")
  private OffsetDateTime endsAt;

  @Column(nullable = false)
  @Builder.Default
  private boolean free = true;

  @Column(name = "registration_required", nullable = false)
  private boolean registrationRequired;

  @Column(name = "registration_url")
  private String registrationUrl;

  @Column(name = "visible_from")
  private OffsetDateTime visibleFrom;

  @Column(nullable = false)
  @Builder.Default
  private String status = "SCHEDULED";

  @Column(name = "cancellation_reason")
  private String cancellationReason;

  @Column(name = "on_new_location", nullable = false)
  @Builder.Default
  private boolean onNewLocation = false;

  @Column(name = "cover_image_url")
  private String coverImageUrl;

  @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<EventLinkEntity> links = new ArrayList<>();

  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt;

  @PrePersist
  void onCreate() {
    var now = OffsetDateTime.now();
    createdAt = now;
    updatedAt = now;
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = OffsetDateTime.now();
  }
}
