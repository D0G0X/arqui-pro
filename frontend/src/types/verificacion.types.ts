import type { Arquitecto } from './arquitecto.types'
import type { Moderador } from './moderador.types'

// Verificación Type
export interface Verificacion {
  id: string
  estado: 'pendiente' | 'verificado' | 'rechazado'
  arquitecto_id: string
  moderador_id: string | null
  created_at: string
  updated_at: string
  arquitecto?: Arquitecto
  moderador?: Moderador
}
