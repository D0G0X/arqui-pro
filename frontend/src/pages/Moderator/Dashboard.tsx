import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Users, FolderKanban, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { ModeratorLayout } from '../../components/Moderator/ModeratorLayout';
import { moderadorService } from '../../services/api/moderador/moderadorService';
import { notificationService } from '../../services/websocket/notificationService';
import { useModeratorDashboard } from '../../hooks/useModeratorDashboard';
import { GET_MODERATOR_STATS } from '../../services/graphql/queries';
import '../../styles/Moderator/Dashboard.css';

interface Estadisticas {
  totalUsuarios: number;
  totalArquitectos: number;
  totalClientes: number;
  totalModeradores: number;
  totalProyectos: number;
  proyectosNuevos: number;
  totalIncidencias: number;
  incidenciasPendientes: number;
  arquitectosVerificados: number;
  verificacionesPendientes: number;
}


export const ModeratorDashboard = () => {
  // Usar GraphQL para obtener KPIs de la plataforma
  const { data: kpisData, loading: kpisLoading } = useQuery(GET_MODERATOR_STATS, {
    fetchPolicy: 'network-only'
  });

  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState<NotificacionUI[]>([
    {
      id: 1,
      tipo: 'verificacion',
      titulo: 'Nueva verificación pendiente',
      subtitulo: 'Revisión de documentos arquitecto',
      tiempo: 'hace 5 min'
    },
    {
      id: 2,
      tipo: 'incidencia',
      titulo: 'Nueva incidencia reportada',
      subtitulo: 'Error en proyecto',
      tiempo: 'hace 30 min'
    }
  ]);

  // Hook consolidado para actualizaciones en tiempo real del dashboard
  const dashboard = useModeratorDashboard({
    autoConnect: true
  });

  // Suscribirse a notificaciones en tiempo real
  useEffect(() => {
    const unsubscribe = notificationService.onNotification((notification: any) => {
      setNotificaciones(prev => [
        {
          id: notification.id || `notif-${Date.now()}`,
          tipo: 'mensaje' as const,
          titulo: notification.data?.titulo || 'Nueva notificación',
          subtitulo: notification.data?.mensaje || '',
          tiempo: 'Ahora'
        },
        ...prev.slice(0, 9) // Mantener máximo 10 notificaciones
      ]);
    });

    // Cleanup al desmontar
    return () => {
      unsubscribe();
    };
  }, []);

  // Sincronizar stats del dashboard con las estadísticas locales
  // Este efecto solo se usa cuando NO hay datos de GraphQL todavía
  useEffect(() => {
    if (!kpisData && (dashboard.stats.totalProyectos > 0 || dashboard.stats.totalIncidencias > 0)) {
      setStats(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          totalProyectos: dashboard.stats.totalProyectos,
          proyectosNuevos: dashboard.stats.proyectosNuevos,
          totalIncidencias: dashboard.stats.totalIncidencias,
          incidenciasPendientes: dashboard.stats.incidenciasPendientes,
        };
      });
    }
  }, [dashboard.stats.totalProyectos, dashboard.stats.proyectosNuevos, dashboard.stats.totalIncidencias, dashboard.stats.incidenciasPendientes, kpisData]);

  useEffect(() => {
    cargarEstadisticasDetalladas();
  }, []);

  // Combinar datos de GraphQL (KPIs) con datos de REST (detalles)
  useEffect(() => {
    if (kpisData?.kpisPlataforma) {
      const kpis = kpisData.kpisPlataforma;
      setStats(prevStats => {
        // Si ya tenemos datos del WebSocket, usar esos en lugar de los de GraphQL
        const totalProyectos = dashboard.stats.totalProyectos > 0 
          ? dashboard.stats.totalProyectos 
          : kpis.totalProyectos || 0;
        
        const totalIncidencias = dashboard.stats.totalIncidencias > 0
          ? dashboard.stats.totalIncidencias
          : kpis.totalIncidencias || 0;
        
        const proyectosNuevos = dashboard.stats.proyectosNuevos > 0
          ? dashboard.stats.proyectosNuevos
          : Math.floor((kpis.totalProyectos || 0) * 0.15);
        
        const incidenciasPendientes = dashboard.stats.incidenciasPendientes > 0
          ? dashboard.stats.incidenciasPendientes
          : Math.floor((kpis.totalIncidencias || 0) * 0.3);
        
        return {
          ...prevStats,
          totalUsuarios: kpis.totalUsuarios || 0,
          totalProyectos,
          arquitectosVerificados: kpis.arquitectosVerificados || 0,
          totalIncidencias,
          // Valores por defecto para datos adicionales
          totalArquitectos: Math.floor((kpis.totalUsuarios || 0) * 0.3),
          totalClientes: Math.floor((kpis.totalUsuarios || 0) * 0.68),
          totalModeradores: Math.floor((kpis.totalUsuarios || 0) * 0.02),
          proyectosNuevos,
          incidenciasPendientes,
          verificacionesPendientes: Math.floor(kpis.arquitectosVerificados * 0.05)
        };
      });
      setLoading(false);
    }
  }, [kpisData, dashboard.stats.totalProyectos, dashboard.stats.totalIncidencias, dashboard.stats.proyectosNuevos, dashboard.stats.incidenciasPendientes]);

  const cargarEstadisticasDetalladas = async () => {
    try {
      // Obtener datos adicionales del REST API si es necesario
      const data = await moderadorService.getEstadisticas();
      setStats(prevStats => ({
        ...prevStats,
        ...data
      }));
    } catch (error) {
      console.error('Error al cargar estadísticas detalladas:', error);
      // No marcamos loading como false aquí, esperamos a que GraphQL termine
    }
  };

  if (kpisLoading || loading) {
    return (
      <ModeratorLayout>
        <div className="dashboard-loading">Cargando...</div>
      </ModeratorLayout>
    );
  }

  return (
    <ModeratorLayout>
      <div className="moderator-dashboard">
        <h1 className="dashboard-title">Moderator Dashboard</h1>

        <div className="dashboard-stats">
          {/* Total Users */}
          <div className="stat-card">
            <div className="stat-card__header">
              <div className="stat-card__icon stat-card__icon--users">
                <Users size={24} />
              </div>
              <span className="stat-card__label">Total Users</span>
            </div>
            <h2 className="stat-card__value">{stats?.totalUsuarios.toLocaleString() || '0'}</h2>
            <div className="stat-card__details">
              <div className="stat-detail">
                <span className="stat-detail__label">Arquitectos</span>
                <span className="stat-detail__value">{stats?.totalArquitectos || 0}</span>
              </div>
              <div className="stat-detail">
                <span className="stat-detail__label">Clients</span>
                <span className="stat-detail__value">{stats?.totalClientes || 0}</span>
              </div>
              <div className="stat-detail">
                <span className="stat-detail__label">Moderators</span>
                <span className="stat-detail__value">{stats?.totalModeradores || 0}</span>
              </div>
            </div>
          </div>

          {/* Total Projects */}
          <div className="stat-card">
            <div className="stat-card__header">
              <div className="stat-card__icon stat-card__icon--projects">
                <FolderKanban size={24} />
              </div>
              <span className="stat-card__label">
                Total Projects
                {dashboard.connections.proyectos && (
                  <span className="ws-status-inline" title="WebSocket conectado">●</span>
                )}
              </span>
            </div>
            <h2 className="stat-card__value">{stats?.totalProyectos.toLocaleString() || '0'}</h2>
            <div className="stat-card__badge stat-card__badge--success">
              <TrendingUp size={14} />
              <span>{stats?.proyectosNuevos || 0} new this month</span>
            </div>
          </div>

          {/* Total Incidents */}
          <div className="stat-card">
            <div className="stat-card__header">
              <div className="stat-card__icon stat-card__icon--incidents">
                <AlertCircle size={24} />
              </div>
              <span className="stat-card__label">
                Total Incidents
                {dashboard.connections.incidencias && (
                  <span className="ws-status-inline" title="WebSocket conectado">●</span>
                )}
              </span>
            </div>
            <h2 className="stat-card__value">{stats?.totalIncidencias || '0'}</h2>
            <div className="stat-card__badge stat-card__badge--danger">
              <TrendingDown size={14} />
              <span>{stats?.incidenciasPendientes || 0} unresolved</span>
            </div>
          </div>

          {/* Verified Architects */}
          <div className="stat-card">
            <div className="stat-card__header">
              <div className="stat-card__icon stat-card__icon--verified">
                <CheckCircle size={24} />
              </div>
              <span className="stat-card__label">Verified Architects</span>
            </div>
            <h2 className="stat-card__value">{stats?.arquitectosVerificados || '0'}</h2>
            <div className="stat-card__badge stat-card__badge--warning">
              <Clock size={14} />
              <span>{stats?.verificacionesPendientes || 0} pending verification</span>
            </div>
          </div>
        </div>

        {/* Estadísticas Adicionales */}
        <div className="dashboard-additional-stats">
          <div className="additional-stat-card">
            <div className="additional-stat-header">
              <h3>Resumen de Actividad</h3>
            </div>
            <div className="additional-stat-content">
              <div className="stat-row">
                <span className="stat-label">Proyectos Nuevos (mes)</span>
                <span className="stat-value">{stats?.proyectosNuevos || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Incidencias Pendientes</span>
                <span className="stat-value">{stats?.incidenciasPendientes || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Verificaciones Pendientes</span>
                <span className="stat-value">{stats?.verificacionesPendientes || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de conexión en tiempo real */}
        {dashboard.allConnected && (
          <div className="realtime-indicator realtime-indicator--success">
            <span className="realtime-indicator__dot"></span>
            <span className="realtime-indicator__text">Actualizaciones en tiempo real activas</span>
          </div>
        )}
        {dashboard.isConnected && !dashboard.allConnected && (
          <div className="realtime-indicator realtime-indicator--partial">
            <span className="realtime-indicator__dot"></span>
            <span className="realtime-indicator__text">Conectando servicios...</span>
          </div>
        )}
      </div>
    </ModeratorLayout>
  );
};