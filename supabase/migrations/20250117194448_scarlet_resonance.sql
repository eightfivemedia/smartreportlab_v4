/*
  # Update clients table and RLS policies

  1. Changes
    - Add foreign key constraint to auth.users
    - Add trigger for updated_at timestamp
    - Update existing RLS policies to use proper user_id checks

  2. Security
    - Ensure proper user isolation through RLS
    - Add automatic timestamp management
*/

-- Add foreign key constraint if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_user' 
    AND table_name = 'clients'
  ) THEN
    ALTER TABLE clients
      ADD CONSTRAINT fk_user
      FOREIGN KEY (user_id)
      REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_clients_updated_at'
    AND event_object_table = 'clients'
  ) THEN
    CREATE TRIGGER update_clients_updated_at
      BEFORE UPDATE ON clients
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Drop existing policies and recreate them with proper conditions
DROP POLICY IF EXISTS "Users can create clients" ON clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON clients;

-- Create new policies (keeping the existing select policy)
CREATE POLICY "Users can create clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());