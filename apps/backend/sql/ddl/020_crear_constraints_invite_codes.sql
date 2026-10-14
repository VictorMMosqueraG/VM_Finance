SET search_path TO vm_finance;

ALTER TABLE invite_codes ADD CONSTRAINT pk_invite_codes PRIMARY KEY (id);

ALTER TABLE invite_codes ADD CONSTRAINT uq_invite_codes_code UNIQUE (code);
ALTER TABLE invite_codes ADD CONSTRAINT uq_invite_codes_used_by_id UNIQUE (used_by_id);

ALTER TABLE invite_codes ADD CONSTRAINT fk_invite_codes_created_by_id FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE invite_codes ADD CONSTRAINT fk_invite_codes_used_by_id FOREIGN KEY (used_by_id) REFERENCES users(id) ON DELETE SET NULL;
