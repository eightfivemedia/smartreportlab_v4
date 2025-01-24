/*
  # Fix RLS policies for clients table

  1. Changes
    - Drop all existing policies to start fresh
    - Create comprehensive RLS policies for all operations
    - Ensure proper user isolation through auth.uid()

  2. Security
    - Enable RLS on clients table
    - Add policies for SELECT, INSERT, UPDATE operations
    - Ensure users can only access their own data
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can create clients" ON clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON clients;

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies
CREATE POLICY "Users can view their own clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);