'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    setError('')
    const { error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) setError(error.message)
    else router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1E3A5F 0%, #1E40AF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: '#FFFFFF',
        padding: '48px',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        width: '100%',
        maxWidth: '420px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '8px'
          }}>🚗</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1E293B',
            margin: '0'
          }}>Auto-Loc</h1>
          <p style={{
            color: '#64748B',
            fontSize: '14px',
            marginTop: '4px'
          }}>Location de véhicules en ligne</p>
        </div>

        {/* Inputs */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '6px'
          }}>Email</label>
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #E2E8F0',
              borderRadius: '12px',
              fontSize: '15px',
              color: '#1E293B',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '6px'
          }}>Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
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

        {/* Error */}
        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(30, 64, 175, 0.4)',
            marginBottom: '16px'
          }}
        >
          {isSignup ? "S'inscrire" : "Se connecter"}
        </button>

        {/* Toggle */}
        <p
          onClick={() => setIsSignup(!isSignup)}
          style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#3B82F6',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {isSignup ? "Déjà un compte ? Connexion" : "Pas de compte ? Inscription"}
        </p>
      </div>
    </div>
  )
}