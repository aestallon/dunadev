--liquibase formatted sql
--changeset dunadev:006
ALTER TABLE events ALTER COLUMN organiser_id DROP NOT NULL;
ALTER TABLE locations ALTER COLUMN organiser_id DROP NOT NULL;
ALTER TABLE organisers ALTER COLUMN user_id DROP NOT NULL;
