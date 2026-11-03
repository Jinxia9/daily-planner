import { createContext } from "react"
import type { Session, User } from "@supabase/supabase-js"

export interface SignUpResult {
  requiresEmailConfirmation: boolean
}

export interface AuthContextValue {
  isLoading: boolean
  isConfigured: boolean
  session: Session | null
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (
    email: string,
    password: string
  ) => Promise<SignUpResult>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
