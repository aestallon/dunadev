--liquibase formatted sql
--changeset dunadev:005
ALTER TABLE events ADD COLUMN on_new_location BOOLEAN NOT NULL DEFAULT FALSE;
