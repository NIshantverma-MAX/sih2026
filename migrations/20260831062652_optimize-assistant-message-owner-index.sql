DROP INDEX IF EXISTS public.assistant_messages_conversation_recent_idx;

CREATE INDEX assistant_messages_conversation_recent_idx
  ON public.assistant_messages (conversation_id, user_id, created_at DESC, id DESC);
