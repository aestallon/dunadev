--liquibase formatted sql

--changeset dunadev:002-add-how-to-get-there
ALTER TABLE locations ADD COLUMN how_to_get_there TEXT;
