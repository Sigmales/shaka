export function PaymentProofUpload({ onFileSelect, selectedFile }) {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-semibold mb-2">
        Capture d'écran de la transaction
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFileSelect(e.target.files[0])}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      {selectedFile && (
        <p className="text-sm text-green-600 mt-2">
          ✓ Fichier sélectionné : {selectedFile.name}
        </p>
      )}
    </div>
  )
}

