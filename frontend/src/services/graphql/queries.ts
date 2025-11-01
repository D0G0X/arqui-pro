import { gql } from '@apollo/client'

export const BUSCAR_ARQUITECTOS = gql`
  query BuscarArquitectos(
    $especialidad: String
    $verificado: Boolean
    $valoracionMinima: Float
    $limite: Int
  ) {
    buscarArquitectos(
      especialidad: $especialidad
      verificado: $verificado
      valoracionMinima: $valoracionMinima
      limite: $limite
    ) {
      id
      cedula
      especialidades
      descripcion
      valoracionPromedioProyecto
      verificado
      usuario {
        id
        nombre
        apellido
        email
        fotoPerfil
      }
      proyectos {
        id
        tituloProyecto
        valoracionPromedio
      }
    }
  }
`

export const ESTADISTICAS_ARQUITECTO = gql`
  query EstadisticasArquitecto($arquitectoId: ID!) {
    estadisticasArquitecto(arquitectoId: $arquitectoId) {
      arquitecto {
        id
        nombre
        apellido
        especialidades
        verificado
      }
      proyectosCompletados
      proyectosEnCurso
      valoracionPromedio
      totalValoraciones
      distribucionValoraciones {
        estrellas
        cantidad
      }
      proyectosRecientes {
        id
        tituloProyecto
        tipoProyecto
        valoracionPromedio
      }
      mejoraValoracion {
        promedioPeriodoAnterior
        promedioPeriodoActual
        cambio
      }
    }
  }
`

export const PERFIL_COMPLETO_ARQUITECTO = gql`
  query PerfilCompletoArquitecto($arquitectoId: ID!) {
    perfilCompletoArquitecto(arquitectoId: $arquitectoId) {
      datosBasicos {
        id
        nombre
        apellido
        email
        fotoPerfil
        cedula
        especialidades
        descripcion
        verificado
      }
      estadisticas {
        proyectosCompletados
        proyectosEnCurso
        valoracionPromedio
        totalValoraciones
      }
      proyectos {
        id
        tituloProyecto
        descripcion
        tipoProyecto
        valoracionPromedio
        imagenes {
          id
          imagenUrl
        }
      }
      valoracionesRecientes {
        id
        calificacion
        comentario
        fecha
        cliente {
          nombre
          apellido
        }
      }
    }
  }
`
