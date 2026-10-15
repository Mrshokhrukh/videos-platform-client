/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '../lib/api'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const restore = async () => {
      try {
        const token = localStorage.getItem(api.AUTH_TOKEN_KEY)
        const savedRole = localStorage.getItem(api.AUTH_ROLE_KEY)
        if (token && savedRole) {
          const current = await api.getCurrentUser()
          if (mounted && current && current.role === savedRole) { setUser(current); setRole(current.role) }
          else { localStorage.removeItem(api.AUTH_TOKEN_KEY); localStorage.removeItem(api.AUTH_ROLE_KEY) }
        }
      } catch { localStorage.removeItem(api.AUTH_TOKEN_KEY); localStorage.removeItem(api.AUTH_ROLE_KEY) }
      finally { if (mounted) setLoading(false) }
    }
    restore()
    return () => { mounted = false }
  }, [])

  const value = useMemo(() => ({
    user, role, loading, isAuthenticated: user !== null,
    isAdmin: role === 'admin', isStudent: role === 'student',
    async login(email, password) {
      const result = await api.login(email, password)
      localStorage.setItem(api.AUTH_TOKEN_KEY, result.token)
      localStorage.setItem(api.AUTH_ROLE_KEY, result.role)
      setUser(result.user); setRole(result.role)
      return result
    },
    logout() {
      localStorage.removeItem(api.AUTH_TOKEN_KEY); localStorage.removeItem(api.AUTH_ROLE_KEY)
      setUser(null); setRole(null)
    },
  }), [user, role, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak')
  return value
}
