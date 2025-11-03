// Simple test client for wedsocket (socket.io-client)
// Usage:
// npm install socket.io-client
// TOKEN should be a valid Devise JWT from your Rails API

const { io } = require('socket.io-client');

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
  console.log('notificacion connected', noti.id);
  noti.emit('join_user', { usuario_id: 1 });
  setTimeout(() => {
    noti.emit('notification:create', { mensaje: 'Hola, tienes una notificación', usuario_id: 1 });
  }, 800);
});

noti.on('notification:new', (n) => console.log('notification:new', n));

chat.on('error', (e) => console.error('chat error', e));
noti.on('error', (e) => console.error('noti error', e));
