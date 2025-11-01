import type { Arquitecto } from './arquitecto.types'
import type { Cliente } from './cliente.types'

// Proyecto Type
export interface Proyecto {
  id: string
  titulo_proyecto: string
  descripcion: string
  tipo_proyecto: 'portafolio' | 'contratado'
  valoracion_promedio: number
  arquitecto_id: string
  cliente_id: string | null
  created_at: string
  updated_at: string
  arquitecto?: Arquitecto
  cliente?: Cliente
}
