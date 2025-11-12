export function PaymentInstructions({ amount, paymentNumber }) {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-6">
      <h3 className="font-bold text-lg mb-3 text-yellow-800">📋 Instructions de Paiement</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700">
        <li>Envoyez <strong>{amount} CFA</strong> au numéro :
          <div className="bg-white p-2 rounded mt-1 font-mono text-lg font-bold text-primary">
            {paymentNumber}
          </div>
        </li>
        <li>Prenez une capture d'écran de la confirmation</li>
        <li>Téléchargez la capture ci-dessous</li>
        <li>Validez votre paiement</li>
      </ol>
    </div>
  )
}

