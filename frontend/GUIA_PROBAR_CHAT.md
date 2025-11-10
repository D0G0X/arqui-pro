# 🚀 Guía Rápida: Cómo Probar el Chat

**Fecha:** 2025-01-27

---

## ✅ Pasos para Probar

### 1. Iniciar Servidores

#### Servidor WebSocket (Requerido)
```bash
cd backend/wedsocket
npm run start:dev
```

**Verifica que veas:**
```
Server started successfully
HTTP server: http://localhost:3006
WebSocket endpoints:
- Chat: ws://localhost:3006/chat
- Mensajes: ws://localhost:3006/mensajes
- Notificaciones: ws://localhost:3006/notificacion
```

#### Servidor API REST (Opcional - para crear conversaciones)
```bash
cd backend/APIREST
rails server
```

**Verifica que esté en:** `http://localhost:3000`

---

### 2. Iniciar Frontend

```bash
cd frontend
npm run dev
```

**Verifica que esté en:** `http://localhost:5173` (o el puerto que Vite asigne)

---

### 3. Autenticarse

1. Ve a: `http://localhost:5173/login`
2. Inicia sesión con un usuario válido
3. Verifica que tengas un token en `localStorage`:
   - Abre DevTools (F12)
   - Ve a Application → Local Storage
   - Debe haber `auth_token` y `user_data`

---

### 4. Acceder a ChatExample

1. Ve a: `http://localhost:5173/chat-example`
2. Deberías ver:
   - ✅ Información del usuario conectado
   - ✅ Campo para ingresar ID de conversación
   - ✅ Botón "Abrir Chat"
   - ✅ Icono de notificaciones (arriba a la derecha)

---

### 5. Obtener ID de Conversación

Tienes dos opciones:

#### Opción A: Desde la API REST (Recomendado)
```bash
# Obtener todas las conversaciones
curl -H "Authorization: Bearer TU_TOKEN" http://localhost:3000/api/v1/conversaciones

# O crear una nueva conversación
curl -X POST \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"conversacion": {"titulo": "Chat de Prueba"}}' \
  http://localhost:3000/api/v1/conversaciones
```

#### Opción B: Usar un ID de prueba
Si ya tienes conversaciones en la base de datos, puedes usar un ID existente.

---

### 6. Abrir Chat

1. En la página `/chat-example`, ingresa el ID de conversación en el campo
2. Haz clic en "Abrir Chat"
3. Deberías ver el componente de chat flotante en la esquina inferior derecha

---

### 7. Probar Funcionalidades

#### ✅ Enviar Mensaje
1. Escribe un mensaje en el input
2. Presiona Enter o haz clic en el botón de enviar
3. El mensaje debería aparecer en el chat

#### ✅ Indicador de Escritura
1. Empieza a escribir en el input
2. Deberías ver "Escribiendo..." en el chat (si hay otro usuario conectado)

#### ✅ Estado de Conexión
- Deberías ver "Conectado" en verde en el header del chat
- Si se desconecta, verás "Desconectado" en rojo

---

## 🧪 Probar con Dos Usuarios (Chat en Tiempo Real)

Para probar que los mensajes se reciben en tiempo real:

### Terminal 1: Usuario 1
1. Abre el navegador en modo incógnito
2. Inicia sesión con usuario 1
3. Ve a `/chat-example`
4. Abre el chat con el ID de conversación

### Terminal 2: Usuario 2
1. Abre otra ventana del navegador (o otro navegador)
2. Inicia sesión con usuario 2
3. Ve a `/chat-example`
4. Abre el chat con el **mismo** ID de conversación

### Probar:
- Usuario 1 envía un mensaje → Usuario 2 debe recibirlo
- Usuario 2 envía un mensaje → Usuario 1 debe recibirlo
- Usuario 1 escribe → Usuario 2 ve "Escribiendo..."

---

## 🔍 Verificar en Consola

Abre DevTools (F12) y ve a la pestaña Console. Deberías ver:

```
✅ Conectado al servidor de chat
✅ Unido a conversación: { conversacion_id: "..." }
📩 Nuevo mensaje recibido: { ... }
```

Si hay errores, revisa:
- ✅ Token de autenticación presente
- ✅ Servidor WebSocket corriendo
- ✅ URL correcta en variables de entorno

---

## ⚠️ Troubleshooting

### Error: "Debes estar autenticado"
- **Solución:** Inicia sesión primero en `/login`

### Error: "Socket no conectado"
- **Solución:** Verifica que el servidor WebSocket esté corriendo en puerto 3006

### No recibo mensajes
- **Verifica:** Ambos usuarios están en la misma conversación
- **Verifica:** El servidor WebSocket está corriendo
- **Verifica:** No hay errores en la consola del navegador

### Error de CORS
- **Solución:** El backend ya tiene CORS configurado, pero verifica que `VITE_WS_URL` esté correcto

---

## 📝 Variables de Entorno

Asegúrate de tener en `frontend/.env`:

```env
VITE_WS_URL=http://localhost:3006
VITE_REST_API_URL=http://localhost:3000/api/v1
```

---

## ✅ Checklist de Verificación

Antes de probar, verifica:

- [ ] Servidor WebSocket corriendo en puerto 3006
- [ ] Servidor API REST corriendo (opcional)
- [ ] Frontend corriendo
- [ ] Usuario autenticado (token presente)
- [ ] ID de conversación válido
- [ ] Sin errores en consola del navegador
- [ ] Sin errores en consola del servidor WebSocket

---

**¡Listo para probar!** 🎉

Si encuentras algún problema, revisa los logs del servidor WebSocket y la consola del navegador.


