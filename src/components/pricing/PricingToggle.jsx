export function PricingToggle({ isYearly, onToggle }) {
  return (
    <div className="flex justify-center items-center gap-4 mb-12">
      <span className={`text-lg font-semibold ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
        Mensuel
      </span>
      <button
        onClick={onToggle}
        className={`w-14 h-8 rounded-full transition-colors ${
          isYearly ? 'bg-yellow-500' : 'bg-white'
        } relative`}
        type="button"
      >
        <div
          className={`w-6 h-6 bg-primary rounded-full absolute top-1 transition-transform ${
            isYearly ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-lg font-semibold ${isYearly ? 'text-white' : 'text-gray-400'}`}>
        Annuel
      </span>
      {isYearly && (
        <span className="bg-yellow-500 text-dark px-3 py-1 rounded-full text-sm font-bold">
          -20% de réduction
        </span>
      )}
    </div>
  )
}

