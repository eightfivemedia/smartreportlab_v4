-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload report files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read report files" ON storage.objects;
DROP POLICY IF EXISTS "Service role can access all report files" ON storage.objects;

-- Create policies with explicit table references
CREATE POLICY "Users can upload report files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'report-files' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can read report files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'report-files' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Service role can access all report files"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'report-files')
  WITH CHECK (bucket_id = 'report-files');

-- Update handle_storage_update function to preserve file extensions
CREATE OR REPLACE FUNCTION public.handle_storage_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  report_id uuid;
  storage_url text;
BEGIN
  -- Only process files in the report-files bucket
  IF NEW.bucket_id = 'report-files' THEN
    -- Extract report ID from path
    report_id := get_report_id_from_path(NEW.name);
    
    IF report_id IS NOT NULL THEN
      -- Use the exact path from storage including file extension
      storage_url := format('https://%s.supabase.co/storage/v1/object/public/%s/%s',
        current_database(),
        NEW.bucket_id,
        NEW.name
      );
      
      -- Update the report with explicit table reference
      UPDATE public.reports
      SET 
        status = 'completed',
        file_url = storage_url,
        updated_at = NOW()
      WHERE id = report_id;
      
      RETURN NEW;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;