/*
  # Set up authentication

  1. Security
    - Enable email auth
    - Add profile fields to auth.users
*/

-- Enable email auth method
CREATE EXTENSION IF NOT EXISTS citext;

-- Add profile fields to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS avatar_url text;