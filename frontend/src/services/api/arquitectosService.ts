import axiosInstance from './axiosInstance'
import type { Arquitecto } from '../../types'
import { CacheService } from '../../utils/cacheService'

export interface ArquitectosList {
  arquitectos: Arquitecto[]
  meta?: {
    current_page: number
    total_pages: number
    total_count: number
    per_page: number
  }
}

export interface ArquitectoFilters {
  especialidad?: string
  verificado?: boolean
  valoracion_minima?: number
  page?: number
  per_page?: number
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

class ArquitectosService {
  async getAll(filters?: ArquitectoFilters): Promise<ArquitectosList> {
    // Intentar obtener del caché
    const cacheKey = 'arquitectos_all_cache'
    const cached = CacheService.get<ArquitectosList>(cacheKey, filters, CACHE_DURATION)
    if (cached) {
      console.log('📦 Usando datos de arquitectos desde caché')
      return cached
    }

    const params = new URLSearchParams()
    
    if (filters?.especialidad) params.append('especialidad', filters.especialidad)
    if (filters?.verificado !== undefined) params.append('verificado', String(filters.verificado))
    if (filters?.valoracion_minima) params.append('valoracion_minima', String(filters.valoracion_minima))
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.per_page) params.append('per_page', String(filters.per_page))

    console.log('🌐 Obteniendo arquitectos desde API REST')
    const response = await axiosInstance.get(`/arquitectos?${params.toString()}`)
    
    // Si la respuesta es un array directamente, envuélvelo en el formato esperado
    let result: ArquitectosList
    if (Array.isArray(response.data)) {
      result = { arquitectos: response.data }
    } else {
      result = response.data
    }

    // Guardar en caché
    CacheService.set(cacheKey, result, filters)
    
    return result
  }

  async getById(id: string): Promise<Arquitecto> {
    // Intentar obtener del caché
    const cacheKey = `arquitecto_${id}_cache`
    const cached = CacheService.get<Arquitecto>(cacheKey, undefined, CACHE_DURATION)
    if (cached) {
      console.log(`📦 Usando arquitecto ${id} desde caché`)
      return cached
    }

    console.log(`🌐 Obteniendo arquitecto ${id} desde API REST`)
    const response = await axiosInstance.get(`/arquitectos/${id}`)
    
    // Guardar en caché
    CacheService.set(cacheKey, response.data)
    
    return response.data
  }

  async getVerificados(): Promise<ArquitectosList> {
    // Intentar obtener del caché
    const cacheKey = 'arquitectos_verificados_cache'
    const cached = CacheService.get<ArquitectosList>(cacheKey, undefined, CACHE_DURATION)
    if (cached) {
      console.log('📦 Usando arquitectos verificados desde caché')
      return cached
    }

    console.log('🌐 Obteniendo arquitectos verificados desde API REST')
    const response = await axiosInstance.get('/arquitectos?verificado=true')
    
    // Guardar en caché
    CacheService.set(cacheKey, response.data)
    
    return response.data
  }

  async search(query: string): Promise<ArquitectosList> {
    // Intentar obtener del caché
    const cacheKey = 'arquitectos_search_cache'
    const cached = CacheService.get<ArquitectosList>(cacheKey, { query }, CACHE_DURATION)
    if (cached) {
      console.log(`📦 Usando búsqueda "${query}" desde caché`)
      return cached
    }

    console.log(`🌐 Buscando "${query}" en API REST`)
    const response = await axiosInstance.get(`/arquitectos/search?q=${query}`)
    
    // Guardar en caché
    CacheService.set(cacheKey, response.data, { query })
    
    return response.data
  }

  // Método para limpiar el caché manualmente
  clearCache(): void {
    CacheService.remove('arquitectos_all_cache')
    CacheService.remove('arquitectos_verificados_cache')
    CacheService.remove('arquitectos_search_cache')
    console.log('🗑️ Caché de arquitectos limpiado')
  }
}

export default new ArquitectosService()
