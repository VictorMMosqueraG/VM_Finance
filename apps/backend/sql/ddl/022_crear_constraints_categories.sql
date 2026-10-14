SET search_path TO vm_finance;

ALTER TABLE categories ADD CONSTRAINT pk_categories PRIMARY KEY (id);

ALTER TABLE categories ADD CONSTRAINT uq_categories_user_id_name UNIQUE (user_id, name);

ALTER TABLE categories ADD CONSTRAINT fk_categories_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
