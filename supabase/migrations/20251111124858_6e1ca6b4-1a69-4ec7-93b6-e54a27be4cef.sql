-- Add columns to messages table for media and location
ALTER TABLE public.messages
ADD COLUMN photo_url TEXT,
ADD COLUMN location_lat NUMERIC,
ADD COLUMN location_lng NUMERIC,
ADD COLUMN location_name TEXT;

-- Create storage bucket for chat photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-photos',
  'chat-photos',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Storage policies for chat photos
CREATE POLICY "Users can upload their own chat photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'chat-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view photos from their conversations"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'chat-photos' AND
    EXISTS (
      SELECT 1 FROM public.messages
      WHERE (sender_id = auth.uid() OR receiver_id = auth.uid())
      AND photo_url LIKE '%' || (storage.objects.name) || '%'
    )
  );

CREATE POLICY "Users can delete their own chat photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'chat-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create conversations view for easier querying
CREATE OR REPLACE VIEW public.conversations AS
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