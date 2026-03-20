import { atom } from "jotai"

export interface User {
  name: string
  email: string
  picture: string
  sub: string
  role?: string // "student" | "staff" | "admin"
}

// Holds the logged-in user's info
export const userAtom = atom<User | null>(null)

// Auth loading state for showing spinners
export const authLoadingAtom = atom<boolean>(false)

// Token state
export const tokenAtom = atom<string | null>(null)
