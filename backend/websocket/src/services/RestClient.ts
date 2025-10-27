import axios, { AxiosInstance } from 'axios';
import { ChatMessage, ProjectCreate, APIResponse } from '../types';

export class RestClient {
  private api: AxiosInstance;

  constructor(baseURL: string = process.env.REST_API_URL || 'http://localhost:3000/api/v1') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Método para establecer el token JWT en todas las peticiones
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // MENSAJES
  async createMessage(message: ChatMessage): Promise<APIResponse<ChatMessage>> {
    try {
      const response = await this.api.post('/mensajes', message);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error creating message' 
      };
    }
  }

  async getMessages(conversacionId: number): Promise<APIResponse<ChatMessage[]>> {
    try {
      const response = await this.api.get(`/mensajes?conversacion_id=${conversacionId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error fetching messages'
      };
    }
  }

  // CONVERSACIONES
  async getConversation(id: number): Promise<APIResponse<any>> {
    try {
      const response = await this.api.get(`/conversaciones/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error fetching conversation'
      };
    }
  }

  // PROYECTOS
  async createProject(project: ProjectCreate): Promise<APIResponse<any>> {
    try {
      const response = await this.api.post('/proyectos', project);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error creating project' 
      };
    }
  }

  async getProject(id: number): Promise<APIResponse<any>> {
    try {
      const response = await this.api.get(`/proyectos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error fetching project'
      };
    }
  }

  // AUTENTICACIÓN (usando Devise de Rails)
  async verifyToken(token: string): Promise<APIResponse<any>> {
    try {
      // Intenta verificar con el endpoint de sesión de Devise
      const response = await this.api.get('/usuarios/verify_token', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Invalid token' };
    }
  }

  // NOTIFICACIONES
  async createNotification(notification: any): Promise<APIResponse<any>> {
    try {
      const response = await this.api.post('/notificaciones', notification);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error creating notification'
      };
    }
  }

  async getUserNotifications(userId: number): Promise<APIResponse<any>> {
    try {
      const response = await this.api.get(`/notificaciones?usuario_id=${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error fetching notifications'
      };
    }
  }

  // USUARIOS
  async getUserInfo(userId: number): Promise<APIResponse<any>> {
    try {
      const response = await this.api.get(`/usuarios/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error fetching user info'
      };
    }
  }
}