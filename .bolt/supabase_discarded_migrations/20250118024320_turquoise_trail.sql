/*
  # Fix storage bucket policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new simplified storage policies
    - Keep bucket public for file access
    - Add proper user authentication checks

  2. Security
    - Enable RLS on storage.objects
    - Add policies for authenticated users
    - Maintain public bucket setting for file access
*/

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('report-files', 'report-files')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload report files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read report files" ON storage.objects;

-- Create new policies for report-files bucket
CREATE POLICY "Authenticated users can upload report files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'report-files' AND
    auth.uid()::text = (
      SELECT user_id::text 
      FROM reports 
      WHERE id::text = split_part(name, '/', 1)
    )
  );

CREATE POLICY "Authenticated users can read report files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'report-files' AND
    auth.uid()::text = (
      SELECT user_id::text 
      FROM reports 
      WHERE id::text = split_part(name, '/', 1)
    )
  );

-- Make bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'report-files';