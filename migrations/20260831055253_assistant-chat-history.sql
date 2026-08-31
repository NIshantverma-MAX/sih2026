CREATE TABLE public.assistant_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid()
    REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT assistant_conversations_title_length
    CHECK (char_length(btrim(title)) BETWEEN 1 AND 120),
  CONSTRAINT assistant_conversations_language
    CHECK (language IN ('en', 'hi')),
  CONSTRAINT assistant_conversations_owner_key UNIQUE (id, user_id)
);

CREATE TABLE public.assistant_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  user_id UUID NOT NULL DEFAULT auth.uid()
    REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT assistant_messages_conversation_owner_fk
    FOREIGN KEY (conversation_id, user_id)
    REFERENCES public.assistant_conversations(id, user_id)
    ON DELETE CASCADE,
  CONSTRAINT assistant_messages_role
    CHECK (role IN ('user', 'assistant')),
  CONSTRAINT assistant_messages_content_length
    CHECK (char_length(btrim(content)) BETWEEN 1 AND 20000),
  CONSTRAINT assistant_messages_language
    CHECK (language IN ('en', 'hi')),
  CONSTRAINT assistant_messages_response_object
    CHECK (response IS NULL OR jsonb_typeof(response) = 'object')
);

CREATE INDEX assistant_conversations_owner_recent_idx
  ON public.assistant_conversations (user_id, updated_at DESC, id DESC);

CREATE INDEX assistant_messages_conversation_recent_idx
  ON public.assistant_messages (user_id, conversation_id, created_at DESC, id DESC);

CREATE TRIGGER assistant_conversations_updated_at
  BEFORE UPDATE ON public.assistant_conversations
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE OR REPLACE FUNCTION public.touch_assistant_conversation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  UPDATE public.assistant_conversations
  SET updated_at = NEW.created_at
  WHERE id = NEW.conversation_id
    AND user_id = NEW.user_id;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.touch_assistant_conversation() FROM PUBLIC;

CREATE TRIGGER assistant_messages_touch_conversation
  AFTER INSERT ON public.assistant_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_assistant_conversation();

ALTER TABLE public.assistant_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY assistant_conversations_select_own
  ON public.assistant_conversations
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY assistant_conversations_insert_own
  ON public.assistant_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY assistant_messages_select_own
  ON public.assistant_messages
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY assistant_messages_insert_own
  ON public.assistant_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

REVOKE ALL ON TABLE public.assistant_conversations FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.assistant_messages FROM PUBLIC, anon, authenticated;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON TABLE public.assistant_conversations TO authenticated;
GRANT SELECT, INSERT ON TABLE public.assistant_messages TO authenticated;
