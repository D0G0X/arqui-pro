import WebSocket from 'ws';
import { RestClient } from '../services/RestClient';
import { WebSocketEvent } from '../types';

interface Client extends WebSocket {
  userId?: number;
  conversations?: Set<number>;
}

export class WebSocketServer {
  private wss: WebSocket.Server;
  private restClient: RestClient;
  private clients: Map<number, Set<Client>>;

  constructor(server: any) {
    this.wss = new WebSocket.Server({ server });
    this.restClient = new RestClient();
    this.clients = new Map();
    this.init();
  }

  private init() {
    this.wss.on('connection', async (ws: Client, req) => {
      // Extraer token del query string
      const token = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('token');
      
      if (!token) {
        ws.close(1008, 'Token required');
        return;
      }

      // Verificar token con REST API
      const auth = await this.restClient.verifyToken(token);
      if (!auth.success || !auth.data?.id) {
        ws.close(1008, 'Invalid token');
        return;
      }

      ws.userId = auth.data.id;
      ws.conversations = new Set();

      ws.on('message', async (data: string) => {
        try {
          const event: WebSocketEvent = JSON.parse(data);
          await this.handleEvent(ws, event);
        } catch (error) {
          ws.send(JSON.stringify({ 
            type: 'error', 
            error: 'Invalid message format' 
          }));
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });
    });
  }

  private async handleEvent(client: Client, event: WebSocketEvent) {
    const { type, payload, conversation_id } = event;

    // Añadir cliente a la sala de conversación si no está
    if (!client.conversations?.has(conversation_id)) {
      client.conversations?.add(conversation_id);
      if (!this.clients.has(conversation_id)) {
        this.clients.set(conversation_id, new Set());
      }
      this.clients.get(conversation_id)?.add(client);
    }

    switch (type) {
      case 'message':
        const msgResult = await this.restClient.createMessage({
          ...payload,
          usuario_id: client.userId!,
          conversacion_id: conversation_id
        });
        
        if (msgResult.success) {
          this.broadcast(conversation_id, {
            type: 'message',
            payload: msgResult.data!
          });
        }
        break;

      case 'typing':
        this.broadcast(conversation_id, {
          type: 'typing',
          payload: {
            usuario_id: client.userId!,
            typing: true
          }
        });
        break;

      case 'create_project':
        const projectResult = await this.restClient.createProject({
          ...payload,
          cliente_id: client.userId
        });

        if (projectResult.success) {
          this.broadcast(conversation_id, {
            type: 'project_created',
            payload: projectResult.data
          });
        }
        break;
    }
  }

  private handleDisconnect(client: Client) {
    client.conversations?.forEach(convId => {
      const clients = this.clients.get(convId);
      if (clients) {
        clients.delete(client);
        if (clients.size === 0) {
          this.clients.delete(convId);
        }
      }
    });
  }

  private broadcast(conversationId: number, message: any) {
    const clients = this.clients.get(conversationId);
    if (clients) {
      const messageStr = JSON.stringify(message);
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
  }
}