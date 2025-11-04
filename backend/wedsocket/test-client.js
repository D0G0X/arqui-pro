// Simple test client for wedsocket (socket.io-client)
// Usage:
// npm install socket.io-client
// 
// MODO 1 - Sin autenticación (solo eventos que no requieren BD):
// node test-client.js
//
// MODO 2 - Con autenticación (para crear mensajes reales):
// TOKEN="Bearer tu_jwt_aqui" node test-client.js
//
// MODO 3 - Testing completo con API REST:
// 1. Inicia API REST: cd backend/APIREST && rails s
// 2. Obtén token: curl -X POST http://localhost:3000/login -d '{"email":"test@test.com","password":"123456"}'
// 3. Ejecuta: TOKEN="Bearer eyJ..." node test-client.js

const { io } = require('socket.io-client');

const WS_HOST = process.env.WS_HOST || 'http://localhost:3006';
const WS_HOST = process.env.WS_HOST || 'http://localhost:3006';
const TOKEN = process.env.TOKEN || 'Bearer <tu_jwt_aqui>';
const USUARIO_ID = process.env.USUARIO_ID;
const CONVERSACION_ID = process.env.CONVERSACION_ID;

if (!USUARIO_ID || !CONVERSACION_ID) {
  console.error('Error: Necesitas proporcionar USUARIO_ID y CONVERSACION_ID como variables de entorno');
  process.exit(1);
}

// Chat namespace
const chat = io(WS_HOST + '/chat', {
  extraHeaders: { Authorization: TOKEN },
  transports: ['websocket']
});

chat.on('connect', () => {
  console.log('chat connected', chat.id);
  chat.emit('unirseAConversacion', CONVERSACION_ID);
  setTimeout(() => {
    chat.emit('enviarMensaje', {
      contenido: 'Prueba desde test-client',
      emisor_id: USUARIO_ID,
      conversacion_id: CONVERSACION_ID,
      tipo: 'texto'
    });
  }, 500);
});

chat.on('nuevoMensaje', (m) => console.log('Nuevo mensaje recibido:', m));
chat.on('error', (error) => console.log('Error en chat:', error));

// Mensajes namespace
const mensajes = io(WS_HOST + '/mensajes', { extraHeaders: { Authorization: TOKEN } });
mensajes.on('connect', () => {
  console.log('mensajes connected', mensajes.id);
  setTimeout(() => {
    mensajes.emit('enviarMensaje', {
      contenido: 'Prueba desde namespace de mensajes',
      emisor_id: USUARIO_ID,
      conversacion_id: CONVERSACION_ID,
      tipo: 'texto'
    });
  }, 1000);
});

mensajes.on('nuevoMensaje', (m) => console.log('Nuevo mensaje en namespace mensajes:', m));
mensajes.on('error', (error) => console.log('Error en mensajes:', error));

// Notification namespace
const noti = io(WS_HOST + '/notificaciones', { extraHeaders: { Authorization: TOKEN } });
noti.on('connect', () => {
  console.log('✅ Notificaciones connected:', noti.id);
  
  // Conectar usuario
  console.log('📨 Enviando: usuario:conectar');
  noti.emit('usuario:conectar', { usuario_id: 'test-user-123' });
});

noti.on('usuario:conectado', (data) => {
  console.log('✅ Usuario conectado:', data);
});

noti.on('usuario:online', (data) => {
  console.log('🟢 Usuario online:', data);
});

noti.on('notificacion:nueva', (n) => {
  console.log('🔔 Nueva notificación:', n);
});

noti.on('notificacion:sistema', (n) => {
  console.log('📢 Notificación del sistema:', n);
});

noti.on('disconnect', () => {
  console.log('❌ Notificaciones disconnected');
});

noti.on('connect_error', (error) => {
  console.error('❌ Notificaciones connection error:', error.message);
});

chat.on('error', (err) => {
  console.error('❌ Chat error:', err);
  if (err.message === 'could_not_create_message') {
    console.error('💡 SOLUCIÓN:');
    console.error('   1. Asegúrate que la API REST esté corriendo: cd backend/APIREST && rails s');
    console.error('   2. Obtén un token válido: POST http://localhost:3000/login');
    console.error('   3. Ejecuta: TOKEN="Bearer tu_token" node test-client.js');
  }
});
noti.on('error', (e) => console.error('❌ Notificaciones error:', e));

// Mantener el proceso vivo
console.log('\n📡 Cliente WebSocket ejecutándose...');
console.log('Presiona Ctrl+C para detener');
console.log('\n📊 RESUMEN DEL TEST:');
console.log('✅ Eventos que funcionan SIN API REST:');
console.log('   - join_conversation, leave_conversation');
console.log('   - message:typing (indicador de escritura)');
console.log('   - usuario:conectar (notificaciones)');
console.log('');
console.log('⚠️  Eventos que REQUIEREN API REST + Token:');
console.log('   - message:create (guardar mensaje en BD)');
console.log('   - notification:create (guardar notificación en BD)');
console.log('');

