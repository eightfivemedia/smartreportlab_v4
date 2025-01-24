/*
  # Fix service role permissions for reports

  1. Changes
    - Drop existing policies
    - Add new service role policy for reports
    - Ensure Make.com can update reports through service role

  2. Security
    - Maintain proper access control
    - Allow service role full update access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Storage trigger can update report status and file" ON reports;
DROP POLICY IF EXISTS "Make.com can update report status and file" ON reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON reports;

-- Create new policy for service role
CREATE POLICY "Service role can update reports"
  ON reports
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);