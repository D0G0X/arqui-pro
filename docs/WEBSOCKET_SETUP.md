# WebSocket Server - Configuración Completada ✅

## 🎯 Cambios Realizados

### 1. ✅ Dependencias Instaladas (package.json)
```json
{
  "@nestjs/axios": "^3.0.3",
  "@nestjs/platform-socket.io": "^11.0.1",
  "@nestjs/websockets": "^11.0.1",
  "axios": "^1.7.9",
  "socket.io": "^4.7.5"
}
```

### 2. ✅ AppModule Configurado
```typescript
// src/app.module.ts
@Module({
  imports: [
    HttpModule,        // ← Para llamadas HTTP al REST API
    ChatModule,        // ← Gateway de chat
    NotificacionModule // ← Gateway de notificaciones
  ],
})
```

### 3. ✅ NotificacionGateway Implementado
```typescript
// notificacion/notificacion.gateway.ts
@WebSocketGateway({ cors: { origin: '*' }, namespace: '/notificaciones' })
export class NotificacionGateway {
  
  // Eventos disponibles:
  @SubscribeMessage('usuario:conectar')         // Cliente se conecta
  @SubscribeMessage('usuario:desconectar')      // Cliente se desconecta
  @SubscribeMessage('notificacion:marcar_leida') // Marcar como leída
  
  // Métodos públicos:
  enviarNotificacion(usuario_id, notificacion)   // Enviar a usuario específico
  enviarNotificacionSistema(notificacion)        // Broadcast a todos
}
```

### 4. ✅ NotificacionService Actualizado
```typescript
// notificacion/notificacion.service.ts
async createNotification(payload, authorization?) // Crear notificación en REST API
async markAsRead(notificacion_id, authorization?) // Marcar como leída en REST API
```

---

## 🚀 Instalación de Dependencias

Ejecuta en PowerShell (como administrador):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
cd c:\Users\leoan\Desktop\arqui-pro\backend\wedsocket
npm install
```

O manualmente copia el `package.json` actualizado y ejecuta:
```bash
npm install
```

---

## 📡 Namespaces Disponibles

| Namespace | Puerto | Descripción |
|-----------|--------|-------------|
| `/chat` | 3006 | Mensajes en tiempo real, typing indicators |
| `/notificaciones` | 3006 | Notificaciones push, presencia de usuarios |

---

## 🔌 Eventos del Chat Gateway

### Cliente → Servidor
```typescript
socket.emit('join_conversation', { conversacion_id: number })
socket.emit('leave_conversation', { conversacion_id: number })
socket.emit('message:create', { contenido, remitente_id, conversacion_id })
socket.emit('message:typing', { usuario_id, conversacion_id, typing: boolean })
```

### Servidor → Cliente
```typescript
socket.on('conversation:joined', ({ conversacion_id }) => {})
socket.on('conversation:left', ({ conversacion_id }) => {})
socket.on('message:new', (mensaje) => {})
socket.on('message:typing', ({ usuario_id, typing }) => {})
socket.on('error', ({ message }) => {})
```

---

## 🔔 Eventos del Notificacion Gateway

### Cliente → Servidor
```typescript
socket.emit('usuario:conectar', { usuario_id: string })
socket.emit('usuario:desconectar', { usuario_id: string })
socket.emit('notificacion:marcar_leida', { notificacion_id: string })
```

### Servidor → Cliente
```typescript
socket.on('usuario:conectado', ({ usuario_id }) => {})
socket.on('usuario:online', ({ usuario_id, estado }) => {})
socket.on('usuario:offline', ({ usuario_id, estado }) => {})
socket.on('notificacion:nueva', (notificacion) => {})
socket.on('notificacion:actualizada', (notificacion) => {})
socket.on('notificacion:sistema', (notificacion) => {})
socket.on('error', ({ message }) => {})
```

---

## 🧪 Testing con test-client.js

```javascript
// test-client.js
const io = require('socket.io-client');

// Test Chat
const chatSocket = io('http://localhost:3006/chat', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

chatSocket.on('connect', () => {
  console.log('✅ Chat connected');
  chatSocket.emit('join_conversation', { conversacion_id: 1 });
});

chatSocket.on('message:new', (msg) => {
  console.log('📨 New message:', msg);
});

// Test Notificaciones
const notifSocket = io('http://localhost:3006/notificaciones', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

notifSocket.on('connect', () => {
  console.log('✅ Notificaciones connected');
  notifSocket.emit('usuario:conectar', { usuario_id: 'uuid-here' });
});

notifSocket.on('notificacion:nueva', (notif) => {
  console.log('🔔 New notification:', notif);
});
```

---

## ⚙️ Variables de Entorno

Crea `.env` en la raíz del proyecto:
```env
PORT=3006
APIREST_URL=http://localhost:3000
```

---

## 🏃 Ejecutar el Servidor

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor estará en: `http://localhost:3006`

---

## ✅ Estado Actual

| Componente | Estado | Descripción |
|------------|--------|-------------|
| Dependencies | ✅ | `socket.io`, `@nestjs/websockets`, `@nestjs/axios` |
| AppModule | ✅ | Importa `ChatModule` y `NotificacionModule` |
| ChatGateway | ✅ | Eventos de chat completos |
| ChatService | ✅ | Crea mensajes en REST API |
| NotificacionGateway | ✅ | Eventos de notificaciones y presencia |
| NotificacionService | ✅ | CRUD de notificaciones en REST API |
| CORS | ✅ | Habilitado en `main.ts` |

---

## 🔗 Integración con Frontend

En el frontend (`frontend/src/services/websocket/`), conectar con:

```typescript
import { io } from 'socket.io-client';

// Chat
const chatSocket = io('http://localhost:3006/chat', {
  auth: { token: localStorage.getItem('token') }
});

// Notificaciones
const notifSocket = io('http://localhost:3006/notificaciones', {
  auth: { token: localStorage.getItem('token') }
});
```

---

## 📚 Documentación

- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [Socket.IO](https://socket.io/docs/v4/)
- [NestJS Axios](https://docs.nestjs.com/techniques/http-module)
