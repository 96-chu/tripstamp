import React, { useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../auth/AuthProvider'

type Step = 'welcome' | 'email' | 'otp' | 'username' | 'success'

type Props = {
  open: boolean
  onClose: () => void
}

function overlayStyle(): React.CSSProperties {
  return {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(2, 6, 23, 0.34)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    pointerEvents: 'auto',
    zIndex: 100,
  }
}

function panelStyle(): React.CSSProperties {
  return {
    width: 'min(560px, calc(100vw - 32px))',
    borderRadius: 28,
    border: '1px solid rgba(148, 163, 184, 0.22)',
    background: 'linear-gradient(180deg, rgba(12, 25, 53, 0.78), rgba(9, 20, 44, 0.72))',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    boxShadow: '0 24px 80px rgba(2, 8, 23, 0.45)',
    padding: 28,
    color: '#fff',
  }
}

function inputStyle(): React.CSSProperties {
  return {
    width: '100%',
    height: 56,
    borderRadius: 16,
    border: '1px solid rgba(148, 163, 184, 0.2)',
    background: 'rgba(2, 6, 23, 0.26)',
    color: '#fff',
    padding: '0 16px',
    fontSize: 18,
    outline: 'none',
    boxSizing: 'border-box',
  }
}

function primaryButtonStyle(disabled?: boolean): React.CSSProperties {
  return {
    width: '100%',
    height: 58,
    borderRadius: 16,
    border: '1px solid rgba(96, 165, 250, 0.4)',
    background: disabled ? 'rgba(59, 130, 246, 0.22)' : 'rgba(59, 130, 246, 0.42)',
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }
}

function secondaryButtonStyle(disabled?: boolean): React.CSSProperties {
  return {
    width: '100%',
    height: 56,
    borderRadius: 16,
    border: '1px solid rgba(148, 163, 184, 0.18)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }
}

function otpGridStyle(): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
    gap: 10,
    marginTop: 12,
  }
}

export function AuthModal({ open, onClose }: Props) {
  const { user, refreshProfile } = useAuth()

  const [step, setStep] = useState<Step>('welcome')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email])
  const tokenValid = useMemo(() => token.trim().length === 6, [token])
  const usernameValid = useMemo(() => username.trim().length >= 3, [username])

  if (!open) return null

  async function continueWithGoogle() {
    setIsLoading(true)
    setError(null)

    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    setIsLoading(false)

    if (err) {
      setError(err.message)
    }
  }

  async function sendOtp() {
    if (!emailValid) return

    setIsLoading(true)
    setError(null)

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    setIsLoading(false)

    if (err) {
      setError(err.message)
      return
    }

    setStep('otp')
  }

  async function verifyOtp() {
    if (!tokenValid) return

    setIsLoading(true)
    setError(null)

    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    setIsLoading(false)

    if (err) {
      setError(err.message)
      return
    }

    const { data } = await supabase.auth.getUser()
    const currentUser = data.user

    if (!currentUser) {
      setError('Unable to load your account after verification.')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', currentUser.id)
      .maybeSingle()

    if (!profile?.username) {
      setStep('username')
      return
    }

    await refreshProfile(currentUser.id)
    setStep('success')
    window.setTimeout(() => {
      onClose()
      setStep('welcome')
      setToken('')
      setError(null)
    }, 700)
  }

  async function saveUsername() {
    if (!usernameValid) return

    setIsLoading(true)
    setError(null)

    const { data } = await supabase.auth.getUser()
    const currentUser = data.user ?? user

    if (!currentUser) {
      setIsLoading(false)
      setError('User session not found.')
      return
    }

    const provider =
      currentUser.app_metadata?.provider ??
      currentUser.app_metadata?.providers?.[0] ??
      'email'

    const payload = {
      id: currentUser.id,
      email: currentUser.email ?? email,
      username: username.trim(),
      auth_provider: provider,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    }

    const { error: err } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })

    setIsLoading(false)

    if (err) {
      setError(err.message)
      return
    }

    await refreshProfile(currentUser.id)
    setStep('success')

    window.setTimeout(() => {
      onClose()
      setStep('welcome')
      setEmail('')
      setToken('')
      setUsername('')
      setError(null)
    }, 700)
  }

  function renderWelcome() {
    return (
      <>
        <button
          onClick={continueWithGoogle}
          disabled={isLoading}
          style={primaryButtonStyle(isLoading)}
        >
          {isLoading ? 'Connecting…' : 'Continue with Google'}
        </button>

        <div
          style={{
            margin: '22px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: 'rgba(255,255,255,0.52)',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.14)' }} />
          <span>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.14)' }} />
        </div>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          style={inputStyle()}
        />

        <button
          onClick={sendOtp}
          disabled={!emailValid || isLoading}
          style={{ ...primaryButtonStyle(!emailValid || isLoading), marginTop: 16 }}
        >
          {isLoading ? 'Sending code…' : 'Send code'}
        </button>

        <div style={{ marginTop: 16, fontSize: 14, color: 'rgba(255,255,255,0.64)' }}>
          We’ll send a one-time code to your email.
        </div>
      </>
    )
  }

  function renderOtp() {
    const cells = token.padEnd(6, ' ').slice(0, 6).split('')

    return (
      <>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', marginBottom: 8 }}>
          Enter the verification code sent to {email}.
        </div>

        <input
          value={token}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, '').slice(0, 6)
            setToken(next)
          }}
          placeholder="6-digit code"
          inputMode="numeric"
          maxLength={6}
          style={{ ...inputStyle(), position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        />

        <div style={otpGridStyle()}>
          {cells.map((char, index) => (
            <button
              key={index}
              onClick={() => {
                const el = document.getElementById('tripstamp-otp-hidden-input')
                el?.focus()
              }}
              style={{
                height: 56,
                borderRadius: 12,
                border: '1px solid rgba(148,163,184,0.22)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: 24,
                fontWeight: 700,
                cursor: 'text',
              }}
            >
              {char.trim()}
            </button>
          ))}
        </div>

        <input
          id="tripstamp-otp-hidden-input"
          value={token}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, '').slice(0, 6)
            setToken(next)
          }}
          inputMode="numeric"
          maxLength={6}
          style={{
            width: 1,
            height: 1,
            opacity: 0,
            position: 'absolute',
            pointerEvents: 'none',
          }}
        />

        <button
          onClick={verifyOtp}
          disabled={!tokenValid || isLoading}
          style={{ ...primaryButtonStyle(!tokenValid || isLoading), marginTop: 18 }}
        >
          {isLoading ? 'Verifying…' : 'Verify and continue'}
        </button>

        <button
          onClick={sendOtp}
          disabled={isLoading}
          style={{ ...secondaryButtonStyle(isLoading), marginTop: 12 }}
        >
          Resend code
        </button>
      </>
    )
  }

  function renderUsername() {
    return (
      <>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', marginBottom: 16 }}>
          Choose your TripStamp username.
        </div>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={inputStyle()}
        />

        <button
          onClick={saveUsername}
          disabled={!usernameValid || isLoading}
          style={{ ...primaryButtonStyle(!usernameValid || isLoading), marginTop: 16 }}
        >
          {isLoading ? 'Saving…' : 'Continue'}
        </button>
      </>
    )
  }

  function renderSuccess() {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Welcome to TripStamp</div>
        <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.72)' }}>
          Your journey is ready.
        </div>
      </div>
    )
  }

  return (
    <div style={overlayStyle()} onClick={onClose}>
      <div style={panelStyle()} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>
              {step === 'otp'
                ? 'Enter verification code'
                : step === 'username'
                  ? 'Choose your username'
                  : 'Sign in to TripStamp'}
            </div>

            {step === 'welcome' && (
              <div style={{ marginTop: 8, fontSize: 15, color: 'rgba(255,255,255,0.72)' }}>
                Save places, routes, photos, and memories to your personal travel map.
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              borderRadius: 12,
              border: 'none',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              lineHeight: 1,
              fontSize: 30,
              padding: 0
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginTop: 24 }}>
          {step === 'welcome' && renderWelcome()}
          {step === 'otp' && renderOtp()}
          {step === 'username' && renderUsername()}
          {step === 'success' && renderSuccess()}

          {error ? (
            <div
              style={{
                marginTop: 16,
                borderRadius: 12,
                padding: '12px 14px',
                background: 'rgba(127, 29, 29, 0.35)',
                border: '1px solid rgba(248, 113, 113, 0.25)',
                color: '#fecaca',
                fontSize: 14,
              }}
            >
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}