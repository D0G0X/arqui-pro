import { io, Socket } from "socket.io-client";
import { logger } from "../../utils/logger";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:3006";

interface Notification {
  id: string;
  type: "nuevaConversacion" | "message:new";
  data: any;
  timestamp: Date;
  read: boolean;
}

class NotificationService {
  private socket: Socket | null = null;
  private notifications: Notification[] = [];
  private notificationHandlers: Set<(notification: Notification) => void> = new Set();

  connect() {
    if (this.socket?.connected) {
      logger.info("Notificaciones ya conectadas");
      return;
    }

    // Obtener token de autenticación
    const token = localStorage.getItem('auth_token');

    this.socket = io(`${WS_URL}/notificacion`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      extraHeaders: token ? {
        Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`
      } : {},
    });

    this.socket.on("connect", () => {
      logger.info("✅ Conectado al servidor de notificaciones");
    });

    this.socket.on("disconnect", () => {
      logger.warn("❌ Desconectado del servidor de notificaciones");
    });

    this.socket.on("nuevaConversacion", (data) => {
      const notification: Notification = {
        id: `conv-${Date.now()}`,
        type: "nuevaConversacion",
        data,
        timestamp: new Date(),
        read: false,
      };
      this.addNotification(notification);
    });

    this.socket.on("message:new", (data) => {
      const notification: Notification = {
        id: `msg-${Date.now()}`,
        type: "message:new",
        data,
        timestamp: new Date(),
        read: false,
      };
      this.addNotification(notification);
    });

    this.socket.on("error", (error) => {
      logger.error("Error en notificaciones socket:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      logger.info("Desconectado de notificaciones");
    }
  }

  private addNotification(notification: Notification) {
    this.notifications.unshift(notification);
    logger.info("🔔 Nueva notificación:", notification);
    this.notificationHandlers.forEach((handler) => handler(notification));
  }

  onNotification(handler: (notification: Notification) => void) {
    this.notificationHandlers.add(handler);
    return () => this.notificationHandlers.delete(handler);
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
  }

  clearNotifications() {
    this.notifications = [];
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }
}

export const notificationService = new NotificationService();
