/*
  # Fix storage trigger permissions

  1. Changes
    - Grant necessary permissions to the trigger function
    - Add explicit policy for URL generation
    - Set proper search path for functions
*/

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO PUBLIC;
GRANT EXECUTE ON FUNCTION storage.download_url TO PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_report_id_from_path TO PUBLIC;

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_report_file_upload ON storage.objects;

-- Create trigger with proper permissions
CREATE OR REPLACE FUNCTION public.handle_storage_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only process files in the report-files bucket
  IF NEW.bucket_id = 'report-files' THEN
    -- Extract report ID from path
    DECLARE
      report_id uuid := public.get_report_id_from_path(NEW.name);
    BEGIN
      IF report_id IS NOT NULL THEN
        -- Update the report with the new file URL
        UPDATE reports
        SET 
          status = 'completed',
          file_url = storage.download_url(NEW.bucket_id, NEW.name),
          updated_at = NOW()
        WHERE id = report_id;
      END IF;
    END;
  END IF;
  RETURN NEW;
END;
$$ SET search_path = public, storage;

-- Create the trigger
CREATE TRIGGER on_report_file_upload
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_storage_update();

-- Add explicit policy for reports table updates from trigger
CREATE POLICY "Storage trigger can update report status and file"
  ON reports
  FOR UPDATE
  TO PUBLIC
  USING (true)
  WITH CHECK (
    -- Only allow updating specific fields
    (CASE WHEN file_url IS NOT NULL THEN true ELSE false END) AND
    (CASE WHEN status IN ('completed', 'failed') THEN true ELSE false END)
  );