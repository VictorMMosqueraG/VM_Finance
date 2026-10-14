SET search_path TO vm_finance;

ALTER TABLE refresh_tokens ADD CONSTRAINT pk_refresh_tokens PRIMARY KEY (id);

ALTER TABLE refresh_tokens ADD CONSTRAINT uq_refresh_tokens_token_hash UNIQUE (token_hash);
ALTER TABLE refresh_tokens ADD CONSTRAINT uq_refresh_tokens_replaced_by_id UNIQUE (replaced_by_id);

ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refresh_tokens_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refresh_tokens_replaced_by_id FOREIGN KEY (replaced_by_id) REFERENCES refresh_tokens(id) ON DELETE SET NULL;
