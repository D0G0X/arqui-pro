// Tipos para mensajes del chat
export interface ChatMessage {
  id?: string;
  body: string;
  usuario_id: string;
  conversacion_id: string;
  created_at?: string;
}

// Tipos para estados de typing
export interface TypingStatus {
  usuario_id: string;
  conversacion_id: string;
  typing: boolean;
}

// Tipos para creación de proyectos
export interface ProjectCreate {
  title: string;
  description: string;
  cliente_id?: string;
  arquitecto_id?: string;
}

// Tipos para eventos WebSocket
export type WebSocketEvent = {
  type: 'message' | 'typing' | 'create_project';
  payload: ChatMessage | TypingStatus | ProjectCreate;
  conversation_id: string;
}

// Tipos para respuestas de la API REST
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}