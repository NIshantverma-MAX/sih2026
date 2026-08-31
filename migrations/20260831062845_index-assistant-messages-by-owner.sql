CREATE INDEX assistant_messages_owner_recent_idx
  ON public.assistant_messages (user_id, created_at DESC, id DESC);
