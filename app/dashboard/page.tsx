'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [reservations, setReservations] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase
        .from('reservations')
        .select('*, voitures(marque, modele)')
        .order('created_at', { ascending: false })
      setReservations(data || [])
    }
    load()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mon Tableau de Bord</h1>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline"
        >
          Déconnexion
        </button>
      </div>
      <p className="text-gray-500 mb-6">Connecté : {user?.email}</p>
      <h2 className="text-lg font-semibold mb-4">Mes Réservations</h2>
      {reservations.length === 0 && (
        <p className="text-gray-400">Aucune réservation pour l'instant.</p>
      )}
      {reservations.map(r => (
        <div
          key={r.id}
          className="bg-white rounded-xl shadow p-5 mb-4 flex justify-between items-center"
        >
          <div>
            <p className="font-bold">
              {r.voitures?.marque} {r.voitures?.modele}
            </p>
            <p className="text-sm text-gray-500">
              {r.date_debut} → {r.date_fin}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${r.statut === 'confirmée'
              ? 'bg-green-100 text-green-700'
              : r.statut === 'annulée'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
            }`}>
            {r.statut}
          </span>
        </div>
      ))}
      <button
        onClick={() => router.push('/voitures')}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        + Nouvelle Réservation
      </button>
    </div>
  )
}