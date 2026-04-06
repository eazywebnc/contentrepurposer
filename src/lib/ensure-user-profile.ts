import { createAdminClient } from '@/lib/supabase/server'

/**
 * Ensures the authenticated user has a cr_settings record.
 * Called on first dashboard access to support cross-SaaS login.
 */
export async function ensureUserProfile(userId: string) {
  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from('cr_settings')
    .select('user_id')
    .eq('user_id', userId)
    .single()

  if (existing) return

  await supabase.from('cr_settings').upsert(
    {
      user_id: userId,
      plan: 'free',
      generations_limit: 10,
    },
    { onConflict: 'user_id' }
  )
}
