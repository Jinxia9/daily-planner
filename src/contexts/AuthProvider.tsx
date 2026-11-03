import { useEffect, useMemo, useState, type ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"

import {
  AuthContext,
  type AuthContextValue,
  type SignUpResult,
} from "@/contexts/auth"
import { normalizeDataError } from "@/lib/errors"
import {
  isSupabaseConfigured,
  requireSupabase,
} from "@/lib/supabase"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return
    }

    const client = requireSupabase()
    let isMounted = true

    client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) {
          return
        }

        if (error) {
          setSession(null)
        } else {
          setSession(data.session)
        }
        setIsLoading(false)
      })
      .catch(() => {
        if (isMounted) {
          setSession(null)
          setIsLoading(false)
        }
      })

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setSession(nextSession)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const client = requireSupabase()
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        throw error
      }

      setSession(data.session)
    } catch (error) {
      throw normalizeDataError(
        error,
        "登录失败，请检查邮箱和密码。"
      )
    }
  }

  async function signUp(
    email: string,
    password: string
  ): Promise<SignUpResult> {
    try {
      const client = requireSupabase()
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) {
        throw error
      }

      if (data.session) {
        setSession(data.session)
      }

      return {
        requiresEmailConfirmation: data.session === null,
      }
    } catch (error) {
      throw normalizeDataError(
        error,
        "注册失败，请稍后重试。"
      )
    }
  }

  async function signOut() {
    try {
      const client = requireSupabase()
      const { error } = await client.auth.signOut()

      if (error) {
        throw error
      }

      setSession(null)
    } catch (error) {
      throw normalizeDataError(error, "退出登录失败。")
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isConfigured: isSupabaseConfigured,
      session,
      user: session?.user ?? null,
      signIn,
      signOut,
      signUp,
    }),
    [isLoading, session]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
