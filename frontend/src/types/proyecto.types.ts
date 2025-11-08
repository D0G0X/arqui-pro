import type { Arquitecto } from './arquitecto.types'
import type { Avance } from './avance.types'
import type { Cliente } from './cliente.types'
import type { Imagen } from './imagen.types'

// Proyecto Type
export interface Proyecto {
  id: string
  titulo_proyecto: string
  descripcion: string
  tipo_proyecto: 'portafolio' | 'contratado'
  valoracion_promedio: number
  arquitecto_id: string
  cliente_id: string | null
  arquitecto?: Arquitecto
  cliente?: Cliente
  imagenes?: Imagen[]
  avances?: Avance[]
}
