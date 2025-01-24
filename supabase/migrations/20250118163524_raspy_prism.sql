/*
  # Create and configure storage bucket

  1. Changes:
    - Creates the report-files bucket if it doesn't exist
    - Ensures bucket is public
    - Sets up RLS policies for authenticated users and service role
*/

-- Create bucket if it doesn't exist
DO $$ 
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('report-files', 'report-files', true)
    ON CONFLICT (id) DO 
    UPDATE SET public = true;
END $$;

-- Enable RLS on objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload report files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read report files" ON storage.objects;
DROP POLICY IF EXISTS "Make.com can upload report files" ON storage.objects;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can upload report files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'report-files' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated users can read report files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'report-files' AND
    auth.uid() IS NOT NULL
  );

-- Create policy for service role
CREATE POLICY "Service role can access all report files"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'report-files')
  WITH CHECK (bucket_id = 'report-files');