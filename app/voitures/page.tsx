'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function VoituresPage() {
  const [voitures, setVoitures] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    supabase
      .from('voitures')
      .select('*')
      .then(({ data }) => setVoitures(data || []))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nos Véhicules Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {voitures.map(v => (
          <div key={v.id} className="bg-white rounded-2xl shadow p-5">
            {v.image_url && (
              <img
                src={v.image_url}
                className="rounded-xl mb-3 w-full h-40 object-cover"
              />
            )}
            <h2 className="font-bold text-lg">{v.marque} {v.modele}</h2>
            <p className="text-gray-500">{v.annee}</p>
            <p className="text-blue-600 font-semibold mt-2">
              {v.prix_jour} DA / jour
            </p>
            <button
              onClick={() => router.push(`/reserver/${v.id}`)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Réserver
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}