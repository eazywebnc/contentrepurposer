import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Ensure shared_users profile exists (cross-SaaS auth)
    const { data: existing } = await admin
      .from('shared_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existing) {
      const { error: insertError } = await admin.from('shared_users').upsert(
        {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
        },
        { onConflict: 'id' }
      )

      if (insertError) {
        console.error('Failed to create shared_users profile:', insertError)
        return NextResponse.json(
          { error: 'Erreur lors de la création du profil' },
          { status: 500 }
        )
      }
    }

    // Ensure cr_settings record exists for this app
    const { data: existingSettings } = await admin
      .from('cr_settings')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    if (!existingSettings) {
      await admin.from('cr_settings').upsert(
        {
          user_id: user.id,
          plan: 'free',
          generations_limit: 10,
        },
        { onConflict: 'user_id' }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ensure profile API error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
