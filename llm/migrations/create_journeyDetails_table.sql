-- Migration: create_journeyDetails_table
-- Run this in your Supabase SQL editor or via psql connected to your Supabase DB.

CREATE TABLE IF NOT EXISTS "journeyDetails" (
  journey_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  start_lat DOUBLE PRECISION,
  start_lng DOUBLE PRECISION,
  end_lat DOUBLE PRECISION,
  end_lng DOUBLE PRECISION,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optional: create an index to query by username
CREATE INDEX IF NOT EXISTS idx_journey_username ON "journeyDetails" (username);
