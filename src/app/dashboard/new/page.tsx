'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Hash,
  Briefcase,
  Camera,
  TrendingUp,
  Mail,
  Sparkles,
  Loader2,
  CheckSquare,
} from 'lucide-react'

const sourceTypes = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'video', label: 'Video Transcript' },
  { value: 'podcast', label: 'Podcast Transcript' },
  { value: 'text', label: 'Text / Notes' },
]

const platforms = [
  { value: 'twitter', label: 'Twitter / X', icon: Hash, color: 'sky' },
  { value: 'linkedin', label: 'LinkedIn', icon: Briefcase, color: 'blue' },
  { value: 'instagram', label: 'Instagram', icon: Camera, color: 'pink' },
  { value: 'tiktok', label: 'TikTok', icon: TrendingUp, color: 'fuchsia' },
  { value: 'newsletter', label: 'Newsletter', icon: Mail, color: 'violet' },
]

const platformColorMap: Record<string, { text: string; bg: string; border: string; ring: string }> = {
  sky: { text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', ring: 'ring-sky-500/40' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', ring: 'ring-blue-500/40' },
  pink: { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', ring: 'ring-pink-500/40' },
  fuchsia: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', ring: 'ring-fuchsia-500/40' },
  violet: { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', ring: 'ring-violet-500/40' },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export default function NewContentPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [sourceType, setSourceType] = useState('blog')
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const togglePlatform = (value: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    )
  }

  const selectAll = () => {
    if (selectedPlatforms.length === platforms.length) {
      setSelectedPlatforms([])
    } else {
      setSelectedPlatforms(platforms.map((p) => p.value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || selectedPlatforms.length === 0) {
      setError('Please fill in all fields and select at least one platform.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          source_type: sourceType,
          original_content: content.trim(),
          platforms: selectedPlatforms,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong')
      }

      const data = await res.json()
      router.push(`/dashboard/content/${data.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080305]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#080305]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
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
            <span className="text-sm font-bold text-white">New Content</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.form
          onSubmit={handleSubmit}
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Title */}
          <motion.div variants={item}>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How AI is changing marketing in 2026"
              className="w-full px-4 py-3 rounded-2xl bg-white/[2%] border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/40 transition-all"
            />
          </motion.div>

          {/* Source type */}
          <motion.div variants={item}>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Source Type</label>
            <div className="flex flex-wrap gap-2">
              {sourceTypes.map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setSourceType(st.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sourceType === st.value
                      ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/20'
                      : 'bg-white/[2%] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content textarea */}
          <motion.div variants={item}>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your blog post, transcript, or notes here..."
              rows={16}
              className="w-full px-4 py-3 rounded-2xl bg-white/[2%] border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/40 transition-all resize-y min-h-[200px]"
            />
          </motion.div>

          {/* Platforms */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-zinc-300">Target Platforms</label>
              <button
                type="button"
                onClick={selectAll}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-pink-400 transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                {selectedPlatforms.length === platforms.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map((p) => {
                const colors = platformColorMap[p.color]
                const selected = selectedPlatforms.includes(p.value)
                const Icon = p.icon
                return (
                  <motion.button
                    key={p.value}
                    type="button"
                    onClick={() => togglePlatform(p.value)}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all ${
                      selected
                        ? `${colors.bg} ${colors.border} ring-2 ${colors.ring}`
                        : 'bg-white/[2%] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        selected ? colors.bg : 'bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${selected ? colors.text : 'text-zinc-500'}`} />
                    </div>
                    <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-zinc-400'}`}>
                      {p.label}
                    </span>
                    {selected && (
                      <div className="absolute top-2 right-2">
                        <div className={`w-2 h-2 rounded-full ${colors.bg} ${colors.text}`}>
                          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        </div>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <motion.div variants={item} className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-medium text-sm flex items-center justify-center gap-2 hover:from-pink-600 hover:to-fuchsia-700 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Repurposing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Repurpose with AI
                </>
              )}
            </button>
          </motion.div>
        </motion.form>
      </main>
    </div>
  )
}
