import { createContext, useState, useEffect, useContext } from 'react'
import type { ReactNode } from 'react'
import { logger } from '../utils/logger'
import { USER_ROLES } from '../config/constants'

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: UserRole
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
        logger.info('Sesión restaurada desde localStorage')
      } catch (error) {
        logger.error('Error al parsear datos de usuario', error)
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
      
      // Simulación por ahora (password se usará en implementación real)
      logger.info('Intento de login', { email })
      void password // Evitar warning de variable no usada
      
      // Mock user
      const mockUser: User = {
        id: '123',
        email,
        nombre: 'Usuario',
        apellido: 'Demo',
        rol: USER_ROLES.CLIENTE
      }
      
      setUser(mockUser)
      localStorage.setItem('auth_token', 'mock-token')
      localStorage.setItem('user_data', JSON.stringify(mockUser))
      
      logger.info('Login exitoso', { userId: mockUser.id, rol: mockUser.rol })
      
    } catch (error) {
      logger.error('Error en login', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    logger.info('Cerrando sesión', { userId: user?.id })
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
      
      logger.info('Intento de registro', { email: userData.email })
      
    } catch (error) {
      logger.error('Error en registro', error)
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

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
