import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: contents, error } = await supabase
      .from('cr_contents')
      .select('id, title, source_type, created_at, cr_outputs(id)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch contents:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des contenus' },
        { status: 500 }
      )
    }

    // Map to include output_count instead of full outputs array
    const result = (contents ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      source_type: c.source_type,
      created_at: c.created_at,
      output_count: Array.isArray(c.cr_outputs) ? c.cr_outputs.length : 0,
    }))

    return NextResponse.json({ contents: result })
  } catch (error) {
    console.error('Contents list API error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
