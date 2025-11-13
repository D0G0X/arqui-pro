import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3006/valoraciones';

interface Valoracion {
  id: string;
  calificacion: number;
  comentario: string;
  cliente_id: string;
  proyecto_id: string;
  created_at: string;
  updated_at: string;
}

interface PromedioActualizado {
  arquitecto_id: string;
  promedio: number;
  total_valoraciones: number;
}

interface UseValoracionesOptions {
  arquitectoId?: string;
  proyectoId?: string;
  autoConnect?: boolean;
}

export const useValoraciones = (options: UseValoracionesOptions = {}) => {
  const { arquitectoId, proyectoId, autoConnect = true } = options;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([]);
  const [promedio, setPromedio] = useState<number | null>(null);
  const [totalValoraciones, setTotalValoraciones] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);

  // Callback para nueva valoración
  const handleNuevaValoracion = useCallback((valoracion: Valoracion) => {
    setValoraciones((prev) => {
      if (prev.some((v) => v.id === valoracion.id)) {
        return prev;
      }
      return [valoracion, ...prev];
    });
  }, []);

  // Callback para valoración actualizada
  const handleValoracionActualizada = useCallback((valoracion: Valoracion) => {
    setValoraciones((prev) =>
      prev.map((v) => (v.id === valoracion.id ? { ...v, ...valoracion } : v))
    );
  }, []);

  // Callback para valoración eliminada
  const handleValoracionEliminada = useCallback((data: { valoracion_id: string }) => {
    setValoraciones((prev) => prev.filter((v) => v.id !== data.valoracion_id));
  }, []);

  // Callback para promedio actualizado
  const handlePromedioActualizado = useCallback((data: PromedioActualizado) => {
    setPromedio(data.promedio);
    setTotalValoraciones(data.total_valoraciones);
  }, []);

  useEffect(() => {
    if (!autoConnect) return;

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Conectado al namespace /valoraciones');
      setIsConnected(true);

      // Unirse a las salas correspondientes
      if (arquitectoId) {
        socketInstance.emit('join_arquitecto', { arquitecto_id: arquitectoId });
      }
      if (proyectoId) {
        socketInstance.emit('join_proyecto', { proyecto_id: proyectoId });
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Desconectado del namespace /valoraciones');
      setIsConnected(false);
    });

    // Escuchar eventos de valoraciones
    socketInstance.on('valoracion:nueva', handleNuevaValoracion);
    socketInstance.on('valoracion:actualizada', handleValoracionActualizada);
    socketInstance.on('valoracion:eliminada', handleValoracionEliminada);
    socketInstance.on('valoracion:promedio_actualizado', handlePromedioActualizado);

    setSocket(socketInstance);

    return () => {
      socketInstance.off('valoracion:nueva', handleNuevaValoracion);
      socketInstance.off('valoracion:actualizada', handleValoracionActualizada);
      socketInstance.off('valoracion:eliminada', handleValoracionEliminada);
      socketInstance.off('valoracion:promedio_actualizado', handlePromedioActualizado);
      socketInstance.disconnect();
    };
  }, [autoConnect, arquitectoId, proyectoId, handleNuevaValoracion, handleValoracionActualizada, handleValoracionEliminada, handlePromedioActualizado]);

  const joinArquitecto = useCallback((id: string) => {
    if (socket && isConnected) {
      socket.emit('join_arquitecto', { arquitecto_id: id });
    }
  }, [socket, isConnected]);

  const joinProyecto = useCallback((id: string) => {
    if (socket && isConnected) {
      socket.emit('join_proyecto', { proyecto_id: id });
    }
  }, [socket, isConnected]);

  return {
    socket,
    valoraciones,
    promedio,
    totalValoraciones,
    isConnected,
    setValoraciones,
    joinArquitecto,
    joinProyecto,
  };
};
