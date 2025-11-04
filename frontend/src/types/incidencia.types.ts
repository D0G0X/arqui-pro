import type { Usuario } from './usuario.types'
import type { Moderador } from './moderador.types'

// Incidencia Type
export interface Incidencia {
  id: string
  descripcion: string
  estado: 'pendiente' | 'resuelto' | 'en revision'
  usuario_emisor_id: string
  usuario_infractor_id: string
  moderador_id: string | null
  created_at: string
  updated_at: string
  usuario_emisor?: Usuario
  usuario_infractor?: Usuario
  moderador?: Moderador
}
