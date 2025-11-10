import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Configuración de CORS más permisiva
    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['*'],
      credentials: true,
    });

    // Usar el adaptador de Socket.IO
    app.useWebSocketAdapter(new IoAdapter(app));
    
    const port = process.env.PORT || 3006;
    await app.listen(port);
    
    console.log('=================================');
    console.log(`Server started successfully`);
    console.log(`HTTP server: http://localhost:${port}`);
    console.log(`WebSocket endpoints:`);
    console.log(`- Chat: ws://localhost:${port}/chat`);
    console.log(`- Mensajes: ws://localhost:${port}/mensajes`);
    console.log(`- Notificaciones: ws://localhost:${port}/notificacion`);
    console.log('=================================');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle any unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

bootstrap().catch(err => {
  console.error('Failed to bootstrap application:', err);
  process.exit(1);
});
