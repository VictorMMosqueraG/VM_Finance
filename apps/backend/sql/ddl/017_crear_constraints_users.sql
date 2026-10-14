SET search_path TO vm_finance;

ALTER TABLE users ADD CONSTRAINT pk_users PRIMARY KEY (id);

ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);
