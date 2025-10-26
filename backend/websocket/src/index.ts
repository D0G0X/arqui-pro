import http from 'http';
import WebSocket, { WebSocketServer as WSS } from 'ws';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3001;
const JWT_SECRET = process.env.DEVISE_JWT_SECRET_KEY || 'tu_secreto_aqui';

// Crear servidor HTTP básico
const server = http.createServer();

const wss = new WSS({ server });

wss.on('connection', (ws: WebSocket, req) => {
  // Extraer token JWT del query string
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    ws.close(1008, 'Token requerido');
    return;
  }

  try {
    // Validar token con JWT
    const payload = jwt.verify(token, JWT_SECRET);
    console.log('Token válido:', payload);

    ws.send('Conexión aceptada. Token válido.');

    // Escuchar mensaje del cliente
    ws.on('message', (message) => {
      console.log('Mensaje recibido del cliente:', message.toString());
      // Responder con eco
      ws.send(`Eco: ${message.toString()}`);
    });

  } catch (error) {
    ws.close(1008, 'Token inválido');
    console.log('Token inválido, conexión cerrada');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor WebSocket corriendo en ws://localhost:${PORT}`);
});
