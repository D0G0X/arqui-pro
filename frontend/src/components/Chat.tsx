import { useState, useEffect, useRef } from 'react';
import { Send, Loader, FolderPlus } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import type { Mensaje } from '../types/mensaje.types';
import '../styles/Chat.css';

interface ChatProps {
  conversacionId: string;
  usuarioId: string;
  onClose?: () => void;
  userRole?: 'arquitecto' | 'cliente';
  clienteInfo?: {
    id: string;
    nombre: string;
  };
  onCreateProject?: () => void;
}

export function Chat({ conversacionId, usuarioId, onClose, userRole, clienteInfo, onCreateProject }: ChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isTypingTimeout, setIsTypingTimeout] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    mensajes,
    isConnected,
    isTyping,
    sendMessage,
    notifyTyping
  } = useChat({ conversacionId, usuarioId });

  // FILTRAR mensajes que pertenecen solo a ESTA conversación
  const mensajesFiltrados = mensajes.filter(m => m.conversacion_id === conversacionId);

  // Scroll automático al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajesFiltrados]);

  // Manejar envío de mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    await sendMessage(inputMessage);
    setInputMessage('');
    
    // Cancelar el indicador de escritura
    notifyTyping(false);
    if (isTypingTimeout) {
      clearTimeout(isTypingTimeout);
    }
  };

  // Manejar escritura
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMessage(value);

    // Notificar que está escribiendo
    notifyTyping(true);

    // Cancelar timeout anterior
    if (isTypingTimeout) {
      clearTimeout(isTypingTimeout);
    }

    // Programar cancelación del indicador
    const timeout = window.setTimeout(() => {
      notifyTyping(false);
    }, 2000);
    
    setIsTypingTimeout(timeout);
  };

  // Formatear fecha
  const formatTime = (mensaje: Mensaje) => {
    // Si existe hora_envio, usarla directamente
    if (mensaje.hora_envio) {
      const [horas, minutos] = mensaje.hora_envio.split(':');
      return `${horas}:${minutos}`;
    }
    // Fallback a fecha_envio si no hay hora_envio
    const date = new Date(mensaje.fecha_envio);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Obtener iniciales para avatar
  const getInitials = (nombre: string) => {
    if (!nombre) return 'U';
    const names = nombre.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <h3>{clienteInfo ? clienteInfo.nombre : 'Chat'}</h3>
          <span className={`chat-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
        <div className="chat-header-actions">
          {userRole === 'arquitecto' && onCreateProject && (
            <button onClick={onCreateProject} className="create-project-btn">
              <FolderPlus size={18} />
              Crear Proyecto
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="chat-close-btn">
              ×
            </button>
          )}
        </div>
      </div>

      {/* Mensajes */}
      <div className="chat-messages">
        {mensajesFiltrados.length === 0 ? (
          <div className="chat-empty">
            <p>No hay mensajes aún. ¡Envía el primero!</p>
          </div>
        ) : (
          mensajesFiltrados.map((mensaje: Mensaje) => {
            const isOwnMessage = mensaje.remitente_id === usuarioId;
            
            // DEBUG: Ver estructura del mensaje
            console.log('📩 Mensaje:', mensaje);
            console.log('   remitente_id:', mensaje.remitente_id);
            console.log('   remitente objeto:', mensaje.remitente);
            console.log('   usuarioId actual:', usuarioId);
            
            const senderName = mensaje.remitente?.nombre || 'Usuario';
            
            return (
              <div
                key={mensaje.id}
                className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
              >
                {/* Avatar */}
                <div className="message-avatar">
                  {getInitials(senderName)}
                </div>

                {/* Contenido del mensaje */}
                <div className="message-content-wrapper">
                  <div className="message-content">
                    {mensaje.contenido}
                  </div>
                  <span className="message-time">
                    {formatTime(mensaje)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        
        {/* Indicador de escritura */}
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-indicator-avatar">
              ...
            </div>
            <div className="typing-indicator-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Escribe un mensaje..."
            className="chat-input"
            disabled={!isConnected}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!isConnected || !inputMessage.trim()}
          >
            {isConnected ? <Send size={20} /> : <Loader size={20} className="spinning" />}
          </button>
        </form>
      </div>
    </div>
  );
}
