import { createContext, ReactNode, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: 'cliente' | 'arquitecto' | 'moderador'
  foto_perfil?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: Partial<User>) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si hay sesión al cargar
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      // TODO: Implementar llamada real a API
      // const response = await authService.login(email, password)
      // setUser(response.user)
      // localStorage.setItem('auth_token', response.token)
      // localStorage.setItem('user_data', JSON.stringify(response.user))
      
      // Simulación por ahora
      console.log('Login attempt:', { email, password })
      
      // Mock user
      const mockUser: User = {
        id: '123',
        email,
        nombre: 'Usuario',
        apellido: 'Demo',
        rol: 'cliente'
      }
      
      setUser(mockUser)
      localStorage.setItem('auth_token', 'mock-token')
      localStorage.setItem('user_data', JSON.stringify(mockUser))
      
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  const register = async (userData: Partial<User>) => {
    try {
      setIsLoading(true)
      
      // TODO: Implementar llamada real a API
      // const response = await authService.register(userData)
      // setUser(response.user)
      // localStorage.setItem('auth_token', response.token)
      // localStorage.setItem('user_data', JSON.stringify(response.user))
      
      console.log('Register attempt:', userData)
      
    } catch (error) {
      console.error('Register error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
