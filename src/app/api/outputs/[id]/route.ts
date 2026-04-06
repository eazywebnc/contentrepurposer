import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
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

    const body = await request.json()
    const updateData: Record<string, string> = {}

    if (typeof body.adapted_content === 'string') {
      updateData.adapted_content = body.adapted_content
    }

    if (typeof body.status === 'string') {
      const validStatuses = ['draft', 'published', 'scheduled', 'archived']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: `Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.status = body.status
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Aucun champ à mettre à jour (adapted_content ou status)' },
        { status: 400 }
      )
    }

    // Verify the output belongs to the user via the content relationship
    const { data: output } = await supabase
      .from('cr_outputs')
      .select('id, content_id, cr_contents!inner(user_id)')
      .eq('id', id)
      .single()

    if (!output) {
      return NextResponse.json({ error: 'Sortie introuvable' }, { status: 404 })
    }

    const contentRow = output.cr_contents as unknown as { user_id: string }
    if (contentRow.user_id !== user.id) {
      return NextResponse.json({ error: 'Sortie introuvable' }, { status: 404 })
    }

    const { data: updated, error: updateError } = await supabase
      .from('cr_outputs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update output:', updateError)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      )
    }

    return NextResponse.json({ output: updated })
  } catch (error) {
    console.error('Output PATCH API error:', error)
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

    // Verify ownership via content relationship
    const { data: output } = await supabase
      .from('cr_outputs')
      .select('id, cr_contents!inner(user_id)')
      .eq('id', id)
      .single()

    if (!output) {
      return NextResponse.json({ error: 'Sortie introuvable' }, { status: 404 })
    }

    const contentRow = output.cr_contents as unknown as { user_id: string }
    if (contentRow.user_id !== user.id) {
      return NextResponse.json({ error: 'Sortie introuvable' }, { status: 404 })
    }

    const { error: deleteError } = await supabase
      .from('cr_outputs')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Failed to delete output:', deleteError)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Output DELETE API error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
