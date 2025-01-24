/*
  # Fix file extension in storage trigger

  1. Changes
    - Update handle_storage_update function to use exact storage path without modifications
*/

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_report_file_upload ON storage.objects;

-- Create improved trigger function that uses exact path
CREATE OR REPLACE FUNCTION public.handle_storage_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  report_id uuid;
  file_url text;
BEGIN
  -- Only process files in the report-files bucket
  IF NEW.bucket_id = 'report-files' THEN
    -- Extract report ID from path
    report_id := get_report_id_from_path(NEW.name);
    
    IF report_id IS NOT NULL THEN
      -- Use the exact path from storage without modifications
      file_url := format('https://%s.supabase.co/storage/v1/object/public/%s/%s',
        current_database(),
        NEW.bucket_id,
        NEW.name
      );
      
      -- Update the report
      UPDATE reports
      SET 
        status = 'completed',
        file_url = file_url,
        updated_at = NOW()
      WHERE id = report_id;
      
      RETURN NEW;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_report_file_upload
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_storage_update();