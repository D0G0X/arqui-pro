import type { Conversacion } from './conversacion.types'
import type { Usuario } from './usuario.types'

// Mensaje Type
export interface Mensaje {
  id: string
  contenido: string
  fecha_envio: string
  leido: boolean
  remitente_id: string
  conversacion_id: string
  remitente?: Usuario
  conversacion?: Conversacion
}
