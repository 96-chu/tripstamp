import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type Profile = {
  id: string
  email: string
  username: string | null
  auth_provider: string | null
  onboarding_completed: boolean
}

type AuthContextValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  refreshProfile: (userId?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, username, auth_provider, onboarding_completed')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data ?? null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)

  async function refreshProfile(userId?: string) {
    const targetId = userId ?? session?.user?.id

    if (!targetId) {
      setProfile(null)
      return
    }

    try {
      const nextProfile = await fetchProfile(targetId)
      setProfile(nextProfile)
    } catch {
      setProfile(null)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
    setIsAuthModalOpen(false)
  }

  useEffect(() => {
    let isMounted = true

    async function init() {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return

      const nextSession = data.session ?? null
      setSession(nextSession)

      if (nextSession?.user?.id) {
        try {
          const nextProfile = await fetchProfile(nextSession.user.id)
          if (!isMounted) return
          setProfile(nextProfile)
        } catch {
          if (!isMounted) return
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)

      if (nextSession?.user?.id) {
        try {
          const nextProfile = await fetchProfile(nextSession.user.id)
          setProfile(nextProfile)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => {
      isMounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    return {
      session,
      user: session?.user ?? null,
      profile,
      isLoading,
      isAuthModalOpen,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false),
      refreshProfile,
      signOut,
    }
  }, [session, profile, isLoading, isAuthModalOpen])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}