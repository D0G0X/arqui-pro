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
const TOKEN = process.env.TOKEN || 'Bearer <tu_jwt_aqui>';
const TESTING_MODE = !TOKEN.includes('<tu_jwt_aqui>');

console.log('🔌 Conectando a WebSocket Server:', WS_HOST);
console.log('🔑 Token:', TOKEN);
console.log('🧪 Modo:', TESTING_MODE ? 'FULL (con API REST)' : 'BÁSICO (sin persistencia)');

// Chat namespace
const chat = io(WS_HOST + '/chat', {
  extraHeaders: { Authorization: TOKEN },
  transports: ['websocket']
});

chat.on('connect', () => {
  console.log('✅ Chat connected:', chat.id);
  
  // Unirse a conversación (no requiere BD)
  console.log('📨 Enviando: join_conversation');
  chat.emit('join_conversation', { conversacion_id: 1 });
  
  if (TESTING_MODE) {
    // Enviar mensaje REAL (requiere API REST + token válido)
    setTimeout(() => {
      console.log('📨 Enviando: message:create (REQUIERE API REST)');
      chat.emit('message:create', { 
        contenido: 'Prueba desde test-client', 
        remitente_id: 1, 
        conversacion_id: 1 
      });
    }, 500);
  } else {
    console.log('⚠️  SKIP: message:create (necesitas token válido y API REST corriendo)');
  }
  
  // Simular escritura (no requiere BD)
  setTimeout(() => {
    console.log('📨 Enviando: message:typing');
    chat.emit('message:typing', { 
      usuario_id: 1, 
      conversacion_id: 1, 
      typing: true 
    });
  }, 1000);
});

chat.on('conversation:joined', (data) => {
  console.log('✅ Conversation joined:', data);
});

chat.on('message:new', (m) => {
  console.log('📬 New message received:', m);
});

chat.on('message:typing', (p) => {
  console.log('⌨️  Typing indicator:', p);
});

chat.on('disconnect', () => {
  console.log('❌ Chat disconnected');
});

chat.on('connect_error', (error) => {
  console.error('❌ Chat connection error:', error.message);
});

// Notification namespace
const noti = io(WS_HOST + '/notificaciones', { 
  extraHeaders: { Authorization: TOKEN },
  transports: ['websocket']
});

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

