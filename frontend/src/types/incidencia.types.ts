import type { Usuario } from './usuario.types'
import type { Moderador } from './moderador.types'
import type { Imagen } from './imagen.types'

// Incidencia Type
export interface Incidencia {
  id: string
  descripcion: string
  estado: 'pendiente' | 'resuelto' | 'en revision'
  usuario_emisor_id: string
  usuario_infractor_id: string
  moderador_id: string | null
  usuario_emisor?: Usuario
  usuario_infractor?: Usuario
  moderador?: Moderador
  imagenes?: Imagen[]
}

export interface CreateIncidenciaDto{
  descripcion: string
  estado: 'pendiente' | 'resuelto' | 'en revision'
  usuario_emisor_id: string
  usuario_infractor_id: string
  moderador_id: string | null
}
