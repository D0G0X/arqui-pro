import type { Cliente } from './cliente.types'
import type { Arquitecto } from './arquitecto.types'

// Conversación Type
export interface Conversacion {
  id: string
  cliente_id: string
  arquitecto_id: string
  fecha: string
  created_at: string
  updated_at: string
  cliente?: Cliente
  arquitecto?: Arquitecto
}
