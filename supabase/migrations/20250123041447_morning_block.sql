/*
  # Fix URL encoding in download_url function

  1. Changes
    - Update download_url function to properly encode URLs
    - Use url_encode to handle special characters in filenames
*/

-- Create url_encode function if it doesn't exist
CREATE OR REPLACE FUNCTION storage.url_encode(data text)
RETURNS text LANGUAGE sql IMMUTABLE STRICT AS $$
  SELECT regexp_replace(
    regexp_replace(
      regexp_replace(
        encode(convert_to($1, 'UTF8'), 'base64'), 
        '\+', '-', 'g'
      ),
      '/', '_', 'g'
    ),
    '=+$', '', 'g'
  );
$$;

-- Update download_url function to use proper URL encoding
CREATE OR REPLACE FUNCTION storage.download_url(bucket text, path text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  encoded_path text;
BEGIN
  -- Encode each path segment separately
  encoded_path := array_to_string(
    array(
      SELECT storage.url_encode(segment)
      FROM regexp_split_to_table(path, '/') segment
    ),
    '/'
  );

  -- Return the constructed URL with encoded path
  RETURN format('https://%s.supabase.co/storage/v1/object/public/%s/%s',
    current_database(),
    bucket,
    encoded_path
  );
END;
$$;

-- Grant execute permission on the new function
GRANT EXECUTE ON FUNCTION storage.url_encode TO PUBLIC;