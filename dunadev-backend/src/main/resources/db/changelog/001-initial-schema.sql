--liquibase formatted sql

--changeset dunadev:001-create-users
CREATE TABLE users (
    id         BIGSERIAL    PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role       VARCHAR(50)  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'ORGANISER'))
);

--changeset dunadev:001-create-organisers
CREATE TABLE organisers (
    id          BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT       NOT NULL UNIQUE REFERENCES users (id),
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url    VARCHAR(2048),
    website_url VARCHAR(2048),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

--changeset dunadev:001-create-locations
CREATE TABLE locations (
    id            BIGSERIAL    PRIMARY KEY,
    organiser_id  BIGINT       NOT NULL REFERENCES organisers (id),
    name          VARCHAR(255) NOT NULL,
    address       VARCHAR(500),
    city          VARCHAR(255),
    latitude      DOUBLE PRECISION,
    longitude     DOUBLE PRECISION,
    website_url   VARCHAR(2048),
    active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

--changeset dunadev:001-create-events
CREATE TABLE events (
    id                    BIGSERIAL    PRIMARY KEY,
    organiser_id          BIGINT       NOT NULL REFERENCES organisers (id),
    location_id           BIGINT       REFERENCES locations (id),
    title                 VARCHAR(500) NOT NULL,
    description           TEXT,
    event_url             VARCHAR(2048),
    starts_at             TIMESTAMPTZ  NOT NULL,
    ends_at               TIMESTAMPTZ,
    free                  BOOLEAN      NOT NULL DEFAULT TRUE,
    registration_required BOOLEAN      NOT NULL DEFAULT FALSE,
    registration_url      VARCHAR(2048),
    visible_from          TIMESTAMPTZ,
    status                VARCHAR(50)  NOT NULL DEFAULT 'SCHEDULED',
    cancellation_reason   TEXT,
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT chk_events_status CHECK (status IN ('SCHEDULED', 'CANCELLED', 'RESCHEDULED'))
);

--changeset dunadev:001-create-event-links
CREATE TABLE event_links (
    id       BIGSERIAL    PRIMARY KEY,
    event_id BIGINT       NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    label    VARCHAR(255) NOT NULL,
    url      VARCHAR(2048) NOT NULL
);

--changeset dunadev:001-create-indexes
CREATE INDEX idx_events_organiser_id ON events (organiser_id);
CREATE INDEX idx_events_location_id ON events (location_id);
CREATE INDEX idx_events_starts_at ON events (starts_at);
CREATE INDEX idx_events_status ON events (status);
CREATE INDEX idx_events_visible_from ON events (visible_from);
CREATE INDEX idx_locations_organiser_id ON locations (organiser_id);
CREATE INDEX idx_event_links_event_id ON event_links (event_id);
