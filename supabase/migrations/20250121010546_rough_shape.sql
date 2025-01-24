/*
  # Add report status trigger

  1. Changes
    - Create trigger to update report status when file_url is set
    - Ensure status is set to 'completed' when file_url is updated
*/

-- Create trigger function to update status
CREATE OR REPLACE FUNCTION public.update_report_status()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- If file_url is being set and it's different from the old value
  IF NEW.file_url IS NOT NULL AND (OLD.file_url IS NULL OR NEW.file_url != OLD.file_url) THEN
    -- Set status to completed
    NEW.status = 'completed';
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS update_report_status_on_file_url ON reports;
CREATE TRIGGER update_report_status_on_file_url
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_report_status();