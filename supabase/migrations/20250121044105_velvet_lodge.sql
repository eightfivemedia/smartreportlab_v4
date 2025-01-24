/*
  # Add policy for user profile data

  1. Changes
    - Add policy to allow authenticated users to update their own profile data
    - Add policy to allow authenticated users to read their own profile data
    - Add function to handle profile updates with proper validation
*/

-- Create policy for reading user profile data
CREATE POLICY "Users can read their own profile"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policy for updating user profile data
CREATE POLICY "Users can update their own profile"
  ON auth.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to validate phone number format
CREATE OR REPLACE FUNCTION auth.validate_phone_number(phone_number text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if phone number matches (xxx) xxx-xxxx format
  RETURN phone_number ~ '^\(\d{3}\)\s\d{3}-\d{4}$';
END;
$$;

-- Create function to update user profile with validation
CREATE OR REPLACE FUNCTION auth.update_user_profile_with_validation(
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
  -- Validate phone number if provided
  IF phone_number IS NOT NULL AND NOT auth.validate_phone_number(phone_number) THEN
    RAISE EXCEPTION 'Invalid phone number format. Must be (xxx) xxx-xxxx';
  END IF;

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
GRANT EXECUTE ON FUNCTION auth.update_user_profile_with_validation TO authenticated;