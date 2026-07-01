package com.aestallon.dunadev.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventLinkEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "event_id", nullable = false)
  private EventEntity event;

  @Column(nullable = false)
  private String label;

  @Column(nullable = false)
  private String url;
}
