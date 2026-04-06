'use client'

import { motion } from 'framer-motion'
import { ClipboardPaste, LayoutGrid, Sparkles, SendHorizonal } from 'lucide-react'

const steps = [
  {
    icon: ClipboardPaste,
    title: 'Paste your content',
    description: 'Drop in a blog post URL, YouTube link, audio file, or paste text directly. Any format works.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    number: '01',
  },
  {
    icon: LayoutGrid,
    title: 'Select platforms',
    description: 'Choose which platforms you want to target. Twitter, LinkedIn, Instagram, TikTok — pick any combination.',
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/20',
    number: '02',
  },
  {
    icon: Sparkles,
    title: 'AI adapts the content',
    description: 'Our AI rewrites and formats your content for each platform\'s tone, character limits, and best practices.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    number: '03',
  },
  {
    icon: SendHorizonal,
    title: 'Publish everywhere',
    description: 'Review, edit if needed, then publish directly or schedule across all platforms in one click.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    number: '04',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/4 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            From one to <span className="gradient-text">many</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Four simple steps. Seconds to generate. A week's worth of content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[65%] w-[75%] h-px bg-gradient-to-r from-pink-500/20 to-transparent" />
              )}

              <div className={`w-16 h-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-4 relative`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <div className="text-xs text-zinc-600 font-mono mb-2">{step.number}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
