/*
  # Create projects table for NEPATRACK

  1. New Tables
    - `projects`
      - `id` (uuid, primary key) - Unique identifier for each project
      - `title` (text, required) - Project name
      - `description` (text) - Detailed project description
      - `location` (text, required) - Location/address in Nepal
      - `latitude` (numeric, required) - Latitude coordinate for map marker
      - `longitude` (numeric, required) - Longitude coordinate for map marker
      - `status` (text, required) - Project status (Planning, In Progress, Completed, On Hold)
      - `category` (text, required) - Project category (Infrastructure, Education, Healthcare, etc.)
      - `budget` (numeric) - Project budget in NPR
      - `start_date` (date) - Project start date
      - `end_date` (date) - Project expected/actual completion date
      - `contractor` (text) - Contracting organization/company
      - `funding_source` (text) - Source of funding
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `projects` table
    - Add policy for public read access (public data about government projects)
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  location text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  status text NOT NULL DEFAULT 'Planning',
  category text NOT NULL,
  budget numeric,
  start_date date,
  end_date date,
  contractor text,
  funding_source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects
  FOR SELECT
  TO anon, authenticated
  USING (true);