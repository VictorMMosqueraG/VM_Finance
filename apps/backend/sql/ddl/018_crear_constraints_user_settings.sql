SET search_path TO vm_finance;

ALTER TABLE user_settings ADD CONSTRAINT pk_user_settings PRIMARY KEY (user_id);

ALTER TABLE user_settings ADD CONSTRAINT fk_user_settings_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
