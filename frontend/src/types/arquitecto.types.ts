import type { Usuario } from './usuario.types'

// Arquitecto Type (matching actual Rails API response)
export interface Arquitecto {
  id: string
  cedula: string
  valoracion_prom_proyecto: number
  descripcion: string | null
  especialidades: string  // Rails returns as string, not array
  ubicacion: string | null
  verificado: boolean
  vistas_perfil: number
  // Optional relations (only if explicitly included by Rails)
  usuario_id?: string
  created_at?: string
  updated_at?: string
  usuario?: Usuario
}
