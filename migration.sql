-- ContentRepurposer Database Schema
-- Table prefix: cr_
-- Run this in your Supabase SQL editor

-- ============================================================
-- cr_settings: Per-user configuration
-- ============================================================
CREATE TABLE IF NOT EXISTS cr_settings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_voice text,
  default_platforms text[] DEFAULT ARRAY['twitter','linkedin','instagram'],
  plan        text NOT NULL DEFAULT 'creator',
  monthly_quota int NOT NULL DEFAULT 30,
  repurposes_used int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE cr_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own settings"
  ON cr_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- cr_contents: Source content pieces
-- ============================================================
CREATE TABLE IF NOT EXISTS cr_contents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           text,
  source_type     text NOT NULL CHECK (source_type IN ('blog', 'video', 'podcast', 'text', 'url')),
  source_content  text,
  source_url      text,
  word_count      int,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cr_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own contents"
  ON cr_contents FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS cr_contents_user_id_idx ON cr_contents(user_id);

-- ============================================================
-- cr_outputs: Generated platform-specific content
-- ============================================================
CREATE TABLE IF NOT EXISTS cr_outputs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id       uuid NOT NULL REFERENCES cr_contents(id) ON DELETE CASCADE,
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform         text NOT NULL,
  adapted_content  text NOT NULL,
  status           text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'failed')),
  published_at     timestamptz,
  engagement       jsonb,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cr_outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own outputs"
  ON cr_outputs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS cr_outputs_content_id_idx ON cr_outputs(content_id);
CREATE INDEX IF NOT EXISTS cr_outputs_user_id_idx ON cr_outputs(user_id);
CREATE INDEX IF NOT EXISTS cr_outputs_platform_idx ON cr_outputs(platform);

-- ============================================================
-- cr_templates: User prompt templates per platform
-- ============================================================
CREATE TABLE IF NOT EXISTS cr_templates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            text NOT NULL,
  platform        text NOT NULL,
  prompt_template text NOT NULL,
  is_default      boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cr_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own templates"
  ON cr_templates FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS cr_templates_user_id_idx ON cr_templates(user_id);
CREATE INDEX IF NOT EXISTS cr_templates_platform_idx ON cr_templates(platform);

-- ============================================================
-- Auto-updated timestamps trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_cr_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cr_settings_updated_at
  BEFORE UPDATE ON cr_settings
  FOR EACH ROW EXECUTE FUNCTION update_cr_updated_at();

CREATE TRIGGER cr_contents_updated_at
  BEFORE UPDATE ON cr_contents
  FOR EACH ROW EXECUTE FUNCTION update_cr_updated_at();

CREATE TRIGGER cr_outputs_updated_at
  BEFORE UPDATE ON cr_outputs
  FOR EACH ROW EXECUTE FUNCTION update_cr_updated_at();

CREATE TRIGGER cr_templates_updated_at
  BEFORE UPDATE ON cr_templates
  FOR EACH ROW EXECUTE FUNCTION update_cr_updated_at();
