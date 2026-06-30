--liquibase formatted sql
--changeset dunadev:004

ALTER TABLE events ADD COLUMN cover_image_url VARCHAR(512);
