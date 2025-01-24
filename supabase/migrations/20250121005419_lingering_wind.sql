/*
  # Add report file trigger

  1. Changes
    - Add trigger to update report status and file_url when a file is uploaded
    - Add function to handle the trigger logic
    - Add function to extract report ID from file path

  2. Security
    - Function is owned by postgres role for maximum security
*/

-- Function to extract report ID from storage path
CREATE OR REPLACE FUNCTION public.get_report_id_from_path(path text)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN path ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/' 
    THEN (regexp_match(path, '^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})'))[1]::uuid
    ELSE NULL
  END;
$$;

-- Function to handle file uploads
CREATE OR REPLACE FUNCTION public.handle_storage_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_report_file_upload ON storage.objects;
CREATE TRIGGER on_report_file_upload
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_storage_update();