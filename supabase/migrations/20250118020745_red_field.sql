/*
  # Create reports table and webhook functionality

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `user_id` (uuid, references auth.users)
      - `status` (text) - 'pending', 'processing', 'completed', 'failed'
      - `file_url` (text) - URL to the generated PDF
      - `original_file_url` (text) - URL to the uploaded spreadsheet
      - `webhook_id` (text) - ID from Make.com webhook
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `error_message` (text, nullable)

  2. Security
    - Enable RLS on `reports` table
    - Add policies for authenticated users to manage their reports
*/

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  file_url text,
  original_file_url text NOT NULL,
  webhook_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  error_message text,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add reports_count trigger function
CREATE OR REPLACE FUNCTION update_client_reports_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE clients
    SET reports_count = reports_count + 1,
        last_report_date = NEW.created_at
    WHERE id = NEW.client_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for reports_count
CREATE TRIGGER update_client_reports_count_on_insert
  AFTER INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_client_reports_count();