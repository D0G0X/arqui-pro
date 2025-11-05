import { io, Socket } from 'socket.io-client';
import { logger } from '../../utils/logger';

interface NotificacionModerador {
  id: number;
  tipo: 'verificacion' | 'incidencia' | 'reporte' | 'sistema';
  mensaje: string;
  fecha: string;
  leida: boolean;
  metadata?: any;
}

type NotificationCallback = (notification: NotificacionModerador) => void;

class NotificationService {
  private socket: Socket | null = null;
  private callbacks: Set<NotificationCallback> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  /**
   * Conectar al servidor WebSocket
   */
  connect(userId: number, userRole: string): void {
    if (this.socket?.connected) {
      logger.info('WebSocket ya está conectado');
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3006';
    const token = localStorage.getItem('auth_token');

    logger.info('Conectando a WebSocket', { wsUrl, userId, userRole });

    this.socket = io(wsUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupEventListeners(userId, userRole);
  }

  /**
   * Configurar listeners de eventos
   */
  private setupEventListeners(userId: number, userRole: string): void {
    if (!this.socket) return;

    // Evento: Conexión exitosa
    this.socket.on('connect', () => {
      logger.info('WebSocket conectado', { socketId: this.socket?.id });
      this.reconnectAttempts = 0;
      
      // Unirse a sala de moderadores si corresponde
      if (userRole === 'moderador') {
        this.socket?.emit('joinModeratorRoom', { userId });
        logger.info('Uniéndose a sala de moderadores', { userId });
      }
    });

    // Evento: Desconexión
    this.socket.on('disconnect', (reason) => {
      logger.warn('WebSocket desconectado', { reason });
    });

    // Evento: Error de conexión
    this.socket.on('connect_error', (error) => {
      logger.error('Error de conexión WebSocket', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        logger.error('Máximo de intentos de reconexión alcanzado');
        this.disconnect();
      }
    });

    // Evento: Nueva notificación para moderador
    this.socket.on('moderator:notification', (notification: NotificacionModerador) => {
      logger.info('Nueva notificación recibida', notification);
      this.notifyCallbacks(notification);
    });

    // Evento: Nueva verificación pendiente
    this.socket.on('moderator:newVerification', (data: any) => {
      const notification: NotificacionModerador = {
        id: Date.now(),
        tipo: 'verificacion',
        mensaje: `Nueva solicitud de verificación de ${data.arquitecto?.nombre || 'arquitecto'}`,
        fecha: new Date().toISOString(),
        leida: false,
        metadata: data
      };
      this.notifyCallbacks(notification);
    });

    // Evento: Nueva incidencia
    this.socket.on('moderator:newIncident', (data: any) => {
      const notification: NotificacionModerador = {
        id: Date.now(),
        tipo: 'incidencia',
        mensaje: `Nueva incidencia reportada: ${data.descripcion?.substring(0, 50)}...`,
        fecha: new Date().toISOString(),
        leida: false,
        metadata: data
      };
      this.notifyCallbacks(notification);
    });

    // Evento: Actualización de estado
    this.socket.on('moderator:statusUpdate', (data: any) => {
      const notification: NotificacionModerador = {
        id: Date.now(),
        tipo: 'sistema',
        mensaje: data.mensaje || 'Actualización del sistema',
        fecha: new Date().toISOString(),
        leida: false,
        metadata: data
      };
      this.notifyCallbacks(notification);
    });
  }

  /**
   * Notificar a todos los callbacks registrados
   */
  private notifyCallbacks(notification: NotificacionModerador): void {
    this.callbacks.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        logger.error('Error en callback de notificación', error);
      }
    });
  }

  /**
   * Suscribirse a notificaciones
   */
  onNotification(callback: NotificationCallback): () => void {
    this.callbacks.add(callback);
    
    // Retornar función para desuscribirse
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Marcar notificación como leída
   */
  markAsRead(notificationId: number): void {
    if (this.socket?.connected) {
      this.socket.emit('notification:markRead', { notificationId });
      logger.info('Notificación marcada como leída', { notificationId });
    }
  }

  /**
   * Desconectar WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      logger.info('Desconectando WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.callbacks.clear();
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Emitir evento personalizado
   */
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
      logger.info('Evento emitido', { event, data });
    } else {
      logger.warn('No se puede emitir evento, WebSocket no conectado', { event });
    }
  }
}

// Exportar instancia singleton
export const notificationService = new NotificationService();
