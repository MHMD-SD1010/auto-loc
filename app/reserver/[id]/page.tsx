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
        gap: '12px'
      }}>
        <span style={{ fontSize: '32px' }}>🚗</span>
        <h1 style={{
          color: '#FFFFFF',
          fontSize: '24px',
          fontWeight: '700',
          margin: '0'
        }}>Auto-Loc</h1>
      </div>

      {/* Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px'
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          padding: '48px',
          width: '100%',
          maxWidth: '480px'
        }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1E293B',
              margin: '0'
            }}>Créer une Réservation</h2>
            <p style={{
              color: '#64748B',
              fontSize: '14px',
              marginTop: '8px'
            }}>Remplissez les informations ci-dessous</p>
          </div>

          {/* Date début */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>📆 Date de début</label>
            <input
              type="date"
              value={dateDebut}
              onChange={e => setDateDebut(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E2E8F0',
                borderRadius: '12px',
                fontSize: '15px',
                color: '#1E293B',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Date fin */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>📆 Date de fin</label>
            <input
              type="date"
              value={dateFin}
              onChange={e => setDateFin(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E2E8F0',
                borderRadius: '12px',
                fontSize: '15px',
                color: '#1E293B',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Upload permis */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>🪪 Photo du permis de conduire</label>
            <div style={{
              border: '2px dashed #CBD5E1',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              background: '#F8FAFC'
            }}>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={e => setPermis(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
                id="permis-upload"
              />
              <label htmlFor="permis-upload" style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📎</div>
                <p style={{
                  color: '#3B82F6',
                  fontWeight: '600',
                  fontSize: '14px',
                  margin: '0'
                }}>
                  {permis ? permis.name : 'Cliquez pour choisir un fichier'}
                </p>
                {!permis && (
                  <p style={{
                    color: '#94A3B8',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    JPG, PNG ou PDF
                  </p>
                )}
              </label>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleReservation}
            disabled={loading || !dateDebut || !dateFin}
            style={{
              width: '100%',
              padding: '16px',
              background: loading || !dateDebut || !dateFin
                ? '#94A3B8'
                : 'linear-gradient(135deg, #059669, #10B981)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !dateDebut || !dateFin ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)'
            }}
          >
            {loading ? '⏳ En cours...' : '✅ Confirmer la Réservation'}
          </button>

          {/* Back */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => router.back()}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ← Retour au catalogue
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}