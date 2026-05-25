import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export interface User {
  name: string
  email: string
  picture: string
  sub: string
  role?: string // "student" | "staff" | "admin"
}

// Holds the logged-in user's info
export const userAtom = atomWithStorage<User | null>("user", null)

// Auth loading state for showing spinners
export const authLoadingAtom = atom<boolean>(false)
export const semPlanDrawerOpen = atom<boolean>(false)

// Months mapping for semester planning (January = 1 ... December = 12)
export const monthsAtom = atom(
  [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ] as { name: string; value: number }[]
)

// Shared DraftedActivity type for semester plan
export type DraftedActivity = {
  id: string
  activityName: string
  month: number
  tokensEach: number
}

// Drafts and selection atoms for semester plan UI
export const draftedActivitiesAtom = atom<DraftedActivity[]>([])
export const selectedActivityAtom = atom<string>("")
// selectedMonthAtom stores numeric month value (1-12) or null when not selected
export const selectedMonthAtom = atom<number | null>(null)
export const savedPlanAtom = atom<DraftedActivity[] | null>(null)

// Access token atom for authenticated API requests
export const accessTokenAtom = atomWithStorage<string | null>("accessToken", null)