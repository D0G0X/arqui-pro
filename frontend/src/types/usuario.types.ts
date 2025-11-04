// Usuario Base Type
export interface Usuario {
  id: string
  nombre: string
  apellido: string
  email: string
  rol: 'arquitecto' | 'cliente' | 'moderador'
  estado_cuenta: 'activa' | 'suspendida' | 'baneada'
  foto_perfil: string | null
  created_at: string
  updated_at: string
}

// Auth Types
export interface LoginInput {
  email: string
  password: string
}

export interface RegistroUsuarioInput {
  nombre: string
  apellido: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  usuario: Usuario
  token: string
}

export interface AuthState {
  usuario: Usuario | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}
