import type { Cliente } from './cliente.types'
import type { Proyecto } from './proyecto.types'

// Valoración Type
export interface Valoracion {
  id: string
  calificacion: number
  comentario: string | null
  fecha: string
  cliente_id: string
  proyecto_id: string
  created_at: string
  updated_at: string
  cliente?: Cliente
  proyecto?: Proyecto
}
