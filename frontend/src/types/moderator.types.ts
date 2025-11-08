/**
 * Tipos para el módulo de Moderador
 */

export interface Moderador {
  id: number
  usuario_id: number
  permisos: string
  fecha_asignacion: string
  usuario?: Usuario
}

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  rol: 'cliente' | 'arquitecto' | 'moderador'
  estado: 'activo' | 'inactivo' | 'bloqueado'
  fecha_registro: string
  foto_perfil?: string
}

export interface Reporte {
  id: number
  reportante_id: number
  reportado_id: number
  tipo_contenido: 'proyecto' | 'mensaje' | 'perfil' | 'valoracion'
  contenido_id: number
  motivo: string
  descripcion: string
  estado: 'pendiente' | 'en_revision' | 'resuelto' | 'rechazado'
  fecha_reporte: string
  fecha_resolucion?: string
  moderador_id?: number
  reportante?: Usuario
  reportado?: Usuario
  moderador?: Moderador
}

export interface Incidencia {
  id: number
  descripcion: string
  estado: 'pendiente' | 'en revision' | 'resuelto' | 'rechazado'
  fechaCreacion: string
  fechaResolucion?: string
  emisorId: number
  infractorId: number
  moderadorId?: number
  emisor?: {
    nombre: string
    apellido: string
  }
  infractor?: {
    nombre: string
    apellido: string
  }
  moderador?: {
    nombre: string
    apellido: string
  }
}

export interface Verificacion {
  id: number
  arquitectoId: number
  fechaSolicitud: string
  fechaResolucion?: string
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  moderadorId?: number
  comentarios?: string
  arquitecto?: {
    id: number
    cedula: string
    usuario: {
      nombre: string
      apellido: string
      email: string
    }
  }
  moderador?: {
    nombre: string
    apellido: string
  }
}

export interface ModeratorStats {
  totalUsuarios: number
  totalProyectos: number
  totalIncidencias: number
  arquitectosVerificados: number
  reportesPendientes: number
  usuariosActivos: number
  tasaVerificacion: number
}

export interface NotificacionModerador {
  id: number
  tipo: 'verificacion' | 'incidencia' | 'reporte' | 'sistema'
  mensaje: string
  fecha: string
  estado: 'no_leido' | 'leido'
  prioridad: 'baja' | 'media' | 'alta'
  referencia_id?: number
}

export interface AccionModeracion {
  tipo: 'aprobar' | 'rechazar' | 'bloquear' | 'eliminar' | 'advertir'
  motivo: string
  duracion_bloqueo?: number // días
  notas_internas?: string
}
