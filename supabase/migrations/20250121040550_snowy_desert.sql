-- Create avatars bucket if it doesn't exist
DO $$ 
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true)
    ON CONFLICT (id) DO 
    UPDATE SET public = true;
END $$;

-- Enable RLS on objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for avatars bucket
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = substring(name from '^[^/]+')
  );

CREATE POLICY "Users can read all avatars"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars');

-- Create policy for service role
CREATE POLICY "Service role can manage avatars"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'avatars')
  WITH CHECK (bucket_id = 'avatars');