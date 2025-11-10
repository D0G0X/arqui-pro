# Chat y Notificaciones con WebSocket

Sistema completo de chat en tiempo real y notificaciones usando Socket.IO.

## 📁 Estructura de Archivos

```
frontend/src/
├── services/websocket/
│   ├── chatService.ts          # Servicio para chat con WebSocket
│   └── notificationService.ts  # Servicio para notificaciones
├── hooks/
│   ├── useChat.ts              # Hook para manejar el chat
│   └── useNotifications.ts     # Hook para manejar notificaciones
├── components/
│   ├── Chat.tsx                # Componente de interfaz de chat
│   └── Notifications.tsx       # Componente de notificaciones
├── styles/
│   ├── Chat.css                # Estilos del chat
│   └── Notifications.css       # Estilos de notificaciones
└── pages/
    └── ChatExample.tsx         # Ejemplo de uso
```

## 🚀 Instalación y Configuración

### 1. Variables de Entorno

Crea o actualiza tu archivo `.env` en el frontend:

```env
VITE_WS_URL=http://localhost:3006
```

### 2. Dependencias

Las dependencias ya están instaladas en tu `package.json`:
- `socket.io-client`: ^4.8.1
- `lucide-react`: ^0.552.0 (para iconos)

## 🎯 Uso Rápido

### Chat

```tsx
import { Chat } from './components/Chat';

function MiComponente() {
  const [chatAbierto, setChatAbierto] = useState(false);
  const conversacionId = "id-de-conversacion";
  const usuarioId = "id-de-usuario";
  
  return (
    <>
      <button onClick={() => setChatAbierto(true)}>
        Abrir Chat
      </button>
      
      {chatAbierto && (
        <Chat
          conversacionId={conversacionId}
          usuarioId={usuarioId}
          usuarioNombre="Juan Pérez"
          onClose={() => setChatAbierto(false)}
        />
      )}
    </>
  );
}
```

### Notificaciones

```tsx
import { Notifications } from './components/Notifications';

function Header() {
  const usuarioId = "id-de-usuario";
  
  const handleNotificationClick = (notificacion) => {
    console.log('Notificación:', notificacion);
    // Abrir chat, navegar, etc.
  };
  
  return (
    <header>
      <Notifications 
        usuarioId={usuarioId}
        onNotificationClick={handleNotificationClick}
      />
    </header>
  );
}
```

## 📡 Conexión con Backend

### Endpoints WebSocket

El sistema se conecta automáticamente a:

- **Chat**: `ws://localhost:3006/chat`
- **Notificaciones**: `ws://localhost:3006/notificacion`

### Eventos del Chat

**Eventos que envía el frontend:**
- `join_conversation`: Unirse a una conversación
- `leave_conversation`: Salir de una conversación
- `message:create`: Enviar un mensaje
- `message:typing`: Notificar que está escribiendo

**Eventos que recibe el frontend:**
- `connection:established`: Conexión establecida
- `conversation:joined`: Unido a conversación
- `message:new`: Nuevo mensaje recibido
- `message:typing`: Otro usuario está escribiendo

### Eventos de Notificaciones

**Eventos que recibe el frontend:**
- `connected`: Conexión establecida
- `nuevaConversacion`: Nueva conversación creada
- `message:new`: Nuevo mensaje (para notificación)

## 🎨 Personalización de Estilos

### Chat

Edita `src/styles/Chat.css` para personalizar:
- Colores de los mensajes
- Tamaño y posición del chat
- Animaciones
- Estilos de scroll

### Notificaciones

Edita `src/styles/Notifications.css` para personalizar:
- Posición del panel
- Colores y badges
- Tamaño de iconos
- Animaciones

## 🔧 API de Hooks

### useChat

```tsx
const {
  mensajes,           // Array de mensajes
  isConnected,        // Estado de conexión
  isTyping,           // Otro usuario escribiendo
  sendMessage,        // Función para enviar mensaje
  markAsRead,         // Marcar como leídos
  notifyTyping,       // Notificar que estás escribiendo
  addMensaje          // Agregar mensaje manualmente
} = useChat({
  conversacionId: string,
  usuarioId: string,
  autoConnect?: boolean  // Default: true
});
```

### useNotifications

```tsx
const {
  notificaciones,     // Array de notificaciones
  isConnected,        // Estado de conexión
  markAsRead,         // Marcar como leída
  clearAll,           // Limpiar todas
  unreadCount         // Cantidad sin leer
} = useNotifications({
  usuarioId: string,
  autoConnect?: boolean  // Default: true
});
```

## 📋 Tipos TypeScript

### Mensaje

```typescript
interface Mensaje {
  id: string;
  contenido: string;
  fecha_envio: string;
  leido: boolean;
  remitente_id: string;
  conversacion_id: string;
  remitente?: Usuario;
  conversacion?: Conversacion;
}
```

### Notificación

```typescript
interface Notificacion {
  id: string;
  tipo: 'mensaje' | 'conversacion' | 'sistema';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  metadata?: any;
}
```

## 🐛 Debugging

### Ver logs en consola

Los servicios usan un logger que puedes ver en la consola del navegador:

```typescript
import { logger } from './utils/logger';

// Los servicios automáticamente registran:
// - Conexiones/desconexiones
// - Mensajes enviados/recibidos
// - Errores
```

### Estado de conexión

Ambos componentes muestran el estado de conexión visualmente:
- **Verde**: Conectado
- **Gris/Rojo**: Desconectado

## ⚡ Características

- ✅ **Tiempo Real**: Mensajes instantáneos con WebSocket
- ✅ **Reconexión Automática**: Se reconecta si se pierde la conexión
- ✅ **Indicador de Escritura**: Muestra cuando alguien está escribiendo
- ✅ **Notificaciones No Intrusivas**: Panel desplegable elegante
- ✅ **Contador de No Leídas**: Badge con número de notificaciones
- ✅ **Responsive**: Funciona en móviles y desktop
- ✅ **TypeScript**: Completamente tipado
- ✅ **Scroll Automático**: Se desplaza al último mensaje
- ✅ **Animaciones Suaves**: Transiciones fluidas

## 🔒 Seguridad

El sistema envía el token de autenticación automáticamente:

```typescript
const token = localStorage.getItem('auth_token');
socket.io({
  auth: { token }
});
```

Asegúrate de que tu backend valide este token.

## 📝 Notas

1. **IDs de Usuario**: Deben ser strings, no números
2. **Conversación Activa**: Solo puedes estar en una conversación a la vez
3. **Mensajes Persistentes**: Los mensajes se mantienen mientras el componente está montado
4. **Notificaciones**: Se almacenan en memoria, se limpian al recargar

## 🤝 Integración con AuthContext

```tsx
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();
  
  return user ? (
    <Notifications usuarioId={user.id} />
  ) : null;
}
```

## 📞 Soporte

Si tienes problemas:

1. Verifica que el servidor WebSocket esté corriendo en el puerto 3006
2. Revisa la consola del navegador para errores
3. Asegúrate de que las variables de entorno estén correctas
4. Verifica que el usuario tenga un ID válido

---

¡Listo para usar! 🎉
