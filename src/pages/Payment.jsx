import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { PaymentInstructions } from '../components/payment/PaymentInstructions'
import { PaymentProofUpload } from '../components/payment/PaymentProofUpload'

const prices = {
  standard: { monthly: 750, yearly: 7200 },
  vip: { monthly: 1500, yearly: 14400 }
}

const paymentNumbers = {
  orange_money: '+22675185671',
  moov_money: '+22653591517'
}

export default function Payment() {
  const [searchParams] = useSearchParams()
  const plan = searchParams.get('plan')
  const { user } = useAuth()
  const navigate = useNavigate()

  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [paymentMethod, setPaymentMethod] = useState('orange_money')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!plan || !['standard', 'vip'].includes(plan)) {
      navigate('/pricing')
    }
  }, [user, plan, navigate])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!screenshot) {
      alert('Veuillez télécharger une capture d\'écran')
      return
    }

    setUploading(true)

    try {
      const fileExt = screenshot.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, screenshot)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName)

      const screenshotUrl = publicUrlData.publicUrl

      const { error: insertError } = await supabase
        .from('payment_proofs')
        .insert([{
          user_id: user.id,
          subscription_type: plan,
          billing_period: billingPeriod,
          amount: prices[plan][billingPeriod],
          payment_method: paymentMethod,
          phone_number: phoneNumber,
          screenshot_url: screenshotUrl,
          status: 'pending'
        }])

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 3000)
    } catch (error) {
      alert(`Erreur lors de l'envoi : ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Paiement Envoyé !</h2>
          <p className="text-gray-600 mb-4">
            Votre preuve de paiement a été envoyée avec succès. 
            Un administrateur va la vérifier sous peu.
          </p>
          <p className="text-sm text-gray-500">
            Vous serez notifié par email une fois le paiement validé.
          </p>
        </div>
      </div>
    )
  }

  const amountDue = plan ? prices[plan][billingPeriod] : 0

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Paiement - Plan {plan?.toUpperCase()}
        </h1>

        <div className="card">
          {/* Price Display */}
          <div className="bg-primary text-white p-6 rounded-lg mb-6 text-center">
            <p className="text-lg mb-2">Montant à payer</p>
            <p className="text-5xl font-bold">
              {amountDue} <span className="text-2xl">CFA</span>
            </p>
            <p className="text-sm mt-2">
              {billingPeriod === 'yearly' && '(Économie de 20%)'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Billing Period */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                Période de facturation
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                    billingPeriod === 'monthly'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  Mensuel
                  <div className="text-sm mt-1">{prices[plan]?.monthly} CFA/mois</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingPeriod('yearly')}
                  className={`p-4 rounded-lg border-2 font-semibold transition-all relative ${
                    billingPeriod === 'yearly'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs px-2 py-1 rounded-full text-dark font-bold">
                    -20%
                  </span>
                  Annuel
                  <div className="text-sm mt-1">{prices[plan]?.yearly} CFA/an</div>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                Méthode de paiement
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('orange_money')}
                  className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                    paymentMethod === 'orange_money'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-orange-500'
                  }`}
                >
                  Orange Money
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('moov_money')}
                  className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                    paymentMethod === 'moov_money'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  Moov Money
                </button>
              </div>
            </div>

            {/* Payment Instructions */}
            <PaymentInstructions amount={amountDue} paymentNumber={paymentNumbers[paymentMethod]} />

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Votre numéro de téléphone (utilisé pour le paiement)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+226 XX XX XX XX"
                required
              />
            </div>

            {/* Screenshot Upload */}
            <PaymentProofUpload onFileSelect={setScreenshot} selectedFile={screenshot} />

            <button
              type="submit"
              disabled={uploading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Envoi en cours...' : 'Valider le Paiement'}
            </button>
          </form>

          {/* Support */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Besoin d'aide ?</p>
            <a
              href="https://wa.me/22659531517"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-bold hover:underline"
            >
              📱 Contactez-nous sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

