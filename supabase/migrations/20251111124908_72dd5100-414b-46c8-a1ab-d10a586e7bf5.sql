-- Drop the view and recreate it with SECURITY INVOKER
DROP VIEW IF EXISTS public.conversations;

CREATE VIEW public.conversations
WITH (security_invoker = true)
AS
SELECT DISTINCT
  CASE
    WHEN m.sender_id < m.receiver_id THEN m.sender_id
    ELSE m.receiver_id
  END AS user1_id,
  CASE
    WHEN m.sender_id < m.receiver_id THEN m.receiver_id
    ELSE m.sender_id
  END AS user2_id,
  m.donation_id,
  MAX(m.created_at) AS last_message_at,
  COUNT(*) FILTER (WHERE NOT m.read AND m.receiver_id = auth.uid()) AS unread_count
FROM public.messages m
WHERE m.sender_id = auth.uid() OR m.receiver_id = auth.uid()
GROUP BY
  CASE WHEN m.sender_id < m.receiver_id THEN m.sender_id ELSE m.receiver_id END,
  CASE WHEN m.sender_id < m.receiver_id THEN m.receiver_id ELSE m.sender_id END,
  m.donation_id;