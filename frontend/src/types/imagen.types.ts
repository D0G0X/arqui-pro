// Imagen Type
export interface Imagen {
  id: string
  imagen_url: string
  fecha: string
}

// Imagen Asociación (Polimórfica)
export interface ImagenAsociacion {
  id: string
  imagen_id: string
  asociable_type: 'Proyecto' | 'Mensaje' | 'Incidencia' | 'Avance'
  asociable_id: string
  imagen?: Imagen
}
