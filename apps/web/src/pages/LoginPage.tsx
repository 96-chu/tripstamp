import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type LocationState = {
  from?: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = useMemo(() => state.from ?? '/', [state.from]);

  async function sendOtp() {
    setIsLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Use email OTP; user enters code manually.
        shouldCreateUser: true,
      },
    });

    setIsLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setStep('otp');
  }

  async function verifyOtp() {
    setIsLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    setIsLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <div style={{ maxWidth: 420, margin: '64px auto', padding: 16 }}>
      <h1 style={{ margin: 0 }}>Sign in</h1>

      {step === 'email' && (
        <>
          <p style={{ opacity: 0.8 }}>We’ll email you a one-time code.</p>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            style={{ width: '100%', height: 44, padding: '0 12px', marginTop: 12 }}
          />

          <button
            onClick={sendOtp}
            disabled={!email || isLoading}
            style={{ width: '100%', height: 44, marginTop: 12 }}
          >
            {isLoading ? 'Sending…' : 'Continue'}
          </button>
        </>
      )}

      {step === 'otp' && (
        <>
          <p style={{ opacity: 0.8 }}>Enter the 6-digit code sent to {email}.</p>

          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="6-digit code"
            inputMode="numeric"
            style={{ width: '100%', height: 44, padding: '0 12px', marginTop: 12 }}
          />

          <button
            onClick={verifyOtp}
            disabled={!token || isLoading}
            style={{ width: '100%', height: 44, marginTop: 12 }}
          >
            {isLoading ? 'Verifying…' : 'Verify'}
          </button>

          <button
            onClick={() => setStep('email')}
            disabled={isLoading}
            style={{ width: '100%', height: 44, marginTop: 8 }}
          >
            Change email
          </button>
        </>
      )}

      {error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
    </div>
  );
}