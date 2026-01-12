-- Drop all existing policies first
DROP POLICY IF EXISTS "Public can read published visualizations" ON visualizations;
DROP POLICY IF EXISTS "Admins and editors can manage visualizations" ON visualizations;
DROP POLICY IF EXISTS "Public can read collections" ON collections;
DROP POLICY IF EXISTS "Admins and editors can manage collections" ON collections;
DROP POLICY IF EXISTS "Public can read thumbs" ON storage.objects;
DROP POLICY IF EXISTS "Public can read social" ON storage.objects;
DROP POLICY IF EXISTS "Admins and editors can upload datasets" ON storage.objects;
DROP POLICY IF EXISTS "Admins and editors can upload thumbs" ON storage.objects;
DROP POLICY IF EXISTS "Admins and editors can upload social" ON storage.objects;

-- Recreate policies with JWT-based role checks (NO auth.users queries)

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
