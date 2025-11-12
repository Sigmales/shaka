import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { PricingCard } from '../components/pricing/PricingCard'
import { PricingToggle } from '../components/pricing/PricingToggle'
import { PromoCodeBanner } from '../components/pricing/PromoCodeBanner'

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const { user } = useAuth()

  const plans = [
    {
      name: 'Gratuit',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Aperçu des matchs du jour',
        'Accès limité aux pronostics',
        'Publicité présente'
      ],
      buttonText: 'Essayer',
      buttonLink: user ? '/dashboard' : '/register',
      highlighted: false
    },
    {
      name: 'Standard',
      price: { monthly: 750, yearly: 7200 },
      features: [
        'Tous les matchs du jour',
        'Pronostics standard',
        'Statistiques de base',
        'Historique 7 jours',
        'Support standard'
      ],
      buttonText: 'Choisir ce plan',
      buttonLink: user ? '/payment?plan=standard' : '/register',
      highlighted: false
    },
    {
      name: 'VIP',
      price: { monthly: 1500, yearly: 14400 },
      badge: 'POPULAIRE',
      features: [
        'Accès complet illimité',
        '🔥 Pronostics VIP premium',
        'Statistiques avancées',
        'Support prioritaire',
        'Historique illimité',
        'Notifications prioritaires',
        'Badge VIP exclusif'
      ],
      buttonText: 'Choisir ce plan',
      buttonLink: user ? '/payment?plan=vip' : '/register',
      highlighted: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-dark py-20">
      <div className="container mx-auto px-4">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Choisissez Votre Plan</h1>
          <p className="text-xl text-gray-200">Des tarifs adaptés à tous les parieurs</p>
        </div>

        {/* Code Promo Banner */}
        <div className="max-w-2xl mx-auto mb-12">
          <PromoCodeBanner />
        </div>

        {/* Toggle Mensuel/Annuel */}
        <PricingToggle isYearly={isYearly} onToggle={() => setIsYearly(!isYearly)} />

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} isYearly={isYearly} />
          ))}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-16 text-white">
          <p className="text-lg mb-4">Besoin d'aide pour choisir ?</p>
          <a
            href="https://wa.me/22659531517"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
          >
            <span className="text-2xl">📱</span>
            Contactez-nous sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

