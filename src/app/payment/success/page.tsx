import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 text-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Paiement Réussi !</h1>
        <p className="text-gray-600 mb-8">
          Votre paiement a été traité avec succès. Votre réservation est maintenant confirmée.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Vous pouvez fermer cette page et retourner sur l'application Koup.
        </p>
      </div>
    </div>
  );
}
