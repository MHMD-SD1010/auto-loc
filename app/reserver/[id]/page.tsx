'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function ReserverPage() {
  const { id } = useParams()
  const router = useRouter()
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [permis, setPermis] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleReservation = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    let permis_url = null

    if (permis) {
      const filePath = `${user.id}/${Date.now()}_${permis.name}`
      const { data, error } = await supabase.storage
        .from('permis')
        .upload(filePath, permis)
      if (!error) {
        const { data: urlData } = supabase.storage
          .from('permis')
          .getPublicUrl(data.path)
        permis_url = urlData.publicUrl
      }
    }

    await supabase.from('reservations').insert({
      client_id: user.id,
      voiture_id: id,
      date_debut: dateDebut,
      date_fin: dateFin,
      permis_url
    })

    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-6">📅 Créer une Réservation</h1>
        <label className="block text-sm font-medium mb-1">Date de début</label>
        <input
          type="date"
          className="w-full border p-3 rounded-lg mb-3"
          value={dateDebut}
          onChange={e => setDateDebut(e.target.value)}
        />
        <label className="block text-sm font-medium mb-1">Date de fin</label>
        <input
          type="date"
          className="w-full border p-3 rounded-lg mb-3"
          value={dateFin}
          onChange={e => setDateFin(e.target.value)}
        />
        <label className="block text-sm font-medium mb-1">
          Photo du permis de conduire
        </label>
        <input
          type="file"
          accept="image/*,.pdf"
          className="w-full border p-3 rounded-lg mb-4"
          onChange={e => setPermis(e.target.files?.[0] || null)}
        />
        <button
          onClick={handleReservation}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          {loading ? 'En cours...' : 'Confirmer la Réservation'}
        </button>
      </div>
    </div>
  )
}