# 🧪 Guía de Testing para WebSocket

## 📋 Índice
- [Método 1: Cliente Node.js (Recomendado)](#método-1-cliente-nodejs)
- [Método 2: Postman Desktop](#método-2-postman-desktop)
- [Método 3: Navegador con Socket.io-client](#método-3-navegador)
- [Referencia de Eventos](#referencia-de-eventos)
- [Troubleshooting](#troubleshooting)

---

## ⚙️ Configuración Previa

Antes de probar, asegúrate de que el servidor WebSocket esté corriendo:

```bash
cd backend/wedsocket
npm install
npm run start:dev  # Puerto 3006 por defecto
```

Verifica que el servidor esté activo:
```
✓ WebSocket server listening on port 3006
✓ Namespaces: /chat, /notificaciones
```

---

## 🟢 Método 1: Cliente Node.js (Recomendado)

**✅ Ventajas:** Más fácil, mejor logging, reproduce flujo real  
**📦 Requiere:** Node.js instalado

### ⚠️ Importante: Modos de Testing

El test-client puede ejecutarse en **2 modos**:

#### Modo 1: Básico (Sin API REST)
- ✅ Prueba conectividad WebSocket
- ✅ Eventos que no requieren base de datos
- ❌ No puede crear mensajes reales

**Eventos que funcionan:**
- `join_conversation`, `leave_conversation`
- `message:typing` (indicador de escritura)
- `usuario:conectar` (sistema de notificaciones)

#### Modo 2: Completo (Con API REST)
- ✅ Todas las funcionalidades
- ✅ Crea mensajes en base de datos
- ✅ Sistema completo end-to-end

**Requiere:**
- API REST Rails corriendo en puerto 3000
- Token JWT válido de un usuario existente
- Base de datos con conversaciones

### Paso 1: Instalar dependencias
```bash
cd backend/wedsocket
npm install socket.io-client
```

### Paso 2A: Testing Básico (Solo WebSocket)

Simplemente ejecuta el cliente sin configurar nada:

```bash
node test-client.js
```

**Salida esperada:**
```
🔌 Conectando a WebSocket Server: http://localhost:3006
🔑 Token: Bearer <tu_jwt_aqui>
🧪 Modo: BÁSICO (sin persistencia)

✅ Chat connected: abc123
✅ Notificaciones connected: def456
📨 Enviando: join_conversation
✅ Conversation joined: { conversacion_id: 1 }
⚠️  SKIP: message:create (necesitas token válido y API REST corriendo)
📨 Enviando: message:typing
⌨️  Typing indicator: { usuario_id: 1, conversacion_id: 1, typing: true }

📊 RESUMEN DEL TEST:
✅ Eventos que funcionan SIN API REST:
   - join_conversation, leave_conversation
   - message:typing (indicador de escritura)
   - usuario:conectar (notificaciones)

⚠️  Eventos que REQUIEREN API REST + Token:
   - message:create (guardar mensaje en BD)
```

**✅ Si ves esto, tu WebSocket funciona correctamente!**

### Paso 2B: Testing Completo (WebSocket + API REST)

Para probar la creación de mensajes reales:

#### 1. Inicia la API REST Rails

```bash
cd backend/APIREST
rails server  # Corre en puerto 3000
```

#### 2. Obtén un token válido

```bash
# Login en API REST (Windows CMD)
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"123456\"}"

# Respuesta: { "token": "eyJhbGciOiJIUzI1NiJ9..." }
```

#### 3. Configura el token y ejecuta

```bash
# Windows CMD
set TOKEN=Bearer eyJhbGciOiJIUzI1NiJ9...
node test-client.js

# PowerShell
$env:TOKEN="Bearer eyJhbGciOiJIUzI1NiJ9..."
node test-client.js
```

**Salida esperada (Modo Completo):**
```
🧪 Modo: FULL (con API REST)
✅ Chat connected: abc123
📨 Enviando: message:create (REQUIERE API REST)
📬 New message received: { id: 123, contenido: 'Prueba desde test-client', ... }
```

### Paso 3: Ver logs y resultados

El test-client mostrará un resumen al final:

```
� RESUMEN DEL TEST:
✅ Eventos que funcionan SIN API REST:
   - join_conversation, leave_conversation
   - message:typing (indicador de escritura)
   - usuario:conectar (notificaciones)

⚠️  Eventos que REQUIEREN API REST + Token:
   - message:create (guardar mensaje en BD)
```

### � Troubleshooting Test Client

#### Error: `could_not_create_message`

**Causa:** La API REST no está corriendo o el token es inválido

**Soluciones:**
```bash
# 1. Verifica que API REST esté corriendo
curl http://localhost:3000/health  # Debe responder 200

# 2. Verifica que el token sea válido
curl -H "Authorization: Bearer tu_token" http://localhost:3000/api/v1/perfil

# 3. Crea datos de prueba si no existen
cd backend/APIREST
rails console
> Usuario.create(email: 'test@test.com', password: '123456', nombre: 'Test', apellido: 'User')
> Conversacion.create(titulo: 'Test Chat')
```

#### ✅ WebSocket funciona si ves:
- `Chat connected: xxx` - Conexión exitosa
- `Conversation joined` - Join a sala funciona
- `Typing indicator` - Eventos en tiempo real funcionan

**No necesitas API REST para verificar que WebSocket funciona correctamente!** 

---

## 🟡 Método 2: Postman Desktop

**⚠️ Limitaciones:** 
- Solo Postman Desktop (versión 10+), no funciona en web
- No soporta namespaces Socket.io directamente
- Requiere agregar namespace en la URL

### Paso 1: Descargar Postman Desktop
Si usas Postman Web, descarga la versión desktop desde https://www.postman.com/downloads/

### Paso 2: Conectar a WebSocket

#### Namespace: `/chat`
1. Crea nueva **WebSocket Request**
2. URL: `ws://localhost:3006/socket.io/?EIO=4&transport=websocket&namespace=/chat`
3. Click **Connect**

#### Agregar autenticación:
1. Ve a pestaña **Headers**
2. Agrega: 
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiJ9...`
3. Click **Connect** nuevamente

### Paso 3: Enviar eventos

Socket.io usa un protocolo específico. Los mensajes deben enviarse en formato:

```
42["event_name", {"data": "value"}]
```

Donde:
- `4` = Engine.IO mensaje
- `2` = Socket.io evento
- `["event_name", {...}]` = Array con nombre y datos

#### Ejemplo: Unirse a conversación
```json
42["join_conversation",{"conversacion_id":1}]
```

#### Ejemplo: Enviar mensaje
```json
42["message:create",{"contenido":"Hola desde Postman","remitente_id":1,"conversacion_id":1}]
```

#### Ejemplo: Indicador de escritura
```json
42["message:typing",{"usuario_id":1,"conversacion_id":1,"typing":true}]
```

### Paso 4: Ver respuestas

Las respuestas del servidor aparecerán en el panel inferior:

```json
42["message:new",{"id":123,"contenido":"Hola desde Postman","remitente_id":1,"conversacion_id":1,"created_at":"2024-..."}]
```

Para interpretarlas, elimina el prefijo `42[...` y verás:
```json
{
  "event": "message:new",
  "data": {
    "id": 123,
    "contenido": "Hola desde Postman",
    "remitente_id": 1,
    "conversacion_id": 1
  }
}
```

### Namespace: `/notificaciones`

URL: `ws://localhost:3006/socket.io/?EIO=4&transport=websocket&namespace=/notificaciones`

#### Eventos para enviar:
```json
42["usuario:conectar",{"usuario_id":"user-123"}]
```

#### Respuestas esperadas:
```json
42["usuario:conectado",{"usuario_id":"user-123","timestamp":"2024-..."}]
42["notificacion:nueva",{"tipo":"mensaje","mensaje":"Tienes un mensaje nuevo"}]
```

---

## 🟣 Método 3: Navegador con Socket.io-client

**✅ Ventajas:** No requiere instalación, ideal para debug rápido

### Paso 1: Crear archivo HTML de prueba

```html
<!DOCTYPE html>
<html>
<head>
  <title>WebSocket Test Client</title>
  <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
</head>
<body>
  <h1>WebSocket Test Client</h1>
  
  <div id="logs" style="background: #000; color: #0f0; padding: 20px; font-family: monospace;"></div>
  
  <script>
    const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9...'; // Reemplaza con tu token
    
    function log(msg) {
      const logs = document.getElementById('logs');
      logs.innerHTML += msg + '\n';
      console.log(msg);
    }
    
    // Conectar a /chat
    const chat = io('http://localhost:3006/chat', {
      extraHeaders: { Authorization: TOKEN },
      transports: ['websocket']
    });
    
    chat.on('connect', () => {
      log('✅ Chat connected: ' + chat.id);
      
      // Unirse a conversación
      chat.emit('join_conversation', { conversacion_id: 1 });
      log('📨 Enviado: join_conversation');
      
      // Enviar mensaje
      setTimeout(() => {
        chat.emit('message:create', { 
          contenido: 'Test desde navegador', 
          remitente_id: 1, 
          conversacion_id: 1 
        });
        log('📨 Enviado: message:create');
      }, 1000);
    });
    
    chat.on('conversation:joined', (data) => {
      log('✅ Conversation joined: ' + JSON.stringify(data));
    });
    
    chat.on('message:new', (msg) => {
      log('📬 Mensaje recibido: ' + JSON.stringify(msg));
    });
    
    chat.on('error', (err) => {
      log('❌ Error: ' + err);
    });
    
    // Conectar a /notificaciones
    const noti = io('http://localhost:3006/notificaciones', {
      extraHeaders: { Authorization: TOKEN },
      transports: ['websocket']
    });
    
    noti.on('connect', () => {
      log('✅ Notificaciones connected: ' + noti.id);
      noti.emit('usuario:conectar', { usuario_id: 'test-user-123' });
    });
    
    noti.on('notificacion:nueva', (notif) => {
      log('🔔 Notificación: ' + JSON.stringify(notif));
    });
  </script>
</body>
</html>
```

### Paso 2: Abrir en navegador

1. Guarda como `test-websocket.html`
2. Reemplaza el `TOKEN` con uno válido
3. Abre el archivo en tu navegador (Ctrl+O)
4. Abre Developer Tools (F12) para ver logs completos

---

## 📚 Referencia de Eventos

### Namespace: `/chat`

#### Eventos que puedes enviar (emit):

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `join_conversation` | `{ conversacion_id: number }` | Unirse a una conversación |
| `leave_conversation` | `{ conversacion_id: number }` | Salir de una conversación |
| `message:create` | `{ contenido: string, remitente_id: number, conversacion_id: number }` | Enviar mensaje |
| `message:typing` | `{ usuario_id: number, conversacion_id: number, typing: boolean }` | Indicador de escritura |
| `message:read` | `{ mensaje_id: number, usuario_id: number }` | Marcar mensaje como leído |

#### Eventos que recibirás (on):

| Evento | Datos | Cuándo se emite |
|--------|-------|-----------------|
| `conversation:joined` | `{ conversacion_id, usuarios: [...] }` | Al unirte a conversación |
| `message:new` | `{ id, contenido, remitente_id, conversacion_id, created_at }` | Nuevo mensaje en conversación |
| `message:typing` | `{ usuario_id, conversacion_id, typing }` | Alguien está escribiendo |
| `message:read` | `{ mensaje_id, usuario_id, read_at }` | Mensaje marcado como leído |
| `user:joined` | `{ usuario_id, conversacion_id }` | Usuario se unió a conversación |
| `user:left` | `{ usuario_id, conversacion_id }` | Usuario salió de conversación |
| `error` | `{ message: string, code?: string }` | Error en operación |

### Namespace: `/notificaciones`

#### Eventos que puedes enviar (emit):

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `usuario:conectar` | `{ usuario_id: string \| number }` | Conectar usuario al sistema de notificaciones |
| `usuario:desconectar` | `{ usuario_id: string \| number }` | Desconectar usuario |
| `notificacion:leer` | `{ notificacion_id: number, usuario_id: number }` | Marcar notificación como leída |
| `notificacion:leer_todas` | `{ usuario_id: number }` | Marcar todas como leídas |

#### Eventos que recibirás (on):

| Evento | Datos | Cuándo se emite |
|--------|-------|-----------------|
| `usuario:conectado` | `{ usuario_id, timestamp }` | Confirmación de conexión |
| `usuario:online` | `{ usuarios: [...] }` | Lista de usuarios online |
| `notificacion:nueva` | `{ id, tipo, mensaje, usuario_id, data, created_at }` | Nueva notificación para el usuario |
| `notificacion:sistema` | `{ tipo, mensaje, data }` | Notificación broadcast a todos |
| `notificacion:leida` | `{ notificacion_id, usuario_id, read_at }` | Confirmación de lectura |
| `error` | `{ message: string, code?: string }` | Error en operación |

---

## 🔧 Troubleshooting

### ❌ "connect_error: websocket error"

**Causa:** El servidor WebSocket no está corriendo  
**Solución:**
```bash
cd backend/wedsocket
npm run start:dev
```

### ❌ "Error: Invalid namespace"

**Causa:** Nombre de namespace incorrecto  
**Solución:** Usa `/chat` o `/notificaciones` (sin 'n' final)

### ❌ "Unauthorized" o 401

**Causa:** Token JWT inválido o expirado  
**Solución:**
1. Genera un nuevo token desde la API REST (`POST /login`)
2. Verifica que el token incluya el prefijo `Bearer`
3. Asegúrate de que el usuario existe en la BD

### ❌ No recibo eventos

**Causas posibles:**
1. No te uniste a la sala: Envía `join_conversation` primero
2. El evento se emitió antes de conectarte: Asegúrate de conectar antes
3. Usuario no conectado: Envía `usuario:conectar` en namespace `/notificaciones`

**Solución:** Revisa los logs del servidor:
```bash
# Backend logs mostrarán:
[ChatGateway] Usuario 1 se unió a conversación 1
[ChatGateway] Nuevo mensaje en conversación 1
```

### ❌ "CORS error" en navegador

**Causa:** CORS no configurado  
**Solución:** El servidor ya tiene CORS habilitado:
```typescript
// src/main.ts
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
});
```

Si usas otro puerto, agrégalo a la lista.

### ❌ Postman no se conecta

**Causas:**
1. Usas Postman Web (no soporta WebSocket): Descarga Desktop
2. URL incorrecta: Asegúrate de usar el formato completo con `?EIO=4&transport=websocket&namespace=/chat`
3. Formato de evento incorrecto: Usa `42["event_name",{data}]`

---

## 📊 Ejemplos de Flujos Completos

### Flujo 1: Chat entre 2 usuarios

```javascript
// Usuario 1
const user1 = io('http://localhost:3006/chat', {
  extraHeaders: { Authorization: 'Bearer token_user1' }
});

user1.on('connect', () => {
  user1.emit('join_conversation', { conversacion_id: 1 });
});

user1.on('message:new', (msg) => {
  console.log('User1 recibió:', msg.contenido);
});

// Usuario 2
const user2 = io('http://localhost:3006/chat', {
  extraHeaders: { Authorization: 'Bearer token_user2' }
});

user2.on('connect', () => {
  user2.emit('join_conversation', { conversacion_id: 1 });
  
  // Enviar mensaje después de conectar
  setTimeout(() => {
    user2.emit('message:create', {
      contenido: 'Hola User1!',
      remitente_id: 2,
      conversacion_id: 1
    });
  }, 500);
});

// Resultado: User1 recibirá el mensaje "Hola User1!" en evento 'message:new'
```

### Flujo 2: Sistema de notificaciones

```javascript
// Backend: Enviar notificación desde API REST
// POST /api/notificaciones
{
  "usuario_id": 123,
  "tipo": "proyecto_nuevo",
  "mensaje": "Te han asignado un nuevo proyecto"
}

// Frontend: Usuario conectado recibirá:
const noti = io('http://localhost:3006/notificaciones', {
  extraHeaders: { Authorization: 'Bearer token' }
});

noti.on('connect', () => {
  noti.emit('usuario:conectar', { usuario_id: 123 });
});

noti.on('notificacion:nueva', (notif) => {
  // Mostrar notificación en UI
  showToast(notif.mensaje);
  playSound();
});
```

### Flujo 3: Typing indicator

```javascript
// Usuario escribe en input
const inputElement = document.getElementById('mensaje');

let typingTimeout;
inputElement.addEventListener('input', () => {
  // Emitir "typing: true"
  chat.emit('message:typing', {
    usuario_id: 1,
    conversacion_id: 1,
    typing: true
  });
  
  // Cancelar timeout anterior
  clearTimeout(typingTimeout);
  
  // Emitir "typing: false" después de 1 segundo sin escribir
  typingTimeout = setTimeout(() => {
    chat.emit('message:typing', {
      usuario_id: 1,
      conversacion_id: 1,
      typing: false
    });
  }, 1000);
});

// Otro usuario recibe:
chat.on('message:typing', (data) => {
  if (data.typing) {
    showTypingIndicator(data.usuario_id);
  } else {
    hideTypingIndicator(data.usuario_id);
  }
});
```

---

## 🎯 Checklist de Testing

Usa este checklist para verificar que todo funciona:

### Namespace `/chat`
- [ ] Conecta exitosamente con token válido
- [ ] Emite `join_conversation` y recibe `conversation:joined`
- [ ] Emite `message:create` y recibe `message:new`
- [ ] Otro usuario en misma conversación recibe el mensaje
- [ ] Indicador de escritura funciona (typing)
- [ ] Emite `leave_conversation` y deja de recibir mensajes

### Namespace `/notificaciones`
- [ ] Conecta exitosamente con token válido
- [ ] Emite `usuario:conectar` y recibe `usuario:conectado`
- [ ] Recibe `notificacion:nueva` cuando se crea una notificación
- [ ] Recibe `notificacion:sistema` en broadcasts
- [ ] `notificacion:leer` marca notificación como leída
- [ ] Desconexión limpia con `usuario:desconectar`

### Errores y Edge Cases
- [ ] Token inválido retorna error de autenticación
- [ ] Conversación inexistente retorna error
- [ ] Usuario sin permisos no puede unirse a conversación
- [ ] Reconexión automática después de desconexión
- [ ] Manejo de múltiples pestañas/conexiones del mismo usuario

---

## 📖 Referencias

- [Socket.io Client API](https://socket.io/docs/v4/client-api/)
- [Postman WebSocket Docs](https://learning.postman.com/docs/sending-requests/websocket/websocket/)
- [NestJS WebSocket Gateway](https://docs.nestjs.com/websockets/gateways)
- [Documentación del proyecto](../docs/WEBSOCKET_SETUP.md)

---

## 🚀 Siguiente Paso: Integración con Frontend

Una vez que hayas verificado que WebSocket funciona, puedes integrarlo en React:

```typescript
// frontend/src/hooks/useWebSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useChat = (conversacionId: number) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const chatSocket = io('http://localhost:3006/chat', {
      extraHeaders: { Authorization: `Bearer ${token}` }
    });
    
    chatSocket.on('connect', () => {
      chatSocket.emit('join_conversation', { conversacion_id: conversacionId });
    });
    
    chatSocket.on('message:new', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    
    setSocket(chatSocket);
    
    return () => {
      chatSocket.disconnect();
    };
  }, [conversacionId]);
  
  const sendMessage = (contenido: string, remitenteId: number) => {
    socket?.emit('message:create', {
      contenido,
      remitente_id: remitenteId,
      conversacion_id: conversacionId
    });
  };
  
  return { messages, sendMessage };
};
```

**Ver más:** [docs/WEBSOCKET_SETUP.md](../docs/WEBSOCKET_SETUP.md) para ejemplos completos de integración con React.
