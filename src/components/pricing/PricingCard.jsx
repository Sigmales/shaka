import { Link } from 'react-router-dom'

export function PricingCard({ plan, isYearly }) {
  const price = isYearly ? plan.price.yearly : plan.price.monthly
  const savings = plan.price.monthly * 12 - plan.price.yearly

  return (
    <div
      className={`card relative ${
        plan.highlighted ? 'ring-4 ring-yellow-500 transform scale-105' : ''
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="badge-vip">{plan.badge}</span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
        <div className="text-5xl font-bold text-primary mb-2">
          {price}
          <span className="text-2xl"> CFA</span>
        </div>
        {plan.price.monthly > 0 && (
          <p className="text-gray-600">
            {isYearly ? 'par an' : 'par mois'}
          </p>
        )}
        {isYearly && plan.price.yearly > 0 && (
          <p className="text-green-600 font-semibold text-sm mt-1">
            Économisez {savings} CFA
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        to={plan.buttonLink}
        className={`w-full block text-center ${
          plan.highlighted ? 'btn-primary' : 'btn-secondary'
        }`}
      >
        {plan.buttonText}
      </Link>
    </div>
  )
}

