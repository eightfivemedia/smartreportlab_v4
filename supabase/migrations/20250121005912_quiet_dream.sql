/*
  # Fix storage trigger function

  1. Changes
    - Add storage.download_url function
    - Update handle_storage_update trigger function to use proper URL construction
*/

-- Create function to generate download URLs
CREATE OR REPLACE FUNCTION storage.download_url(bucket text, path text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  project_ref text;
BEGIN
  -- Get project ref from current database name
  project_ref := current_database();
  
  -- Return the constructed URL
  RETURN format('https://%s.supabase.co/storage/v1/object/public/%s/%s',
    project_ref,
    bucket,
    path
  );
END;
$$;

-- Update the handle_storage_update function to use proper URL construction
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