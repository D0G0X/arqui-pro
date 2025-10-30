// Simple test client for wedsocket (socket.io-client)
// Usage:
// npm install socket.io-client
// TOKEN should be a valid Devise JWT from your Rails API

const { io } = require('socket.io-client');

const WS_HOST = process.env.WS_HOST || 'http://localhost:3000';
const TOKEN = process.env.TOKEN || 'Bearer <tu_jwt_aqui>';

// Chat namespace
const chat = io(WS_HOST + '/chat', {
  extraHeaders: { Authorization: TOKEN },
});

chat.on('connect', () => {
  console.log('chat connected', chat.id);
  chat.emit('join_conversation', { conversacion_id: 1 });
  setTimeout(() => {
    chat.emit('message:create', { contenido: 'Prueba desde test-client', remitente_id: 1, conversacion_id: 1 });
  }, 500);
});

chat.on('message:new', (m) => console.log('chat message:new', m));
chat.on('message:typing', (p) => console.log('chat typing', p));

// Notification namespace
const noti = io(WS_HOST + '/notificacion', { extraHeaders: { Authorization: TOKEN } });
noti.on('connect', () => {
  console.log('notificacion connected', noti.id);
  noti.emit('join_user', { usuario_id: 1 });
  setTimeout(() => {
    noti.emit('notification:create', { mensaje: 'Hola, tienes una notificación', usuario_id: 1 });
  }, 800);
});

noti.on('notification:new', (n) => console.log('notification:new', n));

chat.on('error', (e) => console.error('chat error', e));
noti.on('error', (e) => console.error('noti error', e));
