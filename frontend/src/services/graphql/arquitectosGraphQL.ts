import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { BUSCAR_ARQUITECTOS } from './queries'
import { CacheService } from '../../utils/cacheService'

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

const CACHE_KEY = 'arquitectos_graphql_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos en milisegundos

export const useBuscarArquitectos = (variables?: BuscarArquitectosVariables) => {
  const [cachedArquitectos, setCachedArquitectos] = useState<ArquitectoGraphQL[] | null>(() => 
    CacheService.get<ArquitectoGraphQL[]>(CACHE_KEY, variables, CACHE_DURATION)
  )

  const { data, loading, error, refetch } = useQuery<BuscarArquitectosData, BuscarArquitectosVariables>(
    BUSCAR_ARQUITECTOS,
    {
      variables,
      skip: cachedArquitectos !== null, // Saltar query si hay datos en caché
      fetchPolicy: 'network-only', // Cuando sí hace query, obtiene datos frescos
    }
  )

  // Guardar datos en caché cuando lleguen del servidor
  useEffect(() => {
    if (data?.buscarArquitectos) {
      console.log('📦 Guardando arquitectos de GraphQL en caché')
      CacheService.set(CACHE_KEY, data.buscarArquitectos, variables)
      setCachedArquitectos(data.buscarArquitectos)
    }
  }, [data, variables])

  // Mostrar cuando se usa caché
  useEffect(() => {
    if (cachedArquitectos) {
      console.log('📦 Usando arquitectos de GraphQL desde caché')
    }
  }, [])

  // Si hay datos en caché, usarlos
  const arquitectos = cachedArquitectos || data?.buscarArquitectos

  return {
    data: arquitectos ? { buscarArquitectos: arquitectos } : undefined,
    loading: cachedArquitectos ? false : loading,
    error,
    refetch: async () => {
      // Limpiar caché y forzar nuevo query
      console.log('🔄 Limpiando caché y refrescando datos de GraphQL')
      CacheService.remove(CACHE_KEY)
      setCachedArquitectos(null)
      return refetch()
    }
  }
}
