'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Sparkles,
  Hash,
  Briefcase,
  Camera,
  TrendingUp,
  Mail,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Calendar,
  FileText,
} from 'lucide-react'

interface ContentRow {
  id: string
  title: string
  source_type: string
  original_content: string
  created_at: string
}

interface OutputRow {
  id: string
  content_id: string
  platform: string
  adapted_content: string
  status: string
  created_at: string
}

const platformMeta: Record<string, { icon: typeof Hash; color: string; textColor: string; bgColor: string; borderColor: string }> = {
  twitter: { icon: Hash, color: 'sky', textColor: 'text-sky-400', bgColor: 'bg-sky-500/10', borderColor: 'border-sky-500/20' },
  linkedin: { icon: Briefcase, color: 'blue', textColor: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  instagram: { icon: Camera, color: 'pink', textColor: 'text-pink-400', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/20' },
  tiktok: { icon: TrendingUp, color: 'fuchsia', textColor: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500/10', borderColor: 'border-fuchsia-500/20' },
  newsletter: { icon: Mail, color: 'violet', textColor: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/20' },
}

const sourceTypeLabel: Record<string, string> = {
  blog: 'Blog Post',
  video: 'Video Transcript',
  podcast: 'Podcast Transcript',
  text: 'Text / Notes',
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function ContentDetailPage() {
  const params = useParams()
  const contentId = params.id as string

  const [content, setContent] = useState<ContentRow | null>(null)
  const [outputs, setOutputs] = useState<OutputRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showOriginal, setShowOriginal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)
  const [editedOutputs, setEditedOutputs] = useState<Record<string, string>>({})

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchData = useCallback(async () => {
    const { data: contentData } = await supabase
      .from('cr_contents')
      .select('*')
      .eq('id', contentId)
      .single()

    if (contentData) {
      setContent(contentData)
    }

    const { data: outputsData } = await supabase
      .from('cr_outputs')
      .select('*')
      .eq('content_id', contentId)
      .order('created_at', { ascending: true })

    if (outputsData) {
      setOutputs(outputsData)
      const edits: Record<string, string> = {}
      outputsData.forEach((o: OutputRow) => {
        edits[o.id] = o.adapted_content
      })
      setEditedOutputs(edits)
    }

    setLoading(false)
  }, [contentId, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCopy = async (outputId: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(outputId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRegenerate = async (outputId: string) => {
    setRegeneratingId(outputId)
    try {
      const res = await fetch(`/api/repurpose/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ output_id: outputId }),
      })
      if (res.ok) {
        await fetchData()
      }
    } catch {
      // silently fail
    }
    setRegeneratingId(null)
  }

  const handleEditChange = (outputId: string, value: string) => {
    setEditedOutputs((prev) => ({ ...prev, [outputId]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080305] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#080305] flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500 text-sm">Content not found.</p>
        <Link
          href="/dashboard"
          className="text-pink-400 text-sm hover:text-pink-300 transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080305]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#080305]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center shadow-sm shadow-pink-500/20">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white truncate max-w-[300px]">
              {content.title}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* Meta info */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-medium">
              <FileText className="w-3 h-3" />
              {sourceTypeLabel[content.source_type] || content.source_type}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
              <Calendar className="w-3 h-3" />
              {new Date(content.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="text-xs text-zinc-600">
              {outputs.length} output{outputs.length !== 1 ? 's' : ''}
            </span>
          </motion.div>

          {/* Original content collapsible */}
          <motion.div variants={item} className="rounded-2xl border border-white/10 bg-white/[2%] overflow-hidden">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[1%] transition-colors"
            >
              <span className="text-sm font-medium text-zinc-300">Original Content</span>
              {showOriginal ? (
                <ChevronUp className="w-4 h-4 text-zinc-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              )}
            </button>
            {showOriginal && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="px-6 pb-5 border-t border-white/5"
              >
                <p className="text-sm text-zinc-400 whitespace-pre-wrap leading-relaxed pt-4 max-h-[400px] overflow-y-auto">
                  {content.original_content}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Output cards grid */}
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-4">Platform Outputs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outputs.map((output) => {
                const meta = platformMeta[output.platform.toLowerCase()] || platformMeta.twitter
                const Icon = meta.icon
                const charCount = (editedOutputs[output.id] || output.adapted_content).length

                return (
                  <motion.div
                    key={output.id}
                    variants={item}
                    className="rounded-2xl border border-white/10 bg-white/[2%] backdrop-blur-sm overflow-hidden flex flex-col"
                  >
                    {/* Card header */}
                    <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${meta.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${meta.textColor}`} />
                        </div>
                        <span className="text-sm font-medium text-white capitalize">{output.platform}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          output.status === 'published'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}
                      >
                        {output.status}
                      </span>
                    </div>

                    {/* Content area */}
                    <div className="p-5 flex-1">
                      <textarea
                        value={editedOutputs[output.id] ?? output.adapted_content}
                        onChange={(e) => handleEditChange(output.id, e.target.value)}
                        rows={6}
                        className="w-full bg-white/[3%] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-300 resize-y focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/30 transition-all"
                      />
                    </div>

                    {/* Card footer */}
                    <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-600">{charCount} chars</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRegenerate(output.id)}
                          disabled={regeneratingId === output.id}
                          className="p-2 rounded-lg text-zinc-500 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-all disabled:opacity-50"
                          title="Regenerate"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${regeneratingId === output.id ? 'animate-spin' : ''}`}
                          />
                        </button>
                        <button
                          onClick={() =>
                            handleCopy(output.id, editedOutputs[output.id] ?? output.adapted_content)
                          }
                          className="p-2 rounded-lg text-zinc-500 hover:text-pink-400 hover:bg-pink-500/10 transition-all"
                          title="Copy to clipboard"
                        >
                          {copiedId === output.id ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {outputs.length === 0 && (
            <motion.div variants={item} className="text-center py-16">
              <Sparkles className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
              <p className="text-sm text-zinc-500">No outputs generated yet.</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
