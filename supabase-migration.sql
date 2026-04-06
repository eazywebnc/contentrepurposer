-- ContentRepurposer — Supabase Migration
-- Project ref: mgiamamqrvfcfqzlqtcs

-- cr_settings
CREATE TABLE IF NOT EXISTS cr_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'creator', 'pro', 'agency')),
  monthly_quota INTEGER DEFAULT 5,
  used_this_month INTEGER DEFAULT 0,
  brand_voice TEXT,
  default_platforms TEXT[] DEFAULT ARRAY['twitter', 'linkedin'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- cr_contents (source content)
CREATE TABLE IF NOT EXISTS cr_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('blog', 'video', 'podcast', 'text')),
  original_content TEXT NOT NULL,
  word_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- cr_outputs (AI-generated platform content)
CREATE TABLE IF NOT EXISTS cr_outputs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES cr_contents(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'instagram', 'tiktok', 'newsletter')),
  adapted_content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- cr_templates (user custom templates)
CREATE TABLE IF NOT EXISTS cr_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  name TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cr_contents_user ON cr_contents(user_id);
CREATE INDEX IF NOT EXISTS idx_cr_outputs_content ON cr_outputs(content_id);
CREATE INDEX IF NOT EXISTS idx_cr_settings_user ON cr_settings(user_id);

-- RLS
ALTER TABLE cr_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cr_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cr_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cr_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only access their own data
CREATE POLICY "Users manage own settings" ON cr_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own contents" ON cr_contents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own outputs" ON cr_outputs FOR ALL USING (
  content_id IN (SELECT id FROM cr_contents WHERE user_id = auth.uid())
);
CREATE POLICY "Users manage own templates" ON cr_templates FOR ALL USING (auth.uid() = user_id);
