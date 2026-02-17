import { createContext } from 'react'

interface User {
  id: string
  email: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAdmin: false,
  setIsAdmin: () => {}
})
