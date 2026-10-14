SET search_path TO vm_finance;

ALTER TABLE debts ADD CONSTRAINT pk_debts PRIMARY KEY (id);

ALTER TABLE debts ADD CONSTRAINT uq_debts_user_id_name UNIQUE (user_id, name);

ALTER TABLE debts ADD CONSTRAINT chk_debts_total_amount CHECK (total_amount > 0);

ALTER TABLE debts ADD CONSTRAINT fk_debts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
