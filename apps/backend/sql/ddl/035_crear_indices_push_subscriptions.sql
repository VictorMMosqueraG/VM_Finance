SET search_path TO vm_finance;

CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions (user_id);
