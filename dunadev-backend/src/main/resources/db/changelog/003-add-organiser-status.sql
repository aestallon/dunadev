--liquibase formatted sql

--changeset dunadev:003-add-organiser-status
ALTER TABLE organisers
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CONSTRAINT chk_organisers_status CHECK (status IN ('INVITED', 'ACTIVE'));
