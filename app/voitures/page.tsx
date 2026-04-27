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
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '8px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          Mon Dashboard
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '40px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1E293B',
          marginBottom: '8px'
        }}>Nos Véhicules Disponibles</h2>
        <p style={{
          color: '#64748B',
          marginBottom: '32px',
          fontSize: '16px'
        }}>Choisissez le véhicule qui vous convient</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {voitures.map(v => (
            <div key={v.id} style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              {/* Car image placeholder */}
              <div style={{
                background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                height: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px'
              }}>
                🚙
              </div>

              <div style={{ padding: '24px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1E293B',
                  margin: '0 0 4px 0'
                }}>{v.marque} {v.modele}</h3>
                <p style={{
                  color: '#64748B',
                  fontSize: '14px',
                  margin: '0 0 16px 0'
                }}>Année {v.annee}</p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                  <div>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#1E40AF'
                    }}>{v.prix_jour} DA</span>
                    <span style={{
                      color: '#64748B',
                      fontSize: '14px'
                    }}> / jour</span>
                  </div>
                  <span style={{
                    background: '#DCFCE7',
                    color: '#16A34A',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>Disponible</span>
                </div>

                <button
                  onClick={() => router.push(`/reserver/${v.id}`)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(30, 64, 175, 0.3)'
                  }}
                >
                  Réserver ce véhicule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}