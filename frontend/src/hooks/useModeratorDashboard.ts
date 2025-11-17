import { useEffect, useState, useCallback } from 'react';
import { useProyectos } from './useProyectos';
import { useIncidencias } from './useIncidencias';

interface UseModeratorDashboardOptions {
  moderadorId?: string;
  autoConnect?: boolean;
}

interface DashboardStats {
  totalProyectos: number;
  proyectosNuevos: number;
  totalIncidencias: number;
  incidenciasPendientes: number;
  incidenciasEnProceso: number;
  incidenciasResueltas: number;
  totalNotificaciones: number;
  notificacionesSinLeer: number;
}

export const useModeratorDashboard = (options: UseModeratorDashboardOptions = {}) => {
  const { moderadorId, autoConnect = true } = options;
  
  // Estado consolidado
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProyectos: 0,
    proyectosNuevos: 0,
    totalIncidencias: 0,
    incidenciasPendientes: 0,
    incidenciasEnProceso: 0,
    incidenciasResueltas: 0,
    totalNotificaciones: 0,
    notificacionesSinLeer: 0,
  });

  // Conectar a todos los websockets
  const proyectosWS = useProyectos({
    autoConnect,
  });

  const incidenciasWS = useIncidencias({
    esModerador: true,
    autoConnect,
  });

  // Sincronizar proyectos
  useEffect(() => {
    if (proyectosWS.proyectos.length > 0) {
      setProyectos(proyectosWS.proyectos);
    }
  }, [proyectosWS.proyectos]);

  // Sincronizar incidencias
  useEffect(() => {
    if (incidenciasWS.incidencias.length > 0) {
      setIncidencias(incidenciasWS.incidencias);
    }
  }, [incidenciasWS.incidencias]);

  // Calcular estadísticas en tiempo real
  const calcularEstadisticas = useCallback(() => {
    // Proyectos del último mes
    const unMesAtras = new Date();
    unMesAtras.setMonth(unMesAtras.getMonth() - 1);
    
    const proyectosNuevos = proyectos.filter(p => {
      const fecha = new Date(p.created_at || p.fecha_publicacion);
      return fecha >= unMesAtras;
    }).length;

    // Contar incidencias por estado
    const incidenciasPendientes = incidencias.filter(
      i => i.estado === 'pendiente'
    ).length;

    const incidenciasEnProceso = incidencias.filter(
      i => i.estado === 'en_proceso'
    ).length;

    const incidenciasResueltas = incidencias.filter(
      i => i.estado === 'resuelto' || i.estado === 'cerrado'
    ).length;

    setStats({
      totalProyectos: proyectos.length,
      proyectosNuevos,
      totalIncidencias: incidencias.length,
      incidenciasPendientes,
      incidenciasEnProceso,
      incidenciasResueltas,
      totalNotificaciones: 0,
      notificacionesSinLeer: 0,
    });
  }, [proyectos, incidencias]);

  // Recalcular estadísticas cuando cambien los datos
  useEffect(() => {
    calcularEstadisticas();
  }, [calcularEstadisticas]);

  // Función para inicializar datos desde API
  const initializeData = useCallback((
    initialProyectos?: any[],
    initialIncidencias?: any[]
  ) => {
    if (initialProyectos) setProyectos(initialProyectos);
    if (initialIncidencias) setIncidencias(initialIncidencias);
  }, []);

  // Estado de conexión consolidado
  const isConnected = 
    proyectosWS.isConnected || 
    incidenciasWS.isConnected;

  const allConnected =
    proyectosWS.isConnected &&
    incidenciasWS.isConnected;

  return {
    // Datos
    proyectos,
    incidencias,
    stats,
    
    // Estados de conexión
    isConnected,
    allConnected,
    connections: {
      proyectos: proyectosWS.isConnected,
      incidencias: incidenciasWS.isConnected,
    },
    
    // Funciones
    initializeData,
    setProyectos: proyectosWS.setProyectos,
    setIncidencias: incidenciasWS.setIncidencias,
    
    // Sockets individuales (por si se necesitan)
    sockets: {
      proyectos: proyectosWS.socket,
      incidencias: incidenciasWS.socket,
    },
  };
};
