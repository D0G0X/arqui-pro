import axiosInstance from './axiosInstance'
import type { SolicitudProyecto } from '../../types'
import { CacheService } from '../../utils/cacheService'

const CACHE_DURATION = 2 * 60 * 1000 // 2 minutos (datos más dinámicos)

class SolicitudesService {
  async getByCliente(clienteId: string): Promise<SolicitudProyecto[]> {
    const cacheKey = `solicitudes_cliente_${clienteId}_cache`
    const cached = CacheService.get<SolicitudProyecto[]>(cacheKey, undefined, CACHE_DURATION)
    if (cached) {
      console.log(`Usando solicitudes del cliente ${clienteId} desde caché`)
      return cached
    }

    console.log(`Obteniendo solicitudes del cliente ${clienteId} desde API REST`)
    const response = await axiosInstance.get(`/solicitudes_proyectos?cliente_id=${clienteId}`)
    
    const result = Array.isArray(response.data) ? response.data : response.data.solicitudes_proyectos || [];

    CacheService.set(cacheKey, result)
    return result
  }

  async getById(id: string): Promise<SolicitudProyecto> {
    const cacheKey = `solicitud_${id}_cache`
    const cached = CacheService.get<SolicitudProyecto>(cacheKey, undefined, CACHE_DURATION)
    if (cached) {
      console.log(`Usando solicitud ${id} desde caché`)
      return cached
    }

    console.log(`Obteniendo solicitud ${id} desde API REST`)
    const response = await axiosInstance.get(`/solicitudes_proyectos/${id}`)
    
    CacheService.set(cacheKey, response.data)
    return response.data
  }

  clearCache(): void {
    CacheService.clearByPattern('solicitudes_')
    CacheService.clearByPattern('solicitud_')
    console.log(' Caché de solicitudes limpiado')
  }
}

export default new SolicitudesService()
