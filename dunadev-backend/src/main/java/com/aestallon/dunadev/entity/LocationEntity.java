package com.aestallon.dunadev.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(name = "organiser_id", nullable = true)
  private OrganiserEntity organiser;

  @Column(nullable = false)
  private String name;

  private String address;

  private String city;

  private Double latitude;

  private Double longitude;

  @Column(name = "website_url")
  private String websiteUrl;

  @Column(name = "how_to_get_there")
  private String howToGetThere;

  @Column(nullable = false)
  @Builder.Default
  private boolean active = true;

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
