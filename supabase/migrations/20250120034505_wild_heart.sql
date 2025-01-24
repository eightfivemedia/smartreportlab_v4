/*
  # Add report name field

  1. Changes:
    - Adds name field to reports table
    - Makes name field required
*/

-- Add name column to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT 'Untitled Report';

-- Remove the default after adding the column
ALTER TABLE reports ALTER COLUMN name DROP DEFAULT;