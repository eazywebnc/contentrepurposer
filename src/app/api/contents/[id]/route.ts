import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: content, error } = await supabase
      .from('cr_contents')
      .select('*, cr_outputs(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !content) {
      return NextResponse.json({ error: 'Contenu introuvable' }, { status: 404 })
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Content GET API error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Verify ownership before deleting
    const { data: content } = await supabase
      .from('cr_contents')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!content) {
      return NextResponse.json({ error: 'Contenu introuvable' }, { status: 404 })
    }

    // Delete outputs first (foreign key constraint)
    await supabase.from('cr_outputs').delete().eq('content_id', id)

    // Delete the content
    const { error: deleteError } = await supabase
      .from('cr_contents')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Failed to delete content:', deleteError)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Content DELETE API error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
