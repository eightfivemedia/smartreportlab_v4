/*
  # Configure storage for report files

  1. Storage Setup
    - Create report-files bucket
    - Enable RLS on storage.objects
    - Add policies for authenticated users
  
  2. Security
    - Users can only access their own report files
    - Bucket is public for webhook access
*/

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('report-files', 'report-files')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for report-files bucket
CREATE POLICY "Authenticated users can upload report files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'report-files' AND
    auth.uid()::text = (
      SELECT user_id::text 
      FROM reports 
      WHERE id::text = substring(name from '^[^/]+')
    )
  );

CREATE POLICY "Authenticated users can read report files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'report-files' AND
    auth.uid()::text = (
      SELECT user_id::text 
      FROM reports 
      WHERE id::text = substring(name from '^[^/]+')
    )
  );

-- Make bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'report-files';