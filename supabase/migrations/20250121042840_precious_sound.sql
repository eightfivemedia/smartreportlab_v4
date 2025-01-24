-- Add new columns if they don't exist
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS company text;

-- Create or replace the function to update user profile
CREATE OR REPLACE FUNCTION auth.update_user_profile(
  phone_number text DEFAULT NULL,
  company_name text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  updated_user auth.users;
BEGIN
  -- Update the user profile
  UPDATE auth.users
  SET
    phone = COALESCE(phone_number, phone),
    company = COALESCE(company_name, company),
    updated_at = now()
  WHERE id = auth.uid()
  RETURNING * INTO updated_user;

  -- Return the updated profile as JSON
  RETURN json_build_object(
    'id', updated_user.id,
    'phone', updated_user.phone,
    'company', updated_user.company
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION auth.update_user_profile TO authenticated;