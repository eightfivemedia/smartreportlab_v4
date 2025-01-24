-- Drop existing function if it exists
DROP FUNCTION IF EXISTS auth.update_user_profile;

-- Create or replace the function to update user profile with correct parameter order
CREATE OR REPLACE FUNCTION auth.update_user_profile(
  company_name text DEFAULT NULL,
  phone_number text DEFAULT NULL
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