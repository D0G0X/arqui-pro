import { useQuery } from '@apollo/client'
import { BUSCAR_ARQUITECTOS } from './queries'

export interface ArquitectoGraphQL {
  id: number
  cedula: string
  especialidades: string
  descripcion: string
  valoracionPromedioProyecto: number
  verificado: boolean
  usuario: {
    id: number
    nombre: string
    apellido: string
    email: string
    fotoPerfil: string | null
  }
  proyectos: Array<{
    id: number
    tituloProyecto: string
    valoracionPromedio: number
  }>
}

export interface BuscarArquitectosData {
  buscarArquitectos: ArquitectoGraphQL[]
}

export interface BuscarArquitectosVariables {
  especialidad?: string
  verificado?: boolean
  valoracionMinima?: number
  limite?: number
}

export const useBuscarArquitectos = (variables?: BuscarArquitectosVariables) => {
  return useQuery<BuscarArquitectosData, BuscarArquitectosVariables>(
    BUSCAR_ARQUITECTOS,
    {
      variables,
      fetchPolicy: 'cache-and-network',
    }
  )
}
