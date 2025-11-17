import { useEffect, useState, useCallback } from 'react';
import { useProyectos } from './useProyectos';
import { useAvances } from './useAvances';
import { useValoraciones } from './useValoraciones';
import { useIncidencias } from './useIncidencias';

interface UseArchitectDashboardOptions {
  arquitectoId: string;
  autoConnect?: boolean;
}

interface DashboardStats {
  totalProyectos: number;
  proyectosEnProgreso: number;
  proyectosCompletados: number;
  totalAvances: number;
  promedio: number;
  totalValoraciones: number;
  incidenciasPendientes: number;
  incidenciasResueltas: number;
  totalIncidencias: number;
}

export const useArchitectDashboard = (options: UseArchitectDashboardOptions) => {
  const { arquitectoId, autoConnect = true } = options;
  
  // Estado consolidado usando any para evitar conflictos de tipos
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [avances, setAvances] = useState<any[]>([]);
  const [valoraciones, setValoraciones] = useState<any[]>([]);
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProyectos: 0,
    proyectosEnProgreso: 0,
    proyectosCompletados: 0,
    totalAvances: 0,
    promedio: 0,
    totalValoraciones: 0,
    incidenciasPendientes: 0,
    incidenciasResueltas: 0,
    totalIncidencias: 0,
  });

  // Conectar a todos los websockets
  const proyectosWS = useProyectos({
    arquitectoId,
    autoConnect,
  });

  const avancesWS = useAvances({
    arquitectoId,
    autoConnect,
  });

  const valoracionesWS = useValoraciones({
    arquitectoId,
    autoConnect,
  });

  const incidenciasWS = useIncidencias({
    usuarioId: arquitectoId,
    autoConnect,
  });

  // Sincronizar proyectos
  useEffect(() => {
    if (proyectosWS.proyectos.length > 0) {
      setProyectos(proyectosWS.proyectos);
    }
  }, [proyectosWS.proyectos]);

  // Sincronizar avances
  useEffect(() => {
    if (avancesWS.avances.length > 0) {
      setAvances(avancesWS.avances);
    }
  }, [avancesWS.avances]);

  // Sincronizar valoraciones
  useEffect(() => {
    if (valoracionesWS.valoraciones.length > 0) {
      setValoraciones(valoracionesWS.valoraciones);
    }
  }, [valoracionesWS.valoraciones]);

  // Sincronizar incidencias
  useEffect(() => {
    if (incidenciasWS.incidencias.length > 0) {
      setIncidencias(incidenciasWS.incidencias);
    }
  }, [incidenciasWS.incidencias]);

  // Calcular estadísticas en tiempo real
  const calcularEstadisticas = useCallback(() => {
    const proyectosEnProgreso = proyectos.filter(
      p => !p.valoracion_promedio || p.valoracion_promedio === 0
    ).length;
    
    const proyectosCompletados = proyectos.filter(
      p => p.valoracion_promedio && p.valoracion_promedio > 0
    ).length;

    const incidenciasPendientes = incidencias.filter(
      i => i.estado === 'pendiente' || i.estado === 'en_proceso'
    ).length;

    const incidenciasResueltas = incidencias.filter(
      i => i.estado === 'resuelto' || i.estado === 'cerrado'
    ).length;

    setStats({
      totalProyectos: proyectos.length,
      proyectosEnProgreso,
      proyectosCompletados,
      totalAvances: avances.length,
      promedio: valoracionesWS.promedio || 0,
      totalValoraciones: valoracionesWS.totalValoraciones || 0,
      incidenciasPendientes,
      incidenciasResueltas,
      totalIncidencias: incidencias.length,
    });
  }, [proyectos, avances, valoraciones, incidencias, valoracionesWS.promedio, valoracionesWS.totalValoraciones]);

  // Recalcular estadísticas cuando cambien los datos
  useEffect(() => {
    calcularEstadisticas();
  }, [calcularEstadisticas, valoracionesWS.promedio, valoracionesWS.totalValoraciones]);

  // Función para inicializar datos desde API
  const initializeData = useCallback((
    initialProyectos: any[],
    initialAvances?: any[],
    initialValoraciones?: any[],
    initialIncidencias?: any[]
  ) => {
    setProyectos(initialProyectos);
    if (initialAvances) setAvances(initialAvances);
    if (initialValoraciones) setValoraciones(initialValoraciones);
    if (initialIncidencias) setIncidencias(initialIncidencias);
  }, []);

  // Estado de conexión consolidado
  const isConnected = 
    proyectosWS.isConnected || 
    avancesWS.isConnected || 
    valoracionesWS.isConnected || 
    incidenciasWS.isConnected;

  const allConnected =
    proyectosWS.isConnected &&
    avancesWS.isConnected &&
    valoracionesWS.isConnected &&
    incidenciasWS.isConnected;

  return {
    // Datos
    proyectos,
    avances,
    valoraciones,
    incidencias,
    stats,
    
    // Estados de conexión
    isConnected,
    allConnected,
    connections: {
      proyectos: proyectosWS.isConnected,
      avances: avancesWS.isConnected,
      valoraciones: valoracionesWS.isConnected,
      incidencias: incidenciasWS.isConnected,
    },
    
    // Funciones
    initializeData,
    setProyectos: proyectosWS.setProyectos,
    setAvances: avancesWS.setAvances,
    setValoraciones: valoracionesWS.setValoraciones,
    setIncidencias: incidenciasWS.setIncidencias,
    
    // Sockets individuales (por si se necesitan)
    sockets: {
      proyectos: proyectosWS.socket,
      avances: avancesWS.socket,
      valoraciones: valoracionesWS.socket,
      incidencias: incidenciasWS.socket,
    },
  };
};
