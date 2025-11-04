import type { Usuario } from './usuario.types'

// Cliente Type
export interface Cliente {
  id: string
  usuario_id: string
  cedula: string
  created_at: string
  updated_at: string
  usuario?: Usuario
}
