'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import {
  Sparkles,
  Share2,
  Rss,
  Mic2,
  Fingerprint,
  CalendarClock,
  BarChart3,
  LayoutTemplate,
} from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI Content Adaptation',
    description: 'Our AI understands context, tone, and platform norms. Every adaptation feels native — not copy-pasted.',
    gradient: 'from-pink-500 to-fuchsia-500',
    glow: 'bg-pink-500/20',
    span: 'md:col-span-2',
  },
  {
    icon: Share2,
    title: 'Multi-Platform Output',
    description: 'Twitter, LinkedIn, Instagram, TikTok, Facebook, YouTube, Pinterest, newsletters — all at once.',
    gradient: 'from-fuchsia-500 to-violet-500',
    glow: 'bg-fuchsia-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: Rss,
    title: 'Blog-to-Social Automation',
    description: 'Publish a blog post and watch it automatically become a week\'s worth of social content.',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'bg-violet-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: Mic2,
    title: 'Video & Podcast Transcription',
    description: 'Drop a YouTube link or audio file. We transcribe and repurpose it across every platform instantly.',
    gradient: 'from-pink-500 to-rose-500',
    glow: 'bg-pink-500/20',
    span: 'md:col-span-2',
  },
  {
    icon: Fingerprint,
    title: 'Brand Voice Consistency',
    description: 'Train the AI on your tone, vocabulary, and style. Every output sounds unmistakably like you.',
    gradient: 'from-fuchsia-500 to-pink-500',
    glow: 'bg-fuchsia-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: CalendarClock,
    title: 'Scheduling & Publishing',
    description: 'Schedule and publish directly to your platforms. Your content calendar fills itself.',
    gradient: 'from-violet-500 to-fuchsia-500',
    glow: 'bg-violet-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: BarChart3,
    title: 'Per-Platform Analytics',
    description: 'Track engagement, reach, and clicks for each platform separately. Know what converts where.',
    gradient: 'from-pink-500 to-fuchsia-500',
    glow: 'bg-pink-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: LayoutTemplate,
    title: 'Template Library',
    description: 'Proven templates for every content type and platform. Start from a winning format every time.',
    gradient: 'from-fuchsia-500 to-violet-500',
    glow: 'bg-fuchsia-500/20',
    span: 'md:col-span-1',
  },
]

export function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [20, -20])

  return (
    <section ref={ref} id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.12_0.06_340),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            One input,{' '}
            <span className="gradient-text">infinite outputs</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Everything you need to multiply your content reach without multiplying your workload.
          </p>
        </motion.div>

        <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className={`group relative p-6 rounded-2xl border border-white/5 bg-white/[2%] hover:bg-white/[4%] hover:border-pink-500/15 transition-all duration-300 overflow-hidden ${feature.span}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl ${feature.glow}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
