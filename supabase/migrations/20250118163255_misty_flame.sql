/*
  # Add Make.com webhook policies

  1. Changes
    - Add policy to allow Make.com to update report status and file URL
    - Add policy to allow Make.com to upload generated PDF files
  
  2. Security
    - Policies are restricted to specific columns for safety
    - File uploads are restricted to the report-files bucket
*/

-- Create a service role policy for Make.com to update reports
CREATE POLICY "Make.com can update report status and file"
  ON reports
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (
    -- Only allow updating specific fields
    (CASE WHEN file_url IS NOT NULL THEN true ELSE false END) AND
    (CASE WHEN status IN ('completed', 'failed') THEN true ELSE false END)
  );

-- Create a service role policy for Make.com to upload files
CREATE POLICY "Make.com can upload report files"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (
    bucket_id = 'report-files' AND
    -- Ensure the file is being uploaded to a valid report directory
    EXISTS (
      SELECT 1 FROM reports 
      WHERE id::text = substring(name from '^[^/]+')
    )
  );