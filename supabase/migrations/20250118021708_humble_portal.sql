/*
  # Add system configuration table

  1. New Tables
    - `system_config`
      - `key` (text, primary key)
      - `value` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `system_config` table
    - Add policy for authenticated users to read config
    - Add policy for admin users to manage config
*/

-- Create system_config table
CREATE TABLE IF NOT EXISTS system_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read config"
  ON system_config
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert webhook URL
INSERT INTO system_config (key, value)
VALUES ('make_webhook_url', 'https://hook.us1.make.com/u0pc4mfitexpm8knqhf717c3bwbbhvjg')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = now();