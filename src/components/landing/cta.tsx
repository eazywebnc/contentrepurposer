'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-fuchsia-600 to-violet-700" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(1_0_0_/_15%),transparent_60%)]" />
          <div className="absolute inset-0 grid-bg opacity-40" />

          {/* Floating orbs inside card */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/90 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              14-day free trial
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Stop writing from scratch. Start multiplying.
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
              Join 10,000+ creators who turn one blog post into a week of content.
              Set up in 2 minutes, no credit card required.
            </p>

            <Link
              href="/auth/login"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-pink-600 font-semibold text-lg hover:bg-white/90 transition-colors shadow-2xl"
            >
              Get started free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
