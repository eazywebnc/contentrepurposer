'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Crown } from 'lucide-react'
import Link from 'next/link'

const tiers = [
  {
    name: 'Creator',
    price: '$19',
    period: '/month',
    description: 'Perfect for solo creators and bloggers.',
    features: [
      '30 content repurposes/month',
      '5 platforms',
      'Twitter, LinkedIn, Instagram',
      'Basic brand voice',
      'Copy & download outputs',
      'Email support',
    ],
    cta: 'Start free trial',
    popular: false,
    icon: null,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For serious creators maximizing their reach.',
    features: [
      '100 content repurposes/month',
      'All 50+ platforms',
      'Video & podcast transcription',
      'Custom brand voice training',
      'Scheduling & publishing',
      'Per-platform analytics',
      'Template library',
      'Priority support',
    ],
    cta: 'Start free trial',
    popular: true,
    icon: Zap,
  },
  {
    name: 'Agency',
    price: '$49',
    period: '/month',
    description: 'For agencies managing multiple clients.',
    features: [
      'Unlimited repurposes',
      'Unlimited platforms',
      'Multi-client workspace',
      'White-label outputs',
      'API access',
      'Bulk processing',
      'Advanced analytics',
      'Dedicated account manager',
    ],
    cta: 'Start free trial',
    popular: false,
    icon: Crown,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple{' '}
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            14-day free trial on all plans. No credit card required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                tier.popular
                  ? 'border-2 border-pink-500/50 bg-gradient-to-b from-pink-500/10 to-transparent shadow-xl shadow-pink-500/10 scale-[1.02]'
                  : 'border border-white/10 bg-white/[2%] hover:bg-white/[3%] hover:border-pink-500/15'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-xs font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Most popular
                </div>
              )}

              <div className="mb-6">
                {tier.icon && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center mb-3 shadow-lg shadow-pink-500/20">
                    <tier.icon className="w-4.5 h-4.5 text-white" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                <p className="text-sm text-zinc-500">{tier.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-white">{tier.price}</span>
                <span className="text-zinc-500 text-sm ml-1">{tier.period}</span>
              </div>

              <Link
                href="/auth/login"
                className={`block w-full text-center py-3 rounded-xl font-medium text-sm transition-all mb-8 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 shadow-lg shadow-pink-500/25'
                    : 'border border-white/10 text-zinc-300 hover:bg-white/5 hover:border-pink-500/20'
                }`}
              >
                {tier.cta}
              </Link>

              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.popular ? 'text-pink-400' : 'text-fuchsia-500'}`} />
                    <span className="text-zinc-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
