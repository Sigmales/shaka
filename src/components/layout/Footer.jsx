export function Footer() {
  return (
    <footer className="bg-dark text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-3xl">♞</span>
              SHAKA
            </h3>
            <p className="text-gray-300">Bet with the Knight of Virgo</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-300 mb-2">
              WhatsApp: <a href="https://wa.me/22659531517" className="text-secondary hover:underline">+226 59 53 15 17</a>
            </p>
            <p className="text-gray-300">Support client 24/7</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Paiement</h4>
            <p className="text-gray-300 mb-2">Orange Money: +226 75 18 56 71</p>
            <p className="text-gray-300">Moov Money: +226 53 59 15 17</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SHAKA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

