SET search_path TO vm_finance;

ALTER TABLE push_subscriptions ADD CONSTRAINT pk_push_subscriptions PRIMARY KEY (id);

ALTER TABLE push_subscriptions ADD CONSTRAINT uq_push_subscriptions_endpoint UNIQUE (endpoint);

ALTER TABLE push_subscriptions ADD CONSTRAINT fk_push_subscriptions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
