SET search_path TO vm_finance;

ALTER TABLE income_sources ADD CONSTRAINT pk_income_sources PRIMARY KEY (id);

ALTER TABLE income_sources ADD CONSTRAINT uq_income_sources_user_id_name UNIQUE (user_id, name);

ALTER TABLE income_sources ADD CONSTRAINT chk_income_sources_savings_percent CHECK (savings_percent BETWEEN 0 AND 100);
ALTER TABLE income_sources ADD CONSTRAINT chk_income_sources_default_amount CHECK (default_amount >= 0);

ALTER TABLE income_sources ADD CONSTRAINT fk_income_sources_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
