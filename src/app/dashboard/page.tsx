'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Sparkles,
  FileText,
  Share2,
  BarChart3,
  Clock,
  Plus,
  LogOut,
  Hash,
  Briefcase,
  Camera,
  TrendingUp,
  CheckCircle2,
  CircleDashed,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

interface Content {
  id: string
  title: string
  source_type: string
  created_at: string
}

interface Output {
  id: string
  content_id: string
  platform: string
  adapted_content: string
  status: string
  published_at: string | null
  created_at: string
}

const platformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'twitter': return <Hash className="w-3.5 h-3.5" />
    case 'linkedin': return <Briefcase className="w-3.5 h-3.5" />
    case 'instagram': return <Camera className="w-3.5 h-3.5" />
    case 'tiktok': return <TrendingUp className="w-3.5 h-3.5" />
    default: return <Share2 className="w-3.5 h-3.5" />
  }
}

const platformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'twitter': return 'text-sky-400 bg-sky-500/10 border-sky-500/20'
    case 'linkedin': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    case 'instagram': return 'text-pink-400 bg-pink-500/10 border-pink-500/20'
    case 'tiktok': return 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20'
    default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
  }
}

const sourceTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    blog: 'Blog Post',
    video: 'Video',
    podcast: 'Podcast',
    text: 'Text',
  }
  return map[type] || type
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [contents, setContents] = useState<Content[]>([])
  const [outputs, setOutputs] = useState<Output[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login'
        return
      }
      setUser({ email: user.email || '' })

      // Ensure settings exist
      const { data: existingSettings } = await supabase
        .from('cr_settings')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (!existingSettings) {
        await supabase.from('cr_settings').insert({ user_id: user.id })
      }

      // Fetch recent contents
      const { data: contentsData } = await supabase
        .from('cr_contents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setContents(contentsData || [])

      // Fetch outputs for those contents
      if (contentsData && contentsData.length > 0) {
        const ids = contentsData.map((c: Content) => c.id)
        const { data: outputsData } = await supabase
          .from('cr_outputs')
          .select('*')
          .in('content_id', ids)
          .order('created_at', { ascending: false })
          .limit(30)
        setOutputs(outputsData || [])
      }

      setLoading(false)
    }
    init()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Platform breakdown
  const platformCounts = outputs.reduce((acc: Record<string, number>, o) => {
    acc[o.platform] = (acc[o.platform] || 0) + 1
    return acc
  }, {})

  const publishedCount = outputs.filter(o => o.status === 'published').length
  const pendingCount = outputs.filter(o => o.status === 'draft' || o.status === 'pending').length

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080305] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080305]">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-[#080305]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center shadow-sm shadow-pink-500/20">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">ContentRepurposer</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500">{user?.email}</span>
            <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-white transition-colors" aria-label="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-zinc-500">Your content repurposing hub</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-sm font-medium flex items-center gap-2 hover:from-pink-600 hover:to-fuchsia-700 transition-all shadow-lg shadow-pink-500/20">
            <Plus className="w-4 h-4" /> New content
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FileText, label: 'Contents', value: String(contents.length), color: 'text-pink-400', bg: 'bg-pink-500/10' },
            { icon: Share2, label: 'Outputs Generated', value: String(outputs.length), color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
            { icon: CheckCircle2, label: 'Published', value: String(publishedCount), color: 'text-green-400', bg: 'bg-green-500/10' },
            { icon: CircleDashed, label: 'Drafts Pending', value: String(pendingCount), color: 'text-violet-400', bg: 'bg-violet-500/10' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="p-5 rounded-2xl border border-white/5 bg-white/[2%]">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-zinc-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent contents */}
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[2%] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Recent Content</h2>
              <FileText className="w-4 h-4 text-zinc-500" />
            </div>

            {contents.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Sparkles className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
                <p className="text-sm text-zinc-500 mb-2">No content yet</p>
                <p className="text-xs text-zinc-600">
                  Paste a blog post, video link, or podcast to start repurposing.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {contents.map((content) => {
                  const contentOutputs = outputs.filter(o => o.content_id === content.id)
                  return (
                    <div key={content.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[1%] transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-pink-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate font-medium">{content.title || 'Untitled'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-zinc-500">{sourceTypeLabel(content.source_type)}</span>
                          <span className="text-[10px] text-zinc-700">·</span>
                          <span className="text-[10px] text-zinc-500">{contentOutputs.length} outputs</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 shrink-0">
                        {contentOutputs.slice(0, 3).map((o) => (
                          <span key={o.id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${platformColor(o.platform)}`}>
                            {platformIcon(o.platform)}
                            {o.platform}
                          </span>
                        ))}
                        {contentOutputs.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-zinc-500 text-[10px]">
                            +{contentOutputs.length - 3}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-600 shrink-0">
                        {new Date(content.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Platform breakdown */}
          <div className="rounded-2xl border border-white/5 bg-white/[2%] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Outputs by Platform</h2>
              <BarChart3 className="w-4 h-4 text-zinc-500" />
            </div>

            {Object.keys(platformCounts).length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Share2 className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-xs text-zinc-500">No outputs yet</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {Object.entries(platformCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([platform, count]) => (
                    <div key={platform} className="flex items-center gap-3">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${platformColor(platform)} min-w-[90px]`}>
                        {platformIcon(platform)}
                        {platform}
                      </div>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500"
                          style={{ width: `${Math.min(100, (count / outputs.length) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 w-4 text-right">{count}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Usage stats */}
            <div className="px-6 py-4 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  Avg time saved
                </div>
                <span className="text-xs font-semibold text-green-400">
                  {contents.length > 0 ? `~${contents.length * 45} min` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Repurpose ratio
                </div>
                <span className="text-xs font-semibold text-fuchsia-400">
                  {contents.length > 0 ? `${(outputs.length / contents.length).toFixed(1)}x` : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
