import axiosInstance from './axiosInstance'
import type { Conversacion } from '../../types'

interface CreateConversacionParams {
  cliente_id: string
  arquitecto_id: string
}

interface ConversacionResponse {
  conversacion: Conversacion
  message?: string
}

const conversacionesService = {
  /**
   * Crear una nueva conversación entre cliente y arquitecto
   */
  async create(params: CreateConversacionParams): Promise<ConversacionResponse> {
    const response = await axiosInstance.post<ConversacionResponse>(
      '/conversaciones',
      {
        conversacion: {
          cliente_id: Number(params.cliente_id),
          arquitecto_id: Number(params.arquitecto_id),
          fecha: new Date().toISOString().split('T')[0] // YYYY-MM-DD
        }
      }
    )
    return response.data
  },

  /**
   * Obtener todas las conversaciones de un usuario
   */
  async getAll(): Promise<Conversacion[]> {
    const response = await axiosInstance.get<Conversacion[]>('/conversaciones')
    return response.data
  },

  /**
   * Obtener una conversación específica por ID
   */
  async getById(id: string): Promise<Conversacion> {
    const response = await axiosInstance.get<Conversacion>(`/conversaciones/${id}`)
    return response.data
  },

  /**
   * Obtener conversación entre cliente y arquitecto específicos
   */
  async getByParticipants(clienteId: string, arquitectoId: string): Promise<Conversacion | null> {
    try {
      const conversaciones = await this.getAll()
      const conversacion = conversaciones.find(
        (c) => 
          String(c.cliente_id) === String(clienteId) && 
          String(c.arquitecto_id) === String(arquitectoId)
      )
      return conversacion || null
    } catch (error) {
      console.error('Error buscando conversación:', error)
      return null
    }
  },

  /**
   * Obtener mensajes de una conversación
   */
  async getMensajes(conversacionId: string) {
    const response = await axiosInstance.get(`/conversaciones/${conversacionId}/mensajes`)
    return response.data
  },

  /**
   * Marcar mensajes como leídos
   */
  async marcarMensajesLeidos(conversacionId: string) {
    const response = await axiosInstance.put(`/conversaciones/${conversacionId}/marcar_mensajes_leidos`)
    return response.data
  }
}

export default conversacionesService
