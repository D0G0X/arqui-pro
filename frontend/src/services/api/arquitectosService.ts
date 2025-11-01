import axiosInstance from './axiosInstance'
import type { Arquitecto } from '../../types'

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

class ArquitectosService {
  async getAll(filters?: ArquitectoFilters): Promise<ArquitectosList> {
    const params = new URLSearchParams()
    
    if (filters?.especialidad) params.append('especialidad', filters.especialidad)
    if (filters?.verificado !== undefined) params.append('verificado', String(filters.verificado))
    if (filters?.valoracion_minima) params.append('valoracion_minima', String(filters.valoracion_minima))
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.per_page) params.append('per_page', String(filters.per_page))

    const response = await axiosInstance.get(`/arquitectos?${params.toString()}`)
    
    // Si la respuesta es un array directamente, envuélvelo en el formato esperado
    if (Array.isArray(response.data)) {
      return { arquitectos: response.data }
    }
    
    // Si ya viene en el formato correcto
    return response.data
  }

  async getById(id: string): Promise<Arquitecto> {
    const response = await axiosInstance.get(`/arquitectos/${id}`)
    return response.data
  }

  async getVerificados(): Promise<ArquitectosList> {
    const response = await axiosInstance.get('/arquitectos?verificado=true')
    return response.data
  }

  async search(query: string): Promise<ArquitectosList> {
    const response = await axiosInstance.get(`/arquitectos/search?q=${query}`)
    return response.data
  }
}

export default new ArquitectosService()
