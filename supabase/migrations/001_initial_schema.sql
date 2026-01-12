-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Visualizations table
CREATE TABLE visualizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  collection_ids UUID[] DEFAULT '{}',
  sources TEXT[] DEFAULT '{}',
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  chart_spec JSONB NOT NULL,
  dataset_file TEXT,
  thumbnail_file TEXT,
  social_image_file TEXT,
  embed_version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Collections table
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  visualization_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_visualizations_slug ON visualizations(slug);
CREATE INDEX idx_visualizations_status ON visualizations(status);
CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_visualizations_tags ON visualizations USING GIN(tags);
CREATE INDEX idx_visualizations_collection_ids ON visualizations USING GIN(collection_ids);

-- RLS Policies
ALTER TABLE visualizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Public can read published visualizations (no auth required)
CREATE POLICY "Public can read published visualizations"
  ON visualizations FOR SELECT
  USING (status = 'published');

-- Public can read all collections (no auth required)
CREATE POLICY "Public can read collections"
  ON collections FOR SELECT
  USING (true);

-- Admins and editors can manage visualizations
CREATE POLICY "Admins and editors can manage visualizations"
  ON visualizations FOR ALL
  USING (
    auth.uid() IS NOT NULL
    AND (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'editor')
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'editor')
  );

-- Admins and editors can manage collections
CREATE POLICY "Admins and editors can manage collections"
  ON collections FOR ALL
  USING (
    auth.uid() IS NOT NULL
    AND (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'editor')
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'editor')
  );

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('datasets', 'datasets', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbs', 'thumbs', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('social', 'social', true);

-- Storage policies
-- Public can read thumbs (no auth required)
CREATE POLICY "Public can read thumbs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thumbs');

-- Public can read social (no auth required)
CREATE POLICY "Public can read social"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'social');

-- Admins and editors can upload datasets
CREATE POLICY "Admins and editors can upload datasets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'datasets'
    AND auth.uid() IS NOT NULL
    AND (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'editor')
  );

-- Admins and editors can upload thumbs
CREATE POLICY "Admins and editors can upload thumbs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'thumbs'
    AND auth.uid() IS NOT NULL
    AND (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'editor')
  );

-- Admins and editors can upload social
CREATE POLICY "Admins and editors can upload social"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'social'
    AND auth.uid() IS NOT NULL
    AND (auth.jwt()->'user_metadata'->>'role') IN ('admin', 'editor')
  );
