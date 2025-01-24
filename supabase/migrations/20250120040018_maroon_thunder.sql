/*
  # Add JSON storage for reports

  1. Changes:
    - Add json_data column to reports table
    - Add report_data bucket for storing JSON files
    - Set up RLS policies for JSON storage
*/

-- Add JSON data column to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS json_data jsonb;

-- Create bucket for JSON data if it doesn't exist
DO $$ 
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('report-data', 'report-data', false)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Create policies for JSON data bucket
CREATE POLICY "Authenticated users can read their JSON data"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'report-data' AND
    auth.uid() = (
      SELECT user_id FROM reports 
      WHERE id::text = substring(name from '^[^/]+')
    )
  );

CREATE POLICY "Service role can manage JSON data"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'report-data')
  WITH CHECK (bucket_id = 'report-data');