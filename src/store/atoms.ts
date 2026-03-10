import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export interface User {
  id?: number
  name: string
  email?: string
  picture?: string
  sub?: string
  role?: string // "student" | "staff" | "admin"
  role_id?: number
  [key: string]: any
}

// Holds the logged-in user's info, persisted to localStorage
export const userAtom = atomWithStorage<User | null>("skillstack_user", null)

export const tokenAtom = atomWithStorage<string | null>("skillstack_token", null)

// Auth loading state for showing spinners
export const authLoadingAtom = atom<boolean>(false)
