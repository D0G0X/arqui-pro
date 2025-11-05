import type { Usuario } from './usuario.types'

// Moderador Type
export interface Moderador {
  id: string
  usuario_id: string
  num_incidencias_resueltas: number
  num_arquitectos_verificados: number
  usuario?: Usuario
}