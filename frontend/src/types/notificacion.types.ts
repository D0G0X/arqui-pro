import type { Usuario } from './usuario.types'

// Notificación Type
export interface Notificacion {
  id: string
  mensaje: string
  fecha: string
  leido: boolean
  usuario_id: string
  created_at: string
  updated_at: string
  usuario?: Usuario
}
