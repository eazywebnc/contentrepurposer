'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, FileText, Hash, Briefcase, Camera, TrendingUp, Clock, BarChart3 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ---- Platform output cards ---- */
const platforms = [
  {
    id: 'twitter',
    icon: Hash,
    label: 'Twitter Thread',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    content: '🧵 Thread: 5 reasons why content repurposing 10x your reach...\n\n1/ Most creators write a blog post and post it once. Big mistake.\n\n2/ The same content can reach 7 different audiences...',
    delay: 0,
  },
  {
    id: 'linkedin',
    icon: Briefcase,
    label: 'LinkedIn Post',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    content: 'I spent 3 hours writing this blog post.\n\nThen AI helped me turn it into 7 platform-specific posts in 30 seconds.\n\nHere\'s what I learned about content leverage...',
    delay: 0.15,
  },
  {
    id: 'instagram',
    icon: Camera,
    label: 'Instagram Caption',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    content: 'One piece of content. Every platform. ✨\n\nStop writing from scratch every single time. Work smarter, not harder.\n\n#ContentCreator #AITools #Marketing',
    delay: 0.3,
  },
  {
    id: 'tiktok',
    icon: TrendingUp,
    label: 'TikTok Script',
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/20',
    content: '[Hook] Stop writing new content every day!\n\n[Point 1] Your best blog post deserves to be seen everywhere.\n\n[CTA] Comment "REPURPOSE" for my free template...',
    delay: 0.45,
  },
]

function ContentTransformMockup() {
  const [activeOutput, setActiveOutput] = useState(0)
  const [isTransforming, setIsTransforming] = useState(false)

  useEffect(() => {
    const cycle = () => {
      setIsTransforming(true)
      setTimeout(() => {
        setActiveOutput(prev => (prev + 1) % platforms.length)
        setIsTransforming(false)
      }, 600)
    }
    const interval = setInterval(cycle, 3200)
    return () => clearInterval(interval)
  }, [])

  const current = platforms[activeOutput]

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Outer glow */}
      <div className="absolute -inset-8 bg-gradient-to-r from-pink-500/8 via-fuchsia-500/8 to-violet-500/8 rounded-3xl blur-3xl" />

      <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_40px_1fr] gap-3 items-start">
        {/* Input — Blog post */}
        <div className="rounded-2xl border border-pink-500/20 bg-black/40 backdrop-blur-xl overflow-hidden glow-pink">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <FileText className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-medium text-white/70">Source Content</span>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[9px] font-medium">Blog Post</span>
          </div>
          <div className="p-4 space-y-2">
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/8 rounded w-5/6" />
            <div className="h-3 bg-white/6 rounded w-4/5" />
            <div className="h-2 bg-transparent rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/8 rounded w-3/4" />
            <div className="h-2 bg-transparent rounded w-full" />
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Content repurposing is the practice of taking existing content and adapting it for different platforms. It saves time, extends reach, and maximizes the value of every piece you create...
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[9px]">732 words</span>
              <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-400 text-[9px]">Ready</span>
            </div>
          </div>
        </div>

        {/* Arrow / transform indicator */}
        <div className="flex flex-col items-center justify-center gap-2 py-8 sm:py-0 sm:self-center">
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-pink-500/30"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
          <div className="w-px h-8 bg-gradient-to-b from-pink-500/40 to-transparent hidden sm:block" />
        </div>

        {/* Output — Platform card */}
        <div className="rounded-2xl border border-fuchsia-500/20 bg-black/40 backdrop-blur-xl overflow-hidden">
          {/* Platform tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5 bg-white/[0.02] overflow-x-auto">
            {platforms.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveOutput(i)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all shrink-0 ${
                  i === activeOutput
                    ? `${p.bg} ${p.color} border ${p.border}`
                    : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                <p.icon className="w-3 h-3" />
                {p.label.split(' ')[0]}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: isTransforming ? 0 : 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.4 }}
              className="p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-6 h-6 rounded-lg ${current.bg} flex items-center justify-center`}>
                  <current.icon className={`w-3.5 h-3.5 ${current.color}`} />
                </div>
                <span className={`text-xs font-semibold ${current.color}`}>{current.label}</span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-auto px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[9px] font-medium"
                >
                  Generated
                </motion.span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed whitespace-pre-line line-clamp-5">
                {current.content}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button className="px-3 py-1 rounded-lg bg-pink-500/10 text-pink-400 text-[10px] font-medium hover:bg-pink-500/20 transition-colors">
                  Copy
                </button>
                <button className="px-3 py-1 rounded-lg bg-white/5 text-zinc-400 text-[10px] font-medium hover:bg-white/8 transition-colors">
                  Schedule
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.to(textRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-pink-500/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 left-1/2 w-[400px] h-[400px] bg-violet-500/4 rounded-full blur-[100px]" />
      </div>
      <div className="absolute inset-0 grid-bg" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        {/* Text block */}
        <div ref={textRef} className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            AI-powered content repurposing
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            {['One', 'content', 'piece.'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="inline-block mr-[0.3em] text-foreground"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <span className="gradient-text">
              {Array.from('Every platform.').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, delay: 0.42 + i * 0.03 }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            Paste a blog post, video transcript, or podcast episode.
            Get Twitter threads, LinkedIn posts, Instagram captions, TikTok scripts,
            and newsletters — instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href="/auth/login"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-semibold text-lg hover:from-pink-600 hover:to-fuchsia-700 transition-all shadow-2xl shadow-pink-500/25 hover:shadow-pink-500/40 flex items-center gap-2"
            >
              Start repurposing free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-2xl border border-white/10 text-zinc-300 font-medium text-lg hover:bg-white/5 transition-colors"
            >
              See how it works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-8 justify-center"
          >
            {[
              { icon: BarChart3, label: 'Posts created', value: '10M+', color: 'text-pink-400' },
              { icon: Sparkles, label: 'Platforms supported', value: '50+', color: 'text-fuchsia-400' },
              { icon: Clock, label: 'Time saved', value: '80%', color: 'text-violet-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center">
                <div className={`inline-flex items-center gap-1.5 ${color} mb-0.5`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xl font-bold">{value}</span>
                </div>
                <p className="text-xs text-zinc-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Interactive mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="w-full mt-16"
        >
          <ContentTransformMockup />
        </motion.div>
      </div>
    </section>
  )
}
