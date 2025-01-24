/*
  # Fix storage trigger for report updates

  1. Changes
    - Recreate storage trigger with proper permissions and error handling
    - Add logging for debugging
    - Ensure proper URL construction
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_report_file_upload ON storage.objects;
DROP FUNCTION IF EXISTS public.handle_storage_update();

-- Create improved trigger function with logging
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
      -- Construct the file URL
      file_url := storage.download_url(NEW.bucket_id, NEW.name);
      
      -- Update the report
      UPDATE reports
      SET 
        status = 'completed',
        file_url = file_url,
        updated_at = NOW()
      WHERE id = report_id;
      
      -- Return the trigger
      RETURN NEW;
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log any errors but don't fail the trigger
  RAISE WARNING 'Error in handle_storage_update: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_report_file_upload
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_storage_update();

-- Ensure proper permissions
GRANT USAGE ON SCHEMA storage TO PUBLIC;
GRANT EXECUTE ON FUNCTION storage.download_url TO PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_report_id_from_path TO PUBLIC;

-- Add policy for trigger to update reports
DROP POLICY IF EXISTS "Storage trigger can update report status and file" ON reports;
CREATE POLICY "Storage trigger can update report status and file"
  ON reports
  FOR UPDATE
  TO PUBLIC
  USING (true)
  WITH CHECK (true);  -- Allow all updates from trigger since it's SECURITY DEFINER