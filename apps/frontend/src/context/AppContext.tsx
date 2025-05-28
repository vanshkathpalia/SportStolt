// "use client"

import { createContext } from "react"

interface AppContextType {
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

export const AppContext = createContext<AppContextType | undefined>(undefined)
