import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const VALID_SOURCE_TYPES = ['blog', 'video', 'podcast', 'text'] as const
const VALID_PLATFORMS = ['twitter', 'linkedin', 'instagram', 'tiktok', 'newsletter'] as const

type SourceType = (typeof VALID_SOURCE_TYPES)[number]
type Platform = (typeof VALID_PLATFORMS)[number]

interface RepurposeRequest {
  title: string
  sourceContent: string
  sourceType: SourceType
  platforms: Platform[]
}

function buildPrompt(sourceContent: string, sourceType: string, platforms: string[]): string {
  const platformInstructions: Record<string, string> = {
    twitter: `"twitter": A thread format using numbered tweets (1/ 2/ 3/ ...). Each tweet MUST be 280 characters max. Start with an engaging hook. End with relevant hashtags. Aim for 4-8 tweets.`,
    linkedin: `"linkedin": Professional tone with storytelling. Use bullet points for key takeaways. Include a clear CTA at the end. Max 1300 characters total. No hashtags in the body, add 3-5 at the very end.`,
    instagram: `"instagram": Casual, relatable tone. Use emojis generously. Max 2200 characters. End with a block of 20-30 relevant hashtags separated from the main text by line breaks.`,
    tiktok: `"tiktok": A video script for ~60 seconds. Start with a strong hook in the first 3 seconds. Use [VISUAL CUE] brackets for on-screen directions. Include transitions. End with a CTA.`,
    newsletter: `"newsletter": Email-friendly format with a personal, conversational tone. Use clear section headers (##). Include a greeting, 2-3 main sections, key takeaways, and a CTA. Keep it scannable.`,
  }

  const selectedInstructions = platforms
    .map((p) => platformInstructions[p])
    .filter(Boolean)
    .join('\n\n')

  return `You are an expert content strategist and copywriter. Your task is to repurpose the following ${sourceType} content into adapted versions for specific platforms.

SOURCE CONTENT:
---
${sourceContent}
---

Generate adapted content for each of the following platforms. Follow the specific guidelines for each:

${selectedInstructions}

IMPORTANT RULES:
- Maintain the core message and key insights from the source
- Adapt the tone, length, and format to each platform's best practices
- Make each version feel native to its platform, not just a copy-paste
- Be creative with hooks and CTAs
- Output ONLY valid JSON, no markdown code fences, no extra text

Return your response as a JSON object with platform names as keys and the adapted content as string values. Example format:
{
  "twitter": "1/ First tweet...\\n\\n2/ Second tweet...",
  "linkedin": "Full linkedin post..."
}

Return ONLY the JSON object, nothing else.`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body: RepurposeRequest = await request.json()
    const { title, sourceContent, sourceType, platforms } = body

    // Validate inputs
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 })
    }

    if (!sourceContent || typeof sourceContent !== 'string' || sourceContent.trim().length === 0) {
      return NextResponse.json({ error: 'Le contenu source est requis' }, { status: 400 })
    }

    if (!VALID_SOURCE_TYPES.includes(sourceType as SourceType)) {
      return NextResponse.json(
        { error: `Type de source invalide. Valeurs acceptées: ${VALID_SOURCE_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Au moins une plateforme est requise' },
        { status: 400 }
      )
    }

    const invalidPlatforms = platforms.filter((p) => !VALID_PLATFORMS.includes(p as Platform))
    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        { error: `Plateformes invalides: ${invalidPlatforms.join(', ')}. Valeurs acceptées: ${VALID_PLATFORMS.join(', ')}` },
        { status: 400 }
      )
    }

    // Call Google Gemini API
    const prompt = buildPrompt(sourceContent, sourceType, platforms)

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errBody = await geminiResponse.text()
      console.error('Gemini API error:', geminiResponse.status, errBody)
      return NextResponse.json(
        { error: 'Erreur lors de la génération du contenu IA' },
        { status: 502 }
      )
    }

    const geminiData = await geminiResponse.json()

    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) {
      console.error('Gemini returned no content:', JSON.stringify(geminiData))
      return NextResponse.json(
        { error: 'Aucun contenu généré par l\'IA' },
        { status: 502 }
      )
    }

    // Parse AI response — strip markdown fences if present
    let adaptedContents: Record<string, string>
    try {
      const cleaned = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      adaptedContents = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse Gemini JSON response:', rawText)
      return NextResponse.json(
        { error: 'Erreur lors du traitement de la réponse IA' },
        { status: 502 }
      )
    }

    // Insert source content into cr_contents
    const { data: content, error: insertContentError } = await supabase
      .from('cr_contents')
      .insert({
        user_id: user.id,
        title: title.trim(),
        source_type: sourceType,
        original_content: sourceContent,
      })
      .select('id')
      .single()

    if (insertContentError || !content) {
      console.error('Failed to insert content:', insertContentError)
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde du contenu' },
        { status: 500 }
      )
    }

    // Insert each output into cr_outputs
    const outputs: { platform: string; adapted_content: string }[] = []

    const outputRows = platforms
      .filter((platform) => adaptedContents[platform])
      .map((platform) => ({
        content_id: content.id,
        platform,
        adapted_content: adaptedContents[platform],
        status: 'draft' as const,
      }))

    if (outputRows.length > 0) {
      const { data: insertedOutputs, error: insertOutputError } = await supabase
        .from('cr_outputs')
        .insert(outputRows)
        .select('platform, adapted_content')

      if (insertOutputError) {
        console.error('Failed to insert outputs:', insertOutputError)
        // Content was saved, but outputs failed — still return partial success
        return NextResponse.json(
          {
            contentId: content.id,
            outputs: [],
            warning: 'Le contenu a été sauvegardé mais certaines sorties n\'ont pas pu être enregistrées',
          },
          { status: 207 }
        )
      }

      if (insertedOutputs) {
        outputs.push(...insertedOutputs)
      }
    }

    return NextResponse.json({
      contentId: content.id,
      outputs,
    })
  } catch (error) {
    console.error('Repurpose API error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
