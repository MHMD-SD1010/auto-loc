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
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A5F 0%, #1E40AF 100%)',
        padding: '24px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>🚗</span>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: '24px',
            fontWeight: '700',
            margin: '0'
          }}>Auto-Loc</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Welcome card */}
        <div style={{
          background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#1E293B',
              margin: '0 0 8px 0'
            }}>Bonjour ! 👋</h2>
            <p style={{ color: '#64748B', margin: '0', fontSize: '15px' }}>
              Vous avez {reservations.length} réservation{reservations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => router.push('/voitures')}
            style={{
              background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
              color: '#FFFFFF',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '14px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(30, 64, 175, 0.3)',
              whiteSpace: 'nowrap'
            }}
          >
            + Nouvelle Réservation
          </button>
        </div>

        {/* Reservations list */}
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#1E293B',
          marginBottom: '20px'
        }}>Mes Réservations</h3>

        {reservations.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ color: '#64748B', fontSize: '16px', margin: '0' }}>
              Aucune réservation pour l'instant.
            </p>
          </div>
        ) : (
          reservations.map(r => (
            <div key={r.id} style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px 28px',
              marginBottom: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                  borderRadius: '12px',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px'
                }}>🚙</div>
                <div>
                  <p style={{
                    fontWeight: '700',
                    fontSize: '17px',
                    color: '#1E293B',
                    margin: '0 0 4px 0'
                  }}>
                    {r.voitures?.marque} {r.voitures?.modele}
                  </p>
                  <p style={{
                    color: '#64748B',
                    fontSize: '14px',
                    margin: '0'
                  }}>
                    📅 {r.date_debut} → {r.date_fin}
                  </p>
                </div>
              </div>
              <span style={{
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                background: r.statut === 'confirmée'
                  ? '#DCFCE7' : r.statut === 'annulée'
                  ? '#FEE2E2' : '#FEF3C7',
                color: r.statut === 'confirmée'
                  ? '#16A34A' : r.statut === 'annulée'
                  ? '#DC2626' : '#D97706'
              }}>
                {r.statut === 'confirmée' ? '✅ Confirmée'
                  : r.statut === 'annulée' ? '❌ Annulée'
                  : '⏳ En attente'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}